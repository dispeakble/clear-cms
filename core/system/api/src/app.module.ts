import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { SystemService } from './services/system.service';
import { BucketService } from './services/bucket.service';
import { CategoriesService } from './services/categories.service';
import { UsersService } from './services/users.service';
import { PagesService } from './services/pages.service';
import { AuthService } from './services/auth.service';
import { AdminProfileService } from './services/adminProfile.service';
import { AdminThemesService } from './services/adminThemes.service';
import { PublicThemesService } from './services/publicThemes.service';
import { GeneralSettingsService } from './services/generalSettings.service';
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
  providers: [BucketService, CategoriesService, UsersService, PagesService, ProtocolService, AuthService, SystemService, AdminProfileService, AdminThemesService, PublicThemesService, MainService, GeneralSettingsService]
})

export class AppModule {}
