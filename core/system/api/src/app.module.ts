import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { SystemService } from './services/system.service';
import { BucketService } from './services/bucket.service';
import { CategoriesService } from './services/categories.service';
import { ClientsService } from './services/clients.service';
import { PagesService } from './services/pages.service';
import { AuthService } from './services/auth/auth.service';
import { AdminProfileService } from './services/adminProfile.service';
import { AdminThemesService } from './services/adminThemes.service';
import { PublicThemesService } from './services/publicThemes.service';
import { GeneralSettingsService } from './services/generalSettings.service';
import { HelpService } from './services/help.service';
import { DashboardBoxService } from "./services/dashboardBox.service";
import { SitemapService } from "./services/sitemap.service";
import { ResourcesService } from "./services/resources.service";
import { ResetEmailService } from "./services/resetEmail.service";

import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {GotModule} from "@t00nday/nestjs-got";
import {JwtStrategy} from "./services/auth/strategies/jwt.strategy";
import {LocalStrategy} from "./services/auth/strategies/local.strategy";
import {UsersService} from "./services/users.service";
import {JwtRtStrategy} from "./services/auth/strategies/jwtRt.strategy";
import {JwtUpdateStrategy} from "./services/auth/strategies/jwt.update.stategy";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";

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
          disable_resubscribing: false,
          max_attempts: 30,
          no_ready_check: true,
          retry_max_delay: 1000,
          retry_strategy: 1000
        }
      },
    ]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [ProtocolController],
  providers: [
    BucketService,
    CategoriesService,
    ClientsService,
    PagesService,
    ProtocolService,
    AuthService,
    ResetEmailService,
    SystemService,
    AdminProfileService,
    AdminThemesService,
    PublicThemesService,
    GeneralSettingsService,
    HelpService,
    DashboardBoxService,
    SitemapService,
    ResourcesService,
    LocalStrategy,
    UsersService,
    JwtStrategy,
    JwtRtStrategy,
    JwtUpdateStrategy
  ]
})

export class AppModule {}
