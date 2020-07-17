import {Controller, Inject} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {AppService} from "../services/app.service";

@Controller()
export class ProtocolController {

    constructor(private readonly protocolService: ProtocolService, private readonly appService: AppService) {

    }


    @EventPattern({type: 'hub'})//TODO should be an ENV or a config
    public onMessage(@Payload() message: string, @Ctx() context: RedisContext) {

        console.log('Hub has a message', typeof message, message);

        const data = JSON.parse(message);

        switch (data.api) {
            case 'hub':

                const result = this.appService.perform({
                    act: data.act,
                    payload: data.payload
                });

                this.protocolService.sendMessage({type: data.channel}, result);
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
