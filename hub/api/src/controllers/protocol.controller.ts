import {Controller, Inject} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleService} from "../services/module.service";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class ProtocolController {

    constructor(private readonly protocolService: ProtocolService,
                private readonly moduleService: ModuleService)
    {}

    @MessagePattern({message: 'hub'})//TODO should be an ENV or a config
    public async onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext): Promise<payloadInterface> {

        console.log(data);

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


}
