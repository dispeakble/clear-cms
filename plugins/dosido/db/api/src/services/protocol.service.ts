import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    //exposed methods
    private methods = ["sendMessage", "emitMessage", "ping", "setValue", "getValue"];

    @Inject('REDIS_SERVICE') private redisService: ClientProxy;

    public start() {
        return this.redisService.connect();
    }

    public sendMessage(data: payloadInterface) {

        const payload: payloadInterface = {
            channel: data.channel,
            api: data.api,
            act: data.act,
            payload: data.payload || ""
        };

        return this.redisService.send({message: data.channel}, payload);

    }

    public emitMessage(data: any) {

        const payload: payloadInterface = {
            api: data.module,
            act: data.act,
            channel: data.channel,
            payload: data.payload || ""
        };

        return this.redisService.emit({message: data.channel}, payload);

    }

    public ping(data: any, config: ModuleInterface){
        return {
            data: 'pong',
            name: config.name,
            version: config.version
        };
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Db.protocolService." + data.act + " not found");
        }
        return null;
    }

}