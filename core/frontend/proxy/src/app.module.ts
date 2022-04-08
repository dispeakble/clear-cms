import { CacheModule, Logger, Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import { ProtocolService } from "./services/protocol.service";
import { WsGateway } from "./gateways/ws.gateway";
import { SystemService } from "./services/system.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Session } from "./modules/session.module";
import * as redisStore from "cache-manager-redis-store";
import { SessionService } from "./services/session.service";
import { ConfigService } from "./services/config.service";
import { GotModule, GotModuleOptions } from "@t00nday/nestjs-got";


@Module({
    imports: [
        GotModule.registerAsync({
            useFactory: (): GotModuleOptions => ({})
        }),
        CacheModule.register({
            store: redisStore,
            url: "redis://" + process.env.redis_server,
            port: +process.env.redis_port,
            password: process.env.redis_password,
            retryAttempts: 20,
            retryDelay: 3000,
            disable_resubscribing: false,
            max_attempts: 30,
            no_ready_check: true,
            retry_max_delay: 1000,
            retry_strategy: 1000
        }),
        Session,
        ClientsModule.register([
            {
                name: "REDIS_SERVICE",
                transport: Transport.REDIS,
                options: {
                    url: "redis://" + process.env.redis_server,
                    port: +process.env.redis_port,
                    password: process.env.redis_password,
                    retryAttempts: 20,
                    retryDelay: 3000,
                    disable_resubscribing: false,
                    max_attempts: 30,
                    no_ready_check: true,
                    retry_max_delay: 1000,
                    retry_strategy: 1000
                }
            }
        ])
    ],
    controllers: [AppController],
    providers: [AppService, ProtocolService, WsGateway, SystemService, SessionService, ConfigService, Logger]
})

export class AppModule {
}
