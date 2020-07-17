import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {
    public config: any = {
        "channel":"dev",
        "name": "dev",
        "version": 0.1,
        "description": "Dev test",
        "dependencies": ["system"]
    };

    constructor(private readonly protocolService: ProtocolService) {

    }

    @EventPattern({type: 'dev'})
    public onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log('dev has a message', typeof data, data);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        console.log('dev connected to redis');
        setTimeout(() => {
            console.log('will send handshake');
            this.protocolService.sendHandshake(this.config);
        }, 2000);
    }

}
