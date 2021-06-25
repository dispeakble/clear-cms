import {
    Controller, Get, HttpStatus, Inject, Post, Req, Res, Session, UseGuards
} from "@nestjs/common";
import {Request, Response} from "express";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {HttpAuthGuard} from "../guards/http.auth.guard";
import multer from "multer";
import {Observable} from "rxjs";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {Readable} from "stream";

@Controller()
export class AppController {

    private portMap = {};

    private moduleConfig: ModuleInterface = {
        name: 'proxy',
        version: '21.06.16',
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

    constructor(@Inject('ProtocolService') public protocolService, @Inject('SystemService') private systemService, @Inject('AppService') private appService, @Inject('SessionService') private sessionService, @Inject('WsGateway') private wsGateway) {
        this.protocolService.start().then(async () => {
            this.portMap = await this.protocolService.getValue('portMap') || [];
            const response = await this.systemService.registerModule(this.moduleConfig).toPromise();
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
    @Post('*')
    async onPost(@Res() res: Response, @Req() req: Request, @Session() session) {
        try {
            const multerObj = multer({
                storage: {
                    _handleFile: (req, file, cb) => {

                        const readable = new Readable();
                        readable._read = () => {} // _read is required but you can noop it


                        //TODO could be too late for data here. check md5 check sum
                        //we listen to data events on the file stream and push the binaries
                        file.stream.on('data', function (data) {
                            readable.push(data);
                        });

                        file.stream.on('end', function () {
                            readable.push(null);
                        });


                        //we will start a REDIS handshake with the consumer
                        let handshake = this.protocolService.startHandshake({
                            channel: this.portChannel(req.headers),
                            indication: {
                                api: 'bucket',
                                act: 'uploadFiles'
                            }
                        }, this.moduleConfig);

                        //we subscribe to the consumer

                        handshake.theObserver.subscribe(data => {
                            console.log(data);
                        }, err => {
                            console.log(err);
                        }, () => {
                            req.next();
                            console.log('upload complete');
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

                            readable.on("data", (data) => {
                                handshakeResponse['thePusher'].next({
                                    payload: {
                                        type: 'data',
                                        buffer: data
                                    }
                                });
                            })

                            readable.on("error", (error) => {
                                handshakeResponse['thePusher'].error(error);
                                handshakeResponse['thePusher'].complete();
                            });

                            readable.on("end", () => {
                                handshakeResponse['thePusher'].complete();
                            });

                        });
                    },
                    _removeFile: (req, file, cb) => {

                    }
                }
            }).any();

            multerObj(req, res, (err) => {
                if (err) {
                    console.log(err)
                    return;
                }

            });

            const start_date = new Date().getTime();
            const channel = this.portChannel(req.headers);

            if (!channel) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.end('Port not mapped');
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
                                res.send(response);
                                res.end();
                            });

                        }
                        res.send(response.data);
                        break;
                    case "Buffer":
                        res.write(Buffer.from(response.data));
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

    @UseGuards(HttpAuthGuard) @Get('*')
    async onGet(@Res() res: Response, @Req() req: Request, @Session() session) {
        try {

            const channel = this.portChannel(req.headers);
            //TODO big threat here. use encrypted keys from now on

            if (!channel) {
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


            if (!session.hasOwnProperty('user')) {
                const hasAccess = await this.protocolService.checkAccess(payload);
                if (!hasAccess.access) {
                    res.status(hasAccess.location.status);
                    res.set('Location', hasAccess.location);
                    res.status(hasAccess.status)
                }
            }

            const start_date = new Date().getTime();
            let cache_name = req.hostname + req.url;

            if (Object.keys(req.query).length) {
                cache_name = cache_name + JSON.stringify(req.query);
            }

            const fileStats = await this.protocolService.getMeta(payload);
            const cachedrequest = await this.protocolService.getValue(fileStats.file_name);

            if (cachedrequest) {
                if (cachedrequest.ETag === fileStats.etagId) {
                    const modifiedDate = new Date(fileStats.modified);
                    const exp_date = new Date(cachedrequest.expires);

                    if (exp_date > new Date() && exp_date > modifiedDate) {
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

    /*async asyncForEach(array: Array<any>, callback: (item: any, index: number, array: Array<any>) => void): Promise<void> {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }*/

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

    /*-- End Redis subscriber bidirectional lock --*/

    private portChannel(headers) {
        let port = headers.host.split(':')[1];

        if (!port) {
            if (headers.hasOwnProperty('x-forwarded-port') && headers['x-forwarded-port']) {
                port = +headers['x-forwarded-port'];
            } else {
                port = 0;
            }
        }

        if (!this.portMap.hasOwnProperty(port) || !this.portMap[port]) {
            console.log(headers)
            console.log(JSON.stringify(headers));
            return null;
        }
        return this.portMap[port];
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

            if (data.payload && data.payload.useSession) {
                const sessionData = await this.sessionService.parseCookie({cookies: params.client.handshake.headers.cookie.replace(/ /g, "")});

                if (sessionData) {
                    payload.payload.client = sessionData.user;
                }

            }

            const response = {
                id: params.data.id,
                data: null
            }
            try {
                this.protocolService.sendMessage(payload).subscribe(data => {
                    resolve(data);
                }, err => {
                    resolve(err);
                }, () => {

                });

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