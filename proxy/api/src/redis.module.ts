import {Module, Scope} from '@nestjs/common';
import {ProtocolController} from "./controllers/protocol.controller";
import {ProtocolService} from "./services/protocol.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import { ConfigModule } from './modules/config.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'REDIS_SERVICE',
                transport: Transport.REDIS,
                options: {
                    url: 'redis://' + process.env.redis_server,
                    port: +process.env.redis_port,
                    password: process.env.redis_password
                }
            },
        ])
    ],
    controllers: [ProtocolController],
    providers: [ProtocolService]
})

export class RedisModule {
    constructor() { }
}
