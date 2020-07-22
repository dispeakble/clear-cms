import {Controller, Get, Post, Res, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class ProxyController {

    private config: ModuleInterface = {
        name: 'proxy',
        version: '20.07.19',
        description: 'proxy module',
        started: new Date(),
        config: {
            restart: true,
            stop: false
        },
        dependencies: [
            {
                name: 'system',
                version: 'latest'
            },
            {
                name: 'hub',
                version: 'latest'
            }
        ],
    };

    constructor(private readonly protocolService: ProtocolService) {

    }

    @Post()
    onPost(@Res() res: Response) {
        res.status(HttpStatus.CREATED).send();
    }

    @Get()
    onGet(@Res() res: Response) {
        res.status(HttpStatus.OK).json([]);
    }

    @MessagePattern({message: 'proxy'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        console.log(data);
    }

    @EventPattern({event: 'proxy'})
    public onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        console.log(data);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        console.log('Proxy module connected to redis');
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
                                console.log(moduleResponse);
                                break;
                        }
                        break;
                    case 'registered':
                        console.log('Proxy module registered');
                        break;
                }

            } catch (ex) {
                console.log(ex);
            }


        }, params.after * 1000);
    }

}
