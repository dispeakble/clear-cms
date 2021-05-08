import {Controller, Inject} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'bucket',
        version: '21.05.08',
        description: 'bucket module',
        started: new Date(),
        config: {
            restart: true,
            stop: false
        },
        dependencies: [
            {
                name: 'hub',
                version: 'latest'
            }
        ],
    };

    constructor(
      @Inject('ProtocolService') private protocolService,
      @Inject('SystemService') private systemService,
      @Inject('BucketService') private bucketService
    ) {
        this.protocolService.start().then(async () => {
            const response = await this.systemService.registerModule(this.config);
            console.log(response);
        })
    }

    //Microservice protocol
    @MessagePattern({message: 'bucket'})
    public async onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'bucket'})
    public async onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    private perform(data: payloadInterface) {
        try {
            console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({
                act: data.act,
                payload: data.payload
            }) + ')');
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload}, this.config);
        } catch (ex) {
            console.log(ex);
            return {
                message: 'Bucket could not find ' + data.api + ':' + data.act
            };
        }
    }

}