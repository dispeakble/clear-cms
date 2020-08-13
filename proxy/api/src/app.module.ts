import {Module, Scope} from '@nestjs/common';
import {AppService} from './services/app.service';
import {AppController} from "./controllers/app.controller";
import {ProtocolController} from "./controllers/protocol.controller";
import {ProtocolService} from "./services/protocol.service";
import {WebsocketGatewayService} from "./services/websocket.gateway.service";
import {ClientsModule, Transport} from "@nestjs/microservices";


@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'REDIS_SERVICE',
                transport: Transport.REDIS,
                options: {
                    url: 'redis://' + process.env.redis_server,
                    port: +process.env.redis_port
                }
            },
        ])
    ],
    controllers: [AppController, ProtocolController],
    providers: [AppService, ProtocolService, WebsocketGatewayService]
})

export class AppModule {

    constructor() {

    }

}
