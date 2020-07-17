import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";


@Injectable()
export class ProtocolService {

    private config = {
        name: 'Development',
        id: 'dev',
        channel: 'dev'
    };

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }



    public start() {
        return this.redisService.connect();
    }

    public sendHandshake(data) {
        let payload = {
            api: 'hub',
            act: 'handShake',
            channel: 'dev',
            payload: data
        };
        return this.redisService.emit({type: 'hub'}, JSON.stringify(payload));
    }

}