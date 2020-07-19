import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'system',
        version: 1.1,
        description: 'System Module',
        started: new Date(),
        dependencies: [],
    };

    constructor(private readonly protocolService: ProtocolService) {

    }

    @MessagePattern({message: 'system'})
    public onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext){
        console.log('system message', data);

        const resp = this.perform(data);
        console.log('system after perform', resp);

        return resp;
    }

    @EventPattern({event: 'system'})
    public onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {

        console.log('system event', data);

        return this.perform(data);
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        console.log('system connected to redis');
        this.registerModule({after: 2})
    }

    private registerModule(params){
        setTimeout(async () => {
            console.log('will send register request');

            try {
                const moduleResponse = await this.protocolService.registerModule(this.config);

                console.log(moduleResponse);

                switch(moduleResponse.payload.status){
                    case 'failed':
                        switch(moduleResponse.payload.resolution.action){
                            case 'retry':
                                this.registerModule({
                                    after: moduleResponse.payload.resolution.after
                                });
                                break;
                            default:
                                console.log(moduleResponse);
                                break;
                        }
                        break;
                    case 'registered':
                        console.log('System registered');
                        break;
                }

            } catch (ex){
                console.log(ex);
            }


        }, params.after * 1000);
    }

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'][data.act](data.payload, this.config);
        } catch (ex) {//TODO return proper error to caller
            console.log(ex);
            return {
                message:'Could not find ' + data.api + ':' + data.act
            };
        }
    }

}
