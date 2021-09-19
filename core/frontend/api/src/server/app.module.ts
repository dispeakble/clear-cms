import {Module, CacheModule, Logger} from '@nestjs/common';
import {AppController} from "./controllers/app.controller";
import {ProtocolService} from "./services/protocol.service";
import {SystemService} from "./services/system.service";
import {PublicThemesService} from "./services/publicThemes.service";
import {CategoriesService} from "./services/categories.service";
import {PagesService} from "./services/pages.service";
import {BucketService} from "./services/bucket.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import * as redisStore from 'cache-manager-redis-store';
import { GotModule, GotModuleOptions } from '@t00nday/nestjs-got';
import {ViewService} from "./services/view.service";
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    GotModule.registerAsync({
      useFactory: (): GotModuleOptions => ({}),
    }),
    CacheModule.register({
      store: redisStore,
      url: 'redis://' + process.env.redis_server,
      port: +process.env.redis_port,
      password: process.env.redis_password,
      retryAttempts: 20,
      retryDelay: 3000,
    }),
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://' + process.env.redis_server,
          port: +process.env.redis_port,
          password: process.env.redis_password,
          retryAttempts: 20,
          retryDelay: 3000,
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [ProtocolService,
    SystemService,
    Logger,
    PublicThemesService,
    CategoriesService,
    PagesService,
    BucketService,
    ViewService,
    ConfigService
  ]
})

export class AppModule {
  constructor() { }
}
