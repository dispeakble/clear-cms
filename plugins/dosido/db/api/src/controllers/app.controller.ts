import {Controller, Inject} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'db',
        version: '20.11.17',
        description: 'db module',
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
      @Inject('DbService') private dbService
    ) {
        this.protocolService.start().then(() => {
            this.systemService.registerModule(this.config).subscribe(data => {
                console.log(data);
            }, err => {
                console.log(err);
            }, () => {

            });

        })
    }

    //Microservice protocol
    @MessagePattern({message: 'db'})
    public onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        return this.perform(data);
    }

    @EventPattern({event: 'db'})
    public onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        return this.perform(data);
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
                message: 'Db could not find ' + data.api + ':' + data.act
            };
        }
    }

}