import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    //exposed methods
    private methods = ["sendMessage", "emitMessage", "sendPost", "sendGet", "ping", "setValue", "getValue"];

    @Inject('REDIS_SERVICE') private redisService: ClientProxy;

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

        return this.redisService.send({message: data.channel}, payload).toPromise();

    }

    public emitMessage(data: any) {

        let payload: payloadInterface = {
            api: data.module,
            act: data.act,
            channel: data.channel,
            payload: data.payload || ""
        };

        return this.redisService.emit({message: data.channel}, payload).toPromise();

    }

    public sendPost(data: any) {
        const payload = {
            api: 'http',
            act: 'post',
            payload: data.payload
        };
        return this.redisService.send({message: data.channel}, payload).toPromise();
    }

    public sendGet(data: any) {
        const payload = {
            api: 'http',
            act: 'get',
            payload: data.payload
        };
        return this.redisService.send({message: data.channel}, payload).toPromise();
    }

    public ping(data: any, config: ModuleInterface){
        return {
            name: config.name,
            version: config.version
        };
    }

    public setValue(key: string, value: any){
        console.log(key);
        console.log(value);
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Proxy.protocolService." + data.act + " not found");
        }
        return null;
    }

}