import {Controller, Inject, Logger} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class ProtocolController {

    public logger: Logger = new Logger('App.Controller');
    private config: ModuleInterface = {
        name: 'system',
        version: '20.07.19',
        description: 'System Module',
        started: new Date(),
        config: {
            permissions: {
                stop: false,
                restart: true,
                ports: [80]
            }
        },
        dependencies: [{
            name: 'hub',
            version: 'latest'
        }/*, {
            name: 'proxy',
            version: 'latest'
        }*/],
    };

    constructor(
      @Inject('SystemService') private systemService,
      @Inject('ProtocolService') private protocolService,
      @Inject('AdminProfileService') private adminProfileService,
      @Inject('HttpService') private httpService,
      @Inject('AuthService') private authService,
      ) {

    }

    @MessagePattern({message: 'system'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'system'})
    public onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        return this.perform(data);
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
            }],
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
        });
        console.log(response);
    }

    private registerModule(params) {
        setTimeout(async () => {
            try {
                const moduleResponse = await this.protocolService.registerModule(this.config);

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

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'].perform(data, this.config);
        } catch (ex) {
            return {
                error:'Could not find ' + data.api + ':' + data.act
            };
        }
    }

}
