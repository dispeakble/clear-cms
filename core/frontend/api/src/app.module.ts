import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { FrontendService } from './services/frontend.service';
import { BucketService } from './services/bucket.service';
import { CategoriesService } from './services/categories.service';
import { PagesService } from './services/pages.service';
import { AuthService } from './services/auth.service';
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
          password: process.env.redis_password
        }
      },
    ])
  ],
  controllers: [ProtocolController],
  providers: [BucketService, CategoriesService, PagesService, ProtocolService, AuthService, FrontendService, PublicThemesService, MainService]
})

export class AppModule {}
