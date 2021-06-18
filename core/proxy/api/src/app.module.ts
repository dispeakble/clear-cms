import {Module, Scope, CacheModule} from '@nestjs/common';
import {AppController} from "./controllers/app.controller";
import {AppService} from './services/app.service';
import {ProtocolService} from "./services/protocol.service";
import { WsGateway } from './gateways/ws.gateway';
import {SystemService} from "./services/system.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import { Session } from './modules/session.module';
import * as redisStore from 'cache-manager-redis-store';
import {SessionService} from "./services/session.service";
import {ConfigService} from "./services/config.service";
import {HttpService} from "./services/http.service";
import { GotModule, GotModuleOptions } from '@t00nday/nestjs-got';
import { EventEmitterModule } from '@nestjs/event-emitter';


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
        ]),
        EventEmitterModule.forRoot({
            // set this to `true` to use wildcards
            wildcard: false,
            // the delimiter used to segment namespaces
            delimiter: '.',
            // set this to `true` if you want to emit the newListener event
            newListener: false,
            // set this to `true` if you want to emit the removeListener event
            removeListener: false,
            // the maximum amount of listeners that can be assigned to an event
            maxListeners: 10,
            // show event name in memory leak message when more than maximum amount of listeners is assigned
            verboseMemoryLeak: false,
            // disable throwing uncaughtException if an error event is emitted and it has no listeners
            ignoreErrors: false,
        })
    ],
    controllers: [AppController],
    providers: [AppService, ProtocolService, WsGateway, SystemService, SessionService, ConfigService, HttpService]
})

export class AppModule {
    constructor() { }
}
