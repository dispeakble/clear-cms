import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, MessagePattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {VolumeService} from "../services/volume.service";

@Controller()
export class AppController {

    private config: ModuleInterface = {
        name: 'storage',
        version: '20.07.27',
        description: 'storage',
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

    constructor(private readonly protocolService: ProtocolService, private volumeService: VolumeService) {
        this.volumeService.start();
    }

    @MessagePattern({message: 'storage'})
    public async onMessage(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        const resp = await this.perform(data);
        return resp;
    }

    @EventPattern({event: 'storage'})
    public async onEvent(@Payload() data: payloadInterface, @Ctx() context: RedisContext) {
        const resp = await this.perform(data);
        return resp;
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        await this.registerModule({after: 0});
    }

    private registerModule(params) {
        return new Promise((resolve_register) => {
            setTimeout(async () => {
                try {
                    const moduleResponse = await this.protocolService.registerModule(this.config);

                    switch (moduleResponse.status) {
                        case 'failed':
                            switch (moduleResponse.resolution.action) {
                                case 'retry':
                                    await this.registerModule({
                                        after: moduleResponse.resolution.after
                                    });
                                    resolve_register(true);
                                    break;
                                default:
                                    console.log(JSON.stringify(moduleResponse));
                                    throw new Error('STORAGE module cannot be registered');
                                    break;
                            }
                            break;
                        case 'registered':
                            resolve_register(true);
                            console.log('Storage module registered');
                            break;
                    }

                } catch (ex) {
                    resolve_register(true);
                    console.log(ex);
                }

            }, params.after * 1000);
        });

    }

    private perform(data: payloadInterface){
        try {
            return this[data.api + 'Service'].perform(data);
        } catch (ex) {
            console.log("this[" + data.api + "Service]");
            console.log(ex);
            return {
                message:'Could not find ' + data.api + ':' + data.act
            };
        }
    }

}
