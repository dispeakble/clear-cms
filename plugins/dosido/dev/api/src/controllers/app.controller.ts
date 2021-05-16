import {Controller, Inject} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'dev',
        version: '21.05.08',
        description: 'dev module',
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
      @Inject('DevService') private devService
    ) {
        this.protocolService.start().then(() => {
            this.systemService.registerModule(this.config).subscribe((response) => {
                console.log(response);
            }, (err) => {
                console.error(err);
            }, () => {
                console.log('complete');
            });
        })
    }

    //Microservice protocol
    @MessagePattern({message: 'dev'})
    public onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    @EventPattern({event: 'dev'})
    public onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        return this.perform(data);
    }

    private perform(data: payloadInterface) {
        try {
            // console.log('calling ' + data.api + 'Service.perform(' + JSON.stringify({
            //     act: data.act,
            //     payload: data.payload
            // }) + ')');
            return this[data.api + 'Service'].perform({act: data.act, payload: data.payload}, this.config);
        } catch (ex) {
            //console.log(ex);
            return {
                message: 'Dev could not find ' + data.api + ':' + data.act
            };
        }
    }

}