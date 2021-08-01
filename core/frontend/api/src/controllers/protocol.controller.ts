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
        version: '21.07.26',
        description: 'Front End Module',
        started: new Date(),
        config: {
            channel: 'frontend',
            permissions: {
                stop: false,
                restart: true,
                ports: [80, 443]
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

    constructor(
        @Inject('SystemService') private systemService,
        @Inject('ProtocolService') private protocolService,
        @Inject('BucketService') private bucketService,
    ) {

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
                name: 'proxy',
                version: 'latest'
            }]
        };

        await this.systemService.registerModule(payload).toPromise();

        await this.protocolService.sendMessage({
            channel: 'hub',
            api: 'module',
            act: 'mapPort',
            payload: {
                channel: 'frontend',
                port: process.env.public_port,
                defaults: {
                    url: '/',
                    login: '/view-auth'
                }
            }
        }).toPromise();

        this.logger.log('FrontEnd application started');
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
