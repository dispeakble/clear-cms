import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import {Observable} from "rxjs";


@Injectable()
export class ProtocolService {

    private methods = ["start", "sendMessage", "emitMessage", "registerModule", "ping", "startHandshake", "requestHandshake", "requestHandshake", "confirmHandshake"];

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy,
    ) {
    }

    public start() {
        return this.redisService.connect();
    }

    public sendMessage(data: payloadInterface) {

        let payload: payloadInterface = {
            channel: data.channel,
            api: data.api,
            act: data.act,
            payload: data.payload || ""
        };

        return this.redisService.send({message: data.channel}, payload);
    }

    public emitMessage(data: any) {

        let payload: payloadInterface = {
            api: data.module,
            act: data.act,
            channel: data.channel,
            payload: data.payload || ""
        };

        return this.redisService.emit({message: data.channel}, payload);

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



    public perform(params: any, config?: ModuleInterface) {
        if(params.api){
            try {
                return this[params.api + 'Service'].perform(params);
            } catch (ex) {
                return 'Could not find ' + params.api + ':' + params.act;
            }
        } else {
            if (this.methods.includes(params.act)) {
                return this[params.act](params.payload, config);
            } else {
                console.log("System.httpService." + params.act + " not found");
            }
        }

        return null;
    }

}