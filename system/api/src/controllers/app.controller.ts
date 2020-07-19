import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'system',
        version: 1.0,
        description: 'system test',
        started: new Date(),
        dependencies: [],
    };

    constructor(private readonly protocolService: ProtocolService) {

    }

    @EventPattern({channel: 'system'})
    public onMessage(@Payload() message: string, @Ctx() context: RedisContext) {

        const data = JSON.parse(message);

        console.log(message);

        switch (data.api) {
            default:
                return null;
                break;
        }
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
                const moduleResponse = await this.protocolService.registerModule(this.config).toPromise();

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

}
