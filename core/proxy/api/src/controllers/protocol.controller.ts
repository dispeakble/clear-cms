import {Controller, Inject} from '@nestjs/common';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Controller()
export class ProtocolController {
    private config: ModuleInterface = {
        name: 'proxy',
        version: '20.10.25',
        description: 'proxy module',
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
        @Inject('AppService') private appService,
    ) {
        //this.protocolService.start()
    }

    //Microservice protocol
    @MessagePattern({message: 'proxy'})
    public async onMessage(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'proxy'})
    public async onEvent(@Payload() data: any, @Ctx() context: RedisContext) {
        console.log(data);
        const resp = await this.perform(data);
        return resp;
    }

    private registerModule(params) {
        return new Promise((resolve_register) => {
            setTimeout(async () => {
                try {
                    const moduleResponse = await this.protocolService.registerModule(this.config);

                    switch (moduleResponse.status) {
                        case 'failed':
                            console.log(moduleResponse);
                            switch (moduleResponse.resolution.action) {
                                case 'retry':
                                    await this.registerModule({
                                        after: moduleResponse.resolution.after
                                    });
                                    resolve_register(true);
                                    break;
                                case 'restart':
                                    console.log(JSON.stringify(moduleResponse));
                                    console.log('Proxy module cannot be registered');
                                    process.exit;

                                    break;
                                default:
                                    console.log(JSON.stringify(moduleResponse));
                                    throw new Error('Proxy module cannot be registered');

                                    break;
                            }
                            break;
                        case 'registered':
                            resolve_register(true);
                            console.log('Proxy module registered');
                            break;
                    }

                } catch (ex) {
                    resolve_register(true);
                    console.log(ex);
                }

            }, params.after * 1000);
        });

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
                message: 'Proxy could not find ' + data.api + ':' + data.act
            };
        }
    }

}
