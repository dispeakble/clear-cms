import {Controller, Inject} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleService} from "../services/module.service";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";

@Controller()
export class ProtocolController {

    private config: ModuleInterface = {
        name: `${process.env.app}_hub`,
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

    @MessagePattern({message: `${process.env.app}_hub`})//TODO should be an ENV or a config
    public async onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext): Promise<payloadInterface> {
        const response = await this.perform(data);
        return response;
    }

    @EventPattern({event: `${process.env.app}_hub`})
    public async onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        const response = await this.perform(data);
        return response;
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        this.moduleService.checkModules();
        console.log('Hub started')
    }

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'].perform(data, this.config);
        } catch (ex) {
            return {
                message:'Could not find ' + data.api + ':' + data.act
            };
        }
    }


}
