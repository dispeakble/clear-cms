import {Controller, Inject, Logger} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Observable} from "rxjs";

@Controller()
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
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

    constructor(@Inject('SystemService') private systemService, @Inject('ProtocolService') private protocolService, @Inject('AdminProfileService') private adminProfileService, @Inject('AdminThemesService') private adminThemesService, @Inject('PublicThemesService') private publicThemesService, @Inject('AuthService') private authService, @Inject('BucketService') private bucketService, @Inject('CategoriesService') private categoriesService, @Inject('PagesService') private pagesService) {
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
        this.systemService.registerModule(payload).subscribe(data => {
            console.log(data);
        }, err => {
            console.log(err);
        }, () => {
            console.log('registration complete')
        });

        this.protocolService.sendMessage({
            channel: 'hub',
            api: 'module',
            act: 'mapPort',
            payload: {
                channel: 'system',
                port: process.env.backend_port
            }
        }).subscribe(data => {
            console.log(data);
        }, err => {
            console.log(err);
        }, () => {
            console.log('registration complete')
        });
    }

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
            const callback = (response) => {
                return this.perform(response)
            }
            params.payload = Object.assign({}, params.payload, {perform: callback})
            return this[params.api + 'Service'].perform(params, this.moduleConfig);
        } catch (ex) {
            return {
                error: 'Could not find ' + params.api + ':' + params.act
            };
        }
    }

}
