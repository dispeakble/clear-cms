import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";


@Injectable()
export class ProtocolService {

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

    public get(data: any){
        return new Promise((resolve_get) => {
            const query = data.query;
            const params = data.params;
            let file_name = 'index.html';

            if(data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1){
                file_name = params[0];
            }

            try {
                const file = fs.readFileSync(__dirname + '/../../public/' + file_name);
                resolve_get(file);
            } catch (err) {
                const file = fs.readFileSync(__dirname + '/../../public/index.html');
                resolve_get(file);
            }



        });

    }

    public ping(data: any, config: ModuleInterface){
        return {
            name: config.name,
            version: config.version
        };
    }

}