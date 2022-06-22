import { CacheModule, Logger, Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller"
import { AuthService } from "./services/auth.service"
import { ProtocolService } from "./services/protocol.service";
import { SystemService } from "./services/system.service";
import { SettingsService } from "./services/settings.service";
import { PublicThemesService } from "./services/publicThemes.service";
import { CategoriesService } from "./services/categories.service";
import { PagesService } from "./services/pages.service";
import { BucketService } from "./services/bucket.service";
import { HomeSearchPackagesService } from "./services/homeSearch/packages.service";
import { HomeSearchHotelsService } from "./services/homeSearch/hotels.service";
import { HomeSearchFlightsService } from "./services/homeSearch/flights.service";
import { EmailService } from "./services/email.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import * as redisStore from "cache-manager-redis-store";
import { ViewService } from "./services/view.service";
import { ConfigService } from "@nestjs/config";
import { AppService } from "./services/app.service";
import { WsGateway } from "./gateways/ws.gateway";


@Module({
  imports: [
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
  providers: [ProtocolService,
    SystemService,
    SettingsService,
    Logger,
    AuthService,
    PublicThemesService,
    CategoriesService,
    PagesService,
    BucketService,
    AppService,
    ViewService,
    ConfigService,
    HomeSearchPackagesService,
    HomeSearchHotelsService,
    HomeSearchFlightsService,
    EmailService,
    WsGateway
  ]
})

export class AppModule {
  constructor() {
    // do nothing
  }
}
