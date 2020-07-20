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
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        console.log(data);

        switch (data.api) {
            default:
                return null;
                break;
        }
    }

    @EventPattern({event: 'dev'})
    public onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        console.log(data);

        switch (data.api) {
            default:
                return null;
                break;
        }
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        console.log('dev connected to redis');
        this.registerModule({after: 2})
    }

    private registerModule(params) {
        setTimeout(async () => {
            try {
                const moduleResponse = await this.protocolService.registerModule(this.config);

                console.log(moduleResponse)

                switch (moduleResponse.payload.status) {
                    case 'failed':
                        switch (moduleResponse.payload.resolution.action) {
                            case 'retry':
                                this.registerModule({
                                    after: moduleResponse.payload.resolution.after
                                });
                                break;
                            default:
                                console.log(moduleResponse);
                                break;
                        }
                        break;
                    case 'registered':
                        console.log('Dev registered');
                        break;
                }

            } catch (ex) {
                console.log(ex);
            }


        }, params.after * 1000);
    }

}
