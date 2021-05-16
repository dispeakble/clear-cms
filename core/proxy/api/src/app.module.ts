import {Module, Scope, CacheModule} from '@nestjs/common';
import {AppController} from "./controllers/app.controller";
import {ProtocolController} from "./controllers/protocol.controller";
import {AppService} from './services/app.service';
import {ProtocolService} from "./services/protocol.service";
import { WsGateway } from './gateways/ws.gateway';
import {SystemService} from "./services/system.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import { Session } from './modules/session.module';
import * as redisStore from 'cache-manager-redis-store';
import {SessionService} from "./services/session.service";
import {ConfigService} from "./services/config.service";
import {BucketService} from "./services/bucket.service";
import {
    GotModule,
    GotModuleOptions
} from '@t00nday/nestjs-got';

@Module({
    imports: [
        GotModule.registerAsync({
            useFactory: (): GotModuleOptions => ({}),
        }),
        CacheModule.register({
            store: redisStore,
            url: 'redis://' + process.env.redis_server,
            port: +process.env.redis_port,
            password: process.env.redis_password
        }),
        Session,
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
    providers: [AppService, ProtocolService, WsGateway, SystemService, SessionService, ConfigService, BucketService]
})

export class AppModule {
    constructor() { }
}
