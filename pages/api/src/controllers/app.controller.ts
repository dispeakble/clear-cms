import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'pages',
        version: '20.07.19',
        description: 'pages module',
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

    @MessagePattern({message: 'pages'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        console.log(data);

        switch (data.api) {
            default:
                return null;
                break;
        }
    }

    @EventPattern({event: 'pages'})
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
        console.log('pages module connected to redis');
        this.registerModule({after: 2})
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
                                console.log(JSON.stringify(moduleResponse));
                                throw new Error('PAGES module cannot be registered');
                                break;
                        }
                        break;
                    case 'registered':
                        console.log('Pages module registered');
                        break;
                }

            } catch (ex) {
                console.log(ex);
            }


        }, params.after * 1000);
    }

}
