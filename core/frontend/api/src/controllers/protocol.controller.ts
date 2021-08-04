import {Controller, Inject, Logger} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    private moduleConfig: ModuleInterface = {
        name: 'frontend',
        version: '21.08.04',
        description: 'Frontend Module',
        started: new Date(),
        config: {
            channel: 'frontend',
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
            name: 'frontendproxy',
            version: 'latest'
        }]
    };

    private mainService;

    constructor(@Inject('FrontendService') private frontendService, @Inject('ProtocolService') private protocolService, @Inject('PublicThemesService') private publicThemesService, @Inject('AuthService') private authService, @Inject('BucketService') private bucketService, @Inject('CategoriesService') private categoriesService, @Inject('PagesService') private pagesService) {
        this.mainService = this;
    }

    @MessagePattern({message: 'frontend'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'frontend'})
    public onEvent(@Payload() payload: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(payload);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();

        const payload: ModuleInterface = {
            name: 'frontend',
            version: '21.01.12',
            description: 'the frontend api and client',
            started: new Date(),
            config: {
                restart: true,
                stop: false
            },
            dependencies: [{
                name: 'hub',
                version: 'latest'
            },{
                name: 'frontendproxy',
                version: 'latest'
            }]
        };
        const startupChores = Promise.all([this.frontendService.registerModule(payload).toPromise(),
            this.protocolService.sendMessage({
                channel: 'hub',
                api: 'module',
                act: 'mapPort',
                payload: {
                    channel: 'frontend',
                    target: 'frontendproxy',
                    port: process.env.backend_port,
                    defaults: {
                        url: '/',
                        login: '/view-auth'
                    }
                }
            }).toPromise()
        ]);

        startupChores.then(() => {
            this.logger.log('Frontend application started');
        });
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
