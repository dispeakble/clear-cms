import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";


@Injectable()
export class ProtocolService {

    private methods = ["start", "sendMessage", "emitEvent", "registerModule", "ping"];

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }

    public start() {
        return this.redisService.connect();
    }

    public sendMessage(data: any){
        return this.redisService.send({message: data.channel}, data.payload).toPromise();
    }

    public emitEvent(data: any){
        return this.redisService.emit({event: data.channel}, data.payload);
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

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.httpService." + data.act + " not found");
        }
        return null;
    }

}