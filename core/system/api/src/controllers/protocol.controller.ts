import {Controller, Inject, Logger} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Observable} from "rxjs";

@Controller()
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    public handhakes: any = {};
    private moduleConfig: ModuleInterface = {
        name: 'system',
        version: '21.06.16',
        description: 'System Module',
        started: new Date(),
        config: {
            channel: 'system',
            permissions: {
                stop: false,
                restart: true,
                ports: [80]
            }
        },
        dependencies: [{
            name: 'hub',
            version: 'latest'
        }, {
            name: 'proxy',
            version: 'latest'
        }]
    };

    private mainService;

    constructor(@Inject('SystemService') private systemService, @Inject('ProtocolService') private protocolService, @Inject('AdminProfileService') private adminProfileService, @Inject('AdminThemesService') private adminThemesService, @Inject('PublicThemesService') private publicThemesService, @Inject('AuthService') private authService, @Inject('BucketService') private bucketService) {
        this.mainService = this;
    }

    @MessagePattern({message: 'system'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'system'})
    public onEvent(@Payload() payload: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(payload);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        this.logger.log('system connected to redis');
        const payload: ModuleInterface = {
            name: 'system',
            version: '21.01.12',
            description: 'the system api and client',
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
        this.systemService.registerModule(payload);
        const response = await this.protocolService.sendMessage({
            channel: 'hub',
            api: 'module',
            act: 'mapPort',
            payload: {
                channel: 'system',
                port: process.env.backend_port
            }
        }).toPromise();
        console.log(response);
    }

    /*-- Start Redis handshake --*/

    public startHandshake(params) {
        const myId = Math.round(Math.random() * 1000000);
        return {
            thePromise: new Promise((resolve) => {
                this.handhakes[myId] = resolve;
            }),
            theObserver: this.protocolService.sendMessage({
                channel: params.channel,
                api: 'main',
                act: 'requestHandshake',
                payload: {
                    callerId: myId,
                    respond: {
                        channel: this.moduleConfig.config.channel,
                        api: 'main',
                        act: 'confirmHandshake'
                    }

                }
            })
        }
    }

    public requestHandshake(params) {
        return new Observable(subscriber => {
            const myId = Math.round(Math.random() * 1000000);//TODO use UUID
            subscriber.next({
                responderId: myId,
                message: 'handshake request received'
            });

            const initiator = this.protocolService.sendMessage({
                channel: params.respond.channel,
                api: params.respond.api,
                act: params.respond.act,
                type: params.type,
                payload: {
                    responderId: myId,
                    callerId: params.callerId,
                    message: 'handshake confirmed'
                }
            })

            const callbacks = {
                onData: data => {
                    this.perform({
                        channel: params.respond.channel,
                        type: data.type,
                        api: params.respond.api,
                        act: params.respond.act,
                        payload: data
                    }).subscribe(response => {
                        console.log('loading...');
                    }, err => {
                        //TODO send to caller the error
                        console.log('handshake callback error');
                        console.log(err);
                    }, () => {
                        console.log('handshake callback complete');
                    });
                },
                onError: err => {
                    console.log(err);
                },
                onComplete: () => {
                    console.log('handshake finished');
                }
            };

            //TODO create a bucket handshake before confirming this handshake


            initiator.subscribe(data => {
                callbacks.onData(data);
            }, err => {
                callbacks.onError(err);
            }, () => {
                callbacks.onComplete();
                subscriber.complete();
            })

        })
    }

    public confirmHandshake(params) {
        return new Observable(subscriber => {
            try {
                if (!this.handhakes.hasOwnProperty(params.callerId)) {
                    subscriber.complete();
                }
                this.handhakes[params.callerId]({
                    responderId: params.responderId,
                    thePusher: subscriber
                });
            } catch (err) {
                console.log(err.message)
            }
        });
    }

    /*-- End Redis handshake --*/

    private registerModule(params) {
        setTimeout(async () => {
            try {
                const moduleResponse = await this.protocolService.registerModule(this.moduleConfig);

                switch (moduleResponse.status) {
                    case 'failed':
                        switch (moduleResponse.resolution.action) {
                            case 'retry':
                                this.registerModule({
                                    after: moduleResponse.resolution.after
                                });
                                break;
                            default:
                                this.logger.log(JSON.stringify(moduleResponse));
                                throw new Error('system module cannot be registered');
                                break;
                        }
                        break;
                    case 'registered':
                        this.logger.log('System registered');
                        break;
                }

            } catch (ex) {
                this.logger.log(ex);
            }


        }, params.after * 1000);
    }

    private perform(params: payloadInterface) {
        try {
            if ('main' !== params.api) {
                return this[params.api + 'Service'].perform(params, this.moduleConfig);
            } else {
                return this[params.act](params.payload, this.moduleConfig);
            }
        } catch (ex) {
            return {
                error: 'Could not find ' + params.api + ':' + params.act
            };
        }
    }

}
