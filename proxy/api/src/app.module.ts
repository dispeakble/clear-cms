import {Module, Scope} from '@nestjs/common';
import {AppService} from './services/app.service';
import {AppController} from "./controllers/app.controller";
import {ProtocolController} from "./controllers/protocol.controller";
import {ProtocolService} from "./services/protocol.service";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'REDIS_SERVICE',
                transport: Transport.REDIS,
                options: {
                    url: 'redis://' + process.env.redis_server,
                    port: 6379
                }
            },
        ])
    ],
    controllers: [AppController, ProtocolController],
    providers: [AppService, ProtocolService]
})

export class AppModule {

    constructor() {

    }

}
