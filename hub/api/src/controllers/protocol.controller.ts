import {Controller, Inject} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleService} from "../services/module.service";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";

@Controller()
export class ProtocolController {

    private config: ModuleInterface = {
        name: 'hub',
        version: '20.07.19',
        description: 'Hub Module',
        started: new Date(),
        config: {
            permissions: {
                stop: false,
                restart: true
            }
        },
        dependencies: [],
    };

    constructor(private readonly protocolService: ProtocolService,
                private readonly moduleService: ModuleService)
    {}

    @MessagePattern({message: 'hub'})//TODO should be an ENV or a config
    public async onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext): Promise<payloadInterface> {

        const resp = this.perform(data);
        return resp;

        switch (data.api) {
            case 'module':
                const result = await this.moduleService.perform({
                    act: data.act,
                    payload: data.payload
                });

                result.name = data.payload.name;

                let payload: payloadInterface = {
                    api: 'module',
                    act: 'confirm',
                    channel: 'hub',
                    payload: result,
                };

                return payload;
                break;
            default:
                return null;
                break;
        }


    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        console.log('hub connected to redis');
    }

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'][data.act](data.payload, this.config);
        } catch (ex) {
            console.log(ex);
            return {
                message:'Could not find ' + data.api + ':' + data.act
            };
        }
    }


}
