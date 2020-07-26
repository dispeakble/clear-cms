import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'dev',
        version: '20.07.19',
        description: 'dev test',
        started: new Date(),
        config: {
            restart: true,
            stop: false
        },
        dependencies: [
            {
                name: 'system',
                version: 'latest'
            }, {
                name: 'hub',
                version: 'latest'
            }
        ],
    };

    constructor(private readonly protocolService: ProtocolService) {

    }

    @MessagePattern({message: 'dev'})
    public async onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'dev'})
    public async onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {


        const resp = await this.perform(data);
        return resp;
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        await this.registerModule({after: 0});
        try {
            await this.protocolService.sendMessage({//TODO ask HUB for this. Hub must check mappings.
                channel: 'proxy',
                payload: {api: 'protocol', act: 'mapRequest', payload: {channel: 'dev', type: 'get'}}
            })
        } catch (ex){
            console.log(ex);
        }

    }

    private registerModule(params) {
        return new Promise((resolve_register) => {
            setTimeout(async () => {
                try {
                    const moduleResponse = await this.protocolService.registerModule(this.config);

                    switch (moduleResponse.status) {
                        case 'failed':
                            switch (moduleResponse.resolution.action) {
                                case 'retry':
                                    await this.registerModule({
                                        after: moduleResponse.resolution.after
                                    });
                                    resolve_register(true);
                                    break;
                                default:
                                    resolve_register(true);
                                    console.log(moduleResponse);
                                    break;
                            }
                            break;
                        case 'registered':
                            resolve_register(true);
                            console.log('Dev module registered');
                            break;
                    }

                } catch (ex) {
                    resolve_register(true);
                    console.log(ex);
                }

            }, params.after * 1000);
        });

    }

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'].perform(data);
        } catch (ex) {
            console.log(ex);
            return {
                message:'Could not find ' + data.api + ':' + data.act
            };
        }
    }

}
