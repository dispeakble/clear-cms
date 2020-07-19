import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {AppService} from "./app.service";
import {payloadInterface} from "../interfaces/payload.interface";


@Injectable()
export class ProtocolService {

    public config = {
        name: 'Hub',
        id: 'hub',
        channel: 'hub'
    };

    constructor(
        @Inject('REDIS_SERVICE') private redisClient: ClientProxy
    ) {
    }

    public start() {
        return this.redisClient.connect();
    }

    public sendMessage(pattern, data: any){
        return this.redisClient.send(pattern, data).toPromise();
    }

    public emitEvent(pattern, data: any){
        return this.redisClient.emit(pattern, data);
    }

}