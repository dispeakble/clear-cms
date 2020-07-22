import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    private methods = ["mapRequest"];

    private channels = {
        get: "hub",
        post: "hub"
    };

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {}

    public start() {
        return this.redisService.connect();
    }

    public registerModule(data: ModuleInterface) {
        let payload: payloadInterface = {
            api: 'module',
            act: 'register',
            channel: 'proxy',
            config: {
                restart: true,
                stop: false
            },
            payload: data
        };
        return this.redisService.send({message: 'hub'}, payload).toPromise();
    }

    public sendMessage(data: payloadInterface) {

        let payload: payloadInterface = {
            api: data.api,
            act: data.act,
            channel: data.channel,
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
            api: 'protocol',
            act: 'post',
            payload: data.payload
        };
        return this.redisService.send({message: this.channels.post}, payload).toPromise();
    }

    public sendGet(data: any) {
        const payload = {
            api: 'protocol',
            act: 'get',
            payload: data
        };
        return this.redisService.send({message: this.channels.get}, payload).toPromise();
    }

    public mapRequest(data: any) {
        this.channels[data.type] = data.channel;
        return new Promise((resolve_map_request) => {
            setTimeout(resolve_map_request, 0);
        });
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload);
        } else {
            console.log("Proxy.protocolService." + data.act + " not found");
        }
        return null;
    }

}