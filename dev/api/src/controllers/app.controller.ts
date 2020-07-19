import {Controller} from '@nestjs/common';
import {ProtocolService} from '../services/protocol.service';
import {Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {ModuleInterface} from "../interfaces/module.interface";

@Controller()
export class AppController {
    public config: any = {
        "channel":"dev",
        "name": "dev",
        "version": 0.1,
        "description": "Dev test",
        "dependencies": ["system"]
    };

    constructor(private readonly protocolService: ProtocolService) {

    }

    @EventPattern({channel: 'dev'})
    public onMessage(@Payload() message: string, @Ctx() context: RedisContext) {

        const data = JSON.parse(message);

        console.log(message);

        switch (data.api) {
            case 'confirm':
                console.log('registration confirmed. can continue');
                break;
            case 'reject':
                console.log('registration failed. will not continue');
                break;
            case 'retry':
                console.log('registration failed. will retry in ', data.payload.retry);
                break;
            default:
                return null;
                break;
        }
    }

    async onApplicationBootstrap() {
        await this.protocolService.start();
        console.log('dev connected to redis');
        setTimeout(async () => {
            console.log('will send handshake');

            const payload: ModuleInterface = {
                name: 'dev',
                version: 1.0,
                description: 'dev test',
                registered: new Date(),
                dependencies: ['system'],
            };

            try {
                const moduleResponse = await this.protocolService.registerModule(this.config).toPromise();
                console.log(moduleResponse);
            } catch (ex){

            }


        }, 2000);
    }

}
