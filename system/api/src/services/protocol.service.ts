import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }

    public start() {
        return this.redisService.connect();
    }

    public registerModule(data: ModuleInterface) {
        let payload: payloadInterface = {
            api: 'module',
            act: 'register',
            channel: 'system',
            payload: data
        };
        return this.redisService.send({message: 'hub'}, payload).toPromise();
    }

    public ping(data: any, config: ModuleInterface){
        return {
            name: config.name,
            version: config.version
        };
    }

}