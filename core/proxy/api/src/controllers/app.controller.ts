import {
    ArgumentsHost,
    Catch,
    Controller,
    Get,
    HttpStatus,
    Inject,
    Post,
    Req,
    Res,
    Session, UnauthorizedException,
    UseGuards
} from "@nestjs/common";
import {Request, Response} from "express";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {HttpAuthGuard} from "../guards/http.auth.guard";
import has = Reflect.has;

@Controller()
export class AppController {

    private portMap = {};

    constructor(
        @Inject('ProtocolService') private protocolService,
        @Inject('SystemService') private systemService,
        @Inject('AppService') private appService,
        @Inject('SessionService') private sessionService,
        @Inject('WsGateway') private wsGateway
    ) {
        this.protocolService.start().then(async () => {
            this.portMap = await this.protocolService.getValue('portMap');
            const payload: ModuleInterface = {
                name: 'proxy',
                version: '20.12.18',
                description: 'the main http proxy (gateway)',
                started: new Date(),
                config: {
                    restart: true,
                    stop: false
                },
                dependencies: [{
                    name: 'hub',
                    version: 'latest'
                }]
            };
            const response = await this.systemService.registerModule(payload);
            console.log(response);
            this.wsGateway.registerCallbacks({
                callbacks: {
                    "onMessage": async (params) => {
                        const response = await this.onMessage(params);
                        return response;
                    }
                }
            });
        })
    }

    //TODO ADD POST HTTP GUARD SEPARATELY
    @Post('/')
    async onPost(@Res() res: Response, @Req() req: Request, @Session() session) {

        try {
            const start_date = new Date().getTime();
            const channel = this.portChannel(req.headers);

            if(!channel){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.end('Port not mapped');
                return;
            }

            const payload = {
                channel: req.body.module,
                api: req.body.api,
                act: req.body.act,
                payload: {
                    ip: req.ip,
                    hostname: req.hostname,
                    body: req.body,
                    params: req.params,
                    headers: req.headers
                }
            };

            const postSubscriber = this.protocolService.sendPost(payload);
            let bigBuffer = Buffer.alloc(0);

            let endPost = true;

            postSubscriber.subscribe((data) => {
                switch(data.type){
                    case "meta":
                        res.set('Cache-Control', 'public, max-age=0');
                        res.status(HttpStatus.OK);
                        break;
                    case "String":

                        if (data.callback) {
                            endPost = false;
                            const callback = data.callback;
                            const cb_payload = {
                                channel: 'proxy',
                                api: callback.api,
                                act: callback.act,
                                payload: {data: callback.payload, session: session}
                            };
                            return this.perform(cb_payload).then((response) => {
                                res.send(response);
                                res.end();
                            });

                        }
                        res.send(data.data);
                        break;
                    case "Buffer":
                        bigBuffer = Buffer.concat([bigBuffer, Buffer.from(data.data)]);
                        res.write(Buffer.from(data.data));
                        break;
                }

            }, (error) => {
                console.log(error);
                res.send("error");
                const end_date = new Date().getTime();
                const diffDate = new Date(end_date - start_date);
                console.log('Request took ' + diffDate.getSeconds() + '.' + diffDate.getMilliseconds() + ' from redis')
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            }, () => {
                endPost && res.end();
            });
        } catch (err) {
            res.end(JSON.stringify(err));
        }



    }

    @UseGuards(HttpAuthGuard)
    @Get('*')
    async onGet(@Res() res: Response, @Req() req: Request, @Session() session) {
        try {

            const channel = this.portChannel(req.headers);
            //TODO big threat here. use encrypted keys from now on

            if(!channel){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.end('Port not mapped');
                return;
            }

            const payload = {
                channel: channel,
                payload: {
                    ip: req.ip,
                    hostname: req.hostname,
                    query: req.query,
                    params: req.params,
                    headers: req.headers
                }
            };


            if(!session.hasOwnProperty('user')){
                const hasAccess = await this.protocolService.checkAccess(payload);
                if(!hasAccess.access){
                    res.status(hasAccess.location.status);
                    res.set('Location', hasAccess.location);
                    res.status(hasAccess.status)
                }
            }

            const start_date = new Date().getTime();
            let cache_name = req.hostname + req.url;

            if(Object.keys(req.query).length){
                cache_name = cache_name + JSON.stringify(req.query);
            }

            const fileStats = await this.protocolService.getMeta(payload);
            const cachedrequest = await this.protocolService.getValue(fileStats.file_name);

            if(cachedrequest){
                if(cachedrequest.ETag === fileStats.etagId){
                    const modifiedDate = new Date(fileStats.modified);
                    const exp_date = new Date(cachedrequest.expires);

                    if(exp_date > new Date() && exp_date > modifiedDate){
                        res.set("Content-Type", cachedrequest.content_type);
                        res.set("Content-Length", cachedrequest.content_length);
                        res.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'unsafe-inline' 'self' https://fonts.googleapis.com *.fontawesome.com; font-src 'self' data: https://fonts.gstatic.com *.fontawesome.com");
                        res.set('X-Frame-Options', 'SAMEORIGIN');
                        res.set('X-Content-Type-Options', 'nosniff');
                        res.set('Strict-Transport-Security', 'max-age=604800; includeSubDomains; preload');
                        res.set('Cache-Control', 'public, max-age=604800');
                        res.set('ETag', fileStats.etagId);
                        res.status(HttpStatus.OK);
                        res.write(Buffer.from(cachedrequest.data));
                        res.end();
                        return true;
                    }
                }
            }

            const getSubscriber = this.protocolService.sendGet(payload);

            let bigBuffer = Buffer.alloc(0);
            const file_meta = {
                content_length: 0,
                content_type: ''
            };

            getSubscriber.subscribe((data) => {
                switch (data.type) {
                    case "meta":
                        //TODO add this to every request
                        res.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'unsafe-inline' 'self' https://fonts.googleapis.com *.fontawesome.com; font-src 'self' data: https://fonts.gstatic.com *.fontawesome.com");
                        res.set('X-Frame-Options', 'SAMEORIGIN');
                        res.set('X-Content-Type-Options', 'nosniff');
                        res.set('Strict-Transport-Security', 'max-age=604800; includeSubDomains; preload');
                        res.set('Cache-Control', 'public, max-age=604800');
                        res.set('ETag', fileStats.etagId);
                        res.status(HttpStatus.OK);
                        file_meta.content_type = data.content_type;
                        file_meta.content_length = data.content_length;

                        res.set("Content-Type", data.content_type);
                        res.set("Content-Length", data.content_length);
                        break;
                    case "Buffer":
                        bigBuffer = Buffer.concat([bigBuffer, Buffer.from(data.data)]);
                        res.write(Buffer.from(data.data));
                        break;
                }

            }, (error) => {
                console.log(error);
                const end_date = new Date().getTime();
                const diffDate = new Date(end_date - start_date);
                console.log('Request took ' + diffDate.getSeconds() + '.' + diffDate.getMilliseconds() + ' from redis')
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                //res.end();
            }, () => {
                const end_date = new Date().getTime();
                const diffDate = new Date(end_date - start_date);
                console.log('Request took ' + diffDate.getSeconds() + '.' + diffDate.getMilliseconds() + ' from redis');

                //getSubscriber.unsubscribe();
                res.end();
                const expireDate = new Date();

                //TODO get from some env variable
                const expire_seconds = 604800;
                expireDate.setSeconds(expireDate.getSeconds() + expire_seconds);
                this.protocolService.setValue(fileStats.file_name, {
                    expires: expireDate,
                    ETag: fileStats.etagId,
                    content_length: file_meta.content_length,
                    content_type: file_meta.content_type,
                    data: bigBuffer
                });
            });
        } catch (err) {
            res.end(JSON.stringify(err));
        }


    }

    private portChannel(headers){
        let port = headers.host.split(':')[1];

        if(!port){
            if(headers.hasOwnProperty('x-forwarded-port') && headers['x-forwarded-port']){
                port = +headers['x-forwarded-port'];
            } else {
                port = 0;
            }
        }

        if(!this.portMap.hasOwnProperty(port) || !this.portMap[port]){
            console.log(headers)
            console.log(JSON.stringify(headers));
            return null;
        }
        return this.portMap[port];
    }

    async onApplicationBootstrap() {
        this.appService.perform({
            api: 'app',
            act: 'portMappingListen',
            payload: {
                callback: async (data) => {
                    let portMap = await this.protocolService.getValue('portMap');
                    if (!portMap) {
                        portMap = {};
                    }
                    portMap = Object.assign({}, portMap || {}, data);
                    await this.protocolService.setValue('portMap', portMap);

                    this.portMap = data;
                }
            }
        });
    }

    private onMessage(params) {
        return new Promise(async (resolve) => {
            //console.log('got message from gateway', params)

            const data = params.data;

            const payload: payloadInterface = {
                channel: data.module,
                api: data.api,
                act: data.act,
                payload: data.payload
            };

            if(data.payload && data.payload.useSession){
                const sessionData = await this.sessionService.parseCookie({cookies: params.client.handshake.headers.cookie});

                if(sessionData){
                    payload.payload.client = sessionData.user;
                }

            }

            const response = {
                id: params.data.id,
                data: null
            }
            try {
                response.data = await this.protocolService.sendMessage(payload);

                // if (response.data.callback) {
                //     const callback = response.data.callback;
                //     const cb_payload = {
                //         channel: params.module,
                //         api: callback.api,
                //         act: callback.act,
                //         payload: {data: callback.payload, client: params.client}
                //     };
                //     response.data = await this.perform(cb_payload);
                // }
            } catch (err) {
                console.log(err);
            }

            resolve(response);

        })
    }

    private perform(data: payloadInterface) {
        try {
            console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({
                act: data.act
            }) + ')');
            const api = data.api;
            const apiName = api + 'Service';
            const payload = {act: data.act, payload: data.payload};
            return this[apiName].perform(payload);
        } catch (ex) {
            return {
                status: 500,
                message: 'App.Controller.ts: Invalid ' + data.api + ':' + data.act
            };
        }
    }

}