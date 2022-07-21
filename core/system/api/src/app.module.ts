import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { SystemService } from './services/system.service';
import { BucketService } from './services/bucket.service';
import { CategoriesService } from './services/categories.service';
import { ClientsService } from './services/clients.service';
import { PagesService } from './services/pages.service';
import { AuthService } from './services/auth.service';
import { AdminProfileService } from './services/adminProfile.service';
import { AdminThemesService } from './services/adminThemes.service';
import { PublicThemesService } from './services/publicThemes.service';
import { GeneralSettingsService } from './services/generalSettings.service';
import { HelpService } from './services/help.service';
import { DashboardBoxService } from "./services/dashboardBox.service";
import { SitemapService } from "./services/sitemap.service";
import { ResourcesService } from "./services/resources.service";

import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.redis_server}:${process.env.redis_port}`,
          password: process.env.redis_password,
          retryAttempts: 20,
          retryDelay: 3000,
        }
      },
    ])
  ],
  controllers: [ProtocolController],
  providers: [
    ProtocolService,
    BucketService,
    CategoriesService,
    ClientsService,
    PagesService,
    AuthService,
    SystemService,
    AdminProfileService,
    AdminThemesService,
    PublicThemesService,
    GeneralSettingsService,
    HelpService,
    DashboardBoxService,
    SitemapService,
    ResourcesService,
  ]
})

export class AppModule {}
