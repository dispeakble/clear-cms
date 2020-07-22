import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";


@Injectable()
export class ProtocolService {

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }



    public start() {
        return this.redisService.connect();
    }

    public registerModule(data: ModuleInterface) {
        let payload: payloadInterface = {
            api: 'module',
            act: 'register',
            channel: 'pages',
            config: {
                restart: true,
                stop: false
            },
            payload: data
        };
        return this.redisService.send({message: 'hub'}, payload).toPromise();
    }

}