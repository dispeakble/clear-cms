import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {AppService} from "./app.service";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

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

    public ping(data: any, config: ModuleInterface){
        return {
            name: config.name,
            version: config.version
        };
    }

}