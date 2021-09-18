import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { BucketService } from './services/bucket.service';
import { CategoriesService } from './services/categories.service';
import { PagesService } from './services/pages.service';
import { PublicThemesService } from './services/publicThemes.service';
import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {GotModule} from "@t00nday/nestjs-got";
import { MainService } from './services/main.service';

@Module({
  imports: [
    GotModule.register(),
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
  controllers: [ProtocolController],
  providers: [
    BucketService,
    CategoriesService,
    PagesService,
    ProtocolService,
    PublicThemesService,
    MainService
  ]
})

export class AppModule {}
