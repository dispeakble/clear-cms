import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    private methods = ["ping"];

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }

    public start() {
        return this.redisService.connect();
    }

    public sendMessage(data: any){
        return this.redisService.send({ message: `${process.env.app}_${data.channel}` }, data.payload).toPromise();
    }

    public emitEvent(data: any){
        return this.redisService.emit({ event: `${process.env.app}_${data.channel}` }, data.payload);
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
            //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
            return this[data.act](data.payload, config);
        } else {
            console.log("Hub.protocolService." + data.act + " not found");
        }
        return null;
    }

}