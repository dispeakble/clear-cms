import {
    Body,
    Controller, Get, HttpStatus, Inject, Post, Req, Res, Session, UseGuards, Logger
} from "@nestjs/common";
import {Request, Response} from "express";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {HttpAuthGuard} from "../guards/http.auth.guard";
import multer from "multer";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {
    private moduleConfig: ModuleInterface = {
        name: 'proxy',
        version: '21.07.28',
        description: 'the main http proxy (gateway)',
        started: new Date(),
        config: {
            channel: 'proxy',
            restart: true,
            stop: false
        },
        dependencies: [{
            name: 'hub',
            version: 'latest'
        }]
    };

    private portMap = {};

    private help = {
        timer: {
            props: {
                batches: {}
            },
            start: (params) => {
                this.help.timer.props[params.id] = [];
                this.help.timer.props[params.id].push(new Date().getTime());
            },
            add: (params) => {
                this.help.timer.props[params.id].push(new Date().getTime());
            },
            end: (params) => {
                this.help.timer.props[params.id].push(new Date().getTime());
                const diffs = [];
                this.help.timer.props[params.id].map((d, i) => {
                    if(i > 0) {
                        diffs.push(d - this.help.timer.props[params.id][i - 1]);
                    }
                    return d;
                });
                return diffs;
            }
        }
    };

    constructor(
        @Inject('ProtocolService') public protocolService,
        @Inject('SystemService') private systemService,
        @Inject('AppService') private appService,
        @Inject('SessionService') private sessionService,
        @Inject('WsGateway') private wsGateway,
        private logger: Logger
        ) {
        this.protocolService.start().then(async () => {
            this.portMap = await this.protocolService.getValue('portMap') || [];
            const response = await this.systemService.registerModule(this.moduleConfig).toPromise();
            this.logger.log(response);
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
    @Post('*')
    async onPost(@Res() res: Response, @Req() req: Request, @Session() session, @Body() body) {
        try {
            let totalFiles = 0;
            let fileCount = 0;
            let multerFinish = false;
            const multerObj = multer({
                storage: {
                    _handleFile: (req, file, cb) => {
                        totalFiles = Number(req.body.totalFiles);
                        multerFinish = true;
                        //we will start a REDIS handshake with the consumer
                        let handshake = this.protocolService.startHandshake({
                            channel: this.portChannel(),
                            indication: {
                                api: 'bucket',
                                act: 'upload'
                            }
                        }, this.moduleConfig);

                        //we subscribe to the consumer
                        handshake.theObserver.subscribe(data => {
                            this.logger.log(data);
                        }, err => {
                            this.logger.log(err);
                        }, () => {
                            req.next();
                            this.logger.log('upload complete');
                        })

                        //the consumer calls back with the caller ID and then subscribes to the pusher
                        handshake.thePromise.then(handshakeResponse => {

                            //we use the pusher to send the init file upload command
                            handshakeResponse['thePusher'].next({
                                api: req.body.api,
                                act: req.body.act,
                                payload: {
                                    type: 'meta',
                                    length: file.size,
                                    path: req.body.path,
                                    filename: file.fieldname,
                                    replace: "true" === req.body.replace
                                }
                            });

                            setTimeout(() => {
                                let index = 0;
                                const t = Math.random();
                                file.stream.on('data', (data) => {
                                    index++;
                                    handshakeResponse['thePusher'].next({
                                        payload: {
                                            type: 'data',
                                            index: `${t}-${index}`,
                                            buffer: data
                                        }
                                    });
                                });

                                file.stream.on('end', () => {
                                    handshakeResponse['thePusher'].complete();
                                    fileCount++;
                                    if(totalFiles === fileCount){
                                        res.end(JSON.stringify({message: 'upload complete'}));
                                    }
                                });

                                file.stream.on('error', (error) => {
                                    handshakeResponse['thePusher'].error(error);
                                    handshakeResponse['thePusher'].complete();
                                    res.end(JSON.stringify({message: 'upload error'}));
                                });
                            }, 1000);



                        });
                    },
                    _removeFile: (req, file, cb) => {

                    }
                }
            }).any();

            multerObj(req, res, (err) => {
                if (err) {
                    this.logger.log(err)
                    return;
                }

            });

            const start_date = new Date().getTime();
            const channel = this.portChannel();

            if(typeof channel !== "string" || !channel) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.end(`Port ${channel} not mapped`);
                return;
            }

            const payload = {
                channel: channel,
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

            const postSubscriber = this.protocolService.sendMessage(payload);

            let endPost = true;

            postSubscriber.subscribe((response) => {
                switch (response.type) {
                    case "meta":
                        res.set('Cache-Control', 'public, max-age=0');
                        res.status(HttpStatus.OK);
                        break;
                    case "String":
                        if (response.callback) {
                            endPost = false;
                            const callback = response.callback;
                            const cb_payload = {
                                channel: 'proxy',
                                api: callback.api,
                                act: callback.act,
                                payload: {
                                    data: callback.payload,
                                    session: session
                                }
                            };
                            return this.perform(cb_payload).then((response) => {
                                if(!multerFinish){
                                    res.send(response);
                                    res.end();
                                }
                            });

                        }
                        res.send(response.data);
                        break;
                    case "Buffer":
                        res.write(Buffer.from(response.data));
                        break;
                }

            }, (error) => {
                this.logger.log(error);
                res.send("error");
                const end_date = new Date().getTime();
                const diffDate = new Date(end_date - start_date);
                this.logger.log('Request took ' + diffDate.getSeconds() + '.' + diffDate.getMilliseconds() + ' from redis')
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            }, () => {
                if(!multerFinish){
                    endPost && res.end();
                }
            });
        } catch (err) {
            res.end(JSON.stringify(err));
        }

    }

    //@UseGuards(HttpAuthGuard)
    @Get('*')
    async onGet(@Res() res: Response, @Req() req: Request, @Session() session) {
        try {

            const fileReq = {
                "channel": "system",
                "payload": {
                    "ip": req.ip,
                    "hostname": req.hostname,
                    "path": req.params[0],
                    "headers": req.headers,
                    "query": req.query
                }
            };

            const fileStats = await this.protocolService.getMeta(fileReq);
            if(!fileStats) {
                res.status(HttpStatus.NOT_FOUND);//TODO ADD A 404 PAGE
                res.end();
                return;
            }

            if (!session.user && req.headers['sec-fetch-dest'] === 'document') {

                const hasAccess = await this.protocolService.checkAccess(fileReq);
                if (!hasAccess.access) {
                    res.status(hasAccess.location.status);
                    res.set('Location', hasAccess.location);
                    res.status(hasAccess.status)
                    res.end();
                    return;
                }
            }

            const cacheReq = await this.protocolService.getValue(`system_${fileStats.data.file_name}`);
            //const cacheReq = null;

            if (cacheReq) {
                const exp_date = new Date(cacheReq.expires);

                if (cacheReq.ETag === fileStats.data.etagId && exp_date > new Date()) {
                    return this.respond({res, file: cacheReq, fileStats: {
                        data: {
                            etagId: cacheReq.ETag
                        }
                    }, finish: true});
                }
            }

            const getSubscriber = this.protocolService.sendGet(fileReq);

            let bigBuffer = Buffer.alloc(0);
            const file_meta = {
                content_length: 0,
                content_type: ''
            };

            getSubscriber.subscribe((data) => {
                switch (data.type) {
                    case "meta":
                        this.respond({res, file: data, fileStats});

                        file_meta.content_type = data.content_type;
                        file_meta.content_length = data.content_length;
                        break;
                    case "Buffer":
                        bigBuffer = Buffer.concat([bigBuffer, Buffer.from(data.data)]);
                        res.write(Buffer.from(data.data));
                        break;
                }

            }, (error) => {
                this.logger.log(error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            }, () => {
                res.end();

                if(bigBuffer && bigBuffer.length){
                    const expireDate = new Date();

                    //TODO get from some env variable
                    const expire_seconds = 604800;
                    expireDate.setSeconds(expireDate.getSeconds() + expire_seconds);
                    this.protocolService.setValue(`system_${fileStats.data.file_name}`, {
                        expires: expireDate,
                        ETag: fileStats.data.etagId,
                        content_length: file_meta.content_length,
                        content_type: file_meta.content_type,
                        data: bigBuffer
                    });
                }

            });
        } catch (err) {
            res.end(JSON.stringify(err));
        }
    }

    private respond(params) {
        const { res, file, fileStats } = params;
        res.set("Content-Type", file.content_type);
        res.set("Content-Length", file.content_length);
        res.set('Content-Security-Policy', "img-src 'self'; default-src 'self'; script-src 'self'; style-src 'unsafe-inline' 'self' https://fonts.googleapis.com *.fontawesome.com; font-src 'self' data: https://fonts.gstatic.com *.fontawesome.com");
        res.set('X-Frame-Options', 'SAMEORIGIN');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Strict-Transport-Security', 'max-age=604800; includeSubDomains; preload');
        res.set('Cache-Control', 'public, max-age=604800');
        res.set('ETag', fileStats.data.etagId);
        res.status(HttpStatus.OK);
        if(params.finish) {
            res.write(Buffer.from(file.data.data));
            res.end();
        }
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

    //Microservice protocol
    @MessagePattern({message: 'proxy'})
    public async onRedisMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'proxy'})
    public async onRedisEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    private portChannel() {

        return this.portMap[process.env.backend_port];

        /*const headers = params.headers;
        let port = headers.host.split(':')[1];

        if (!port) {
            if (headers.hasOwnProperty('x-forwarded-port') && headers['x-forwarded-port']) {
                port = +headers['x-forwarded-port'];
            } else {
                port = 0;
            }
        }

        if (!this.portMap.hasOwnProperty(port) || !this.portMap[port]) {
            this.logger.log(headers)
            this.logger.log(JSON.stringify(headers));
            return null;
        }
        if(params.returnPort) {
            if(this.portMap.hasOwnProperty(port)){
                return +port;
            }
        } else {
            return this.portMap[port];
        }*/

    }

    private onMessage(params) {
        return new Promise(async (resolve) => {

            const data = params.data;

            const payload: payloadInterface = {
                channel: data.module,
                api: data.api,
                act: data.act,
                payload: data.payload
            };

            if (data.payload && data.payload.useSession) {
                const sessionData = await this.sessionService.parseCookie({cookies: params.client.handshake.headers.cookie.replace(/ /g, "")});

                if (sessionData) {
                    payload.payload.client = sessionData.user;
                }

            }

            try {
                resolve(await this.protocolService.sendMessage(payload).toPromise());
            } catch (err) {
                this.logger.log(err);
            }

        })
    }

    private perform(params: payloadInterface) {
        try {
            const callback = (response) => {
                return this.perform(response)
            }
            params.payload = Object.assign({}, params.payload, {perform: callback})
            return this[params.api + 'Service'].perform(params, this.moduleConfig);
        } catch (ex) {
            return {
                status: 500,
                message: 'App.Controller.ts: Invalid ' + params.api + ':' + params.act
            };
        }
    }

}