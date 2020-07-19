import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";


@Injectable()
export class ProtocolService {

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }



    public start() {
        return this.redisService.connect();
    }

    public registerModule(data) {
        let payload: payloadInterface = {
            api: 'module',
            act: 'register',
            channel: 'dev',
            payload: data
        };
        return this.redisService.send({type: 'hub'}, JSON.stringify(payload));
    }

}