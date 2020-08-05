import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    private methods = ["get"];

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
        return this.redisService.emit(data.channel, data.payload);
    }

    public registerModule(data: ModuleInterface) {
        let payload: payloadInterface = {
            api: 'module',
            act: 'register',
            channel: 'db',
            config: {
                restart: true,
                stop: false
            },
            payload: data
        };
        return this.redisService.send({message: 'hub'}, payload).toPromise();
    }

    private get(data: any){
        return new Promise((resolve) => {
            resolve('Hello World')
        })
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
            return this[data.act](data.payload);
        } else {
            console.log("Db.protocolService." + data.act + " not found");
        }
        return null;
    }

}