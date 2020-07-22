import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {AppService} from "./app.service";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    private methods = [];

    constructor(
        @Inject('REDIS_SERVICE') private redisClient: ClientProxy
    ) {
    }

    public start() {
        return this.redisClient.connect();
    }

    public sendMessage(data: any){
        return this.redisClient.send(data.channel, data.payload).toPromise();
    }

    public emitEvent(data: any){
        return this.redisClient.emit(data.channel, data.payload);
    }

    public ping(data: any, config: ModuleInterface){
        return {
            name: config.name,
            version: config.version
        };
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
            return this[data.act](data.payload);
        } else {
            console.log("Hub.protocolService." + data.act + " not found");
        }
        return null;
    }

}