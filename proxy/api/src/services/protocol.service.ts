import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable, CACHE_MANAGER} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Cache} from "cache-manager";


@Injectable()
export class ProtocolService {

    //exposed methods
    private methods = ["sendMessage", "emitMessage", "sendPost", "sendGet", "ping", "setValue", "getValue"];

    @Inject('REDIS_SERVICE') private redisService: ClientProxy;
    @Inject(CACHE_MANAGER) private cacheManager: Cache;

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
            api: data.api,
            act: data.act,
            payload: data.payload.body.payload
        };
        return this.redisService.send({message: data.channel}, payload);
    }

    public sendGet(data: any) {
        const payload = {
            api: 'http',
            act: 'get',
            payload: data.payload
        };
        return this.redisService.send({message: data.channel}, payload);
    }

    public ping(data: any, config: ModuleInterface){
        return {
            name: config.name,
            version: config.version
        };
    }

    public setValue(key: string, value: any){
        return this.cacheManager.set(key, value, {ttl:0});
    }

    public getValue(key: string){
        return this.cacheManager.get(key);
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