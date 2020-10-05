import {Controller, Logger} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class AppController {

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
        }, {
            name: 'proxy',
            version: 'latest'
        }],
    };

    public logger: Logger = new Logger('App.Controller');

    constructor(private readonly protocolService: ProtocolService) {

    }

    @MessagePattern({message: 'system'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext){
        return this.perform(data);
    }

    @EventPattern({event: 'system'})
    public onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {

        this.logger.log('system event', JSON.stringify(data));

        return this.perform(data);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        this.logger.log('system connected to redis');
        this.registerModule({after: 0});
        await this.protocolService.emitEvent({//TODO ask HUB for this. Hub must check mappings.
            channel: 'proxy',
            payload: {
                api: 'protocol',
                act: 'mapRequest',
                channel: 'system',
                payload: {
                    channel: 'system',
                    type: 'get'
                }}
        })
    }

    private registerModule(params){
        setTimeout(async () => {

            try {
                const moduleResponse = await this.protocolService.registerModule(this.config);

                switch(moduleResponse.status){
                    case 'failed':
                        switch(moduleResponse.resolution.action){
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

            } catch (ex){
                this.logger.log(ex);
            }


        }, params.after * 1000);
    }

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'][data.act](data.payload, this.config);
        } catch (ex) {//TODO return proper error to caller
            this.logger.log(ex);
            return {
                message:'Could not find ' + data.api + ':' + data.act
            };
        }
    }

}
