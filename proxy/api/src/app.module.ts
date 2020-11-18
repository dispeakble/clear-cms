import {Module, Scope} from '@nestjs/common';
import {AppController} from "./controllers/app.controller";
import {ProtocolController} from "./controllers/protocol.controller";
import {AppService} from './services/app.service';
import {ProtocolService} from "./services/protocol.service";
import { WsGateway } from './gateways/ws.gateway';
import {SystemService} from "./services/system.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import { ConfigModule } from './modules/config.module';

@Module({
    imports: [
        ConfigModule.register({ folder: 'config' }),
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
    controllers: [AppController, ProtocolController],
    providers: [AppService, ProtocolService, WsGateway, SystemService]
})

export class AppModule {
    constructor() { }
}
