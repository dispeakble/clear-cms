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
import { HelpService } from './services/help.service';
import { DashboardBoxService } from "./services/dashboardBox.service";
import { SitemapService } from "./services/sitemap.service";
import { ProductsService } from "./services/products.service";
import { ProductLabelsService } from "./services/productLabels.service";
import { ProductLocalityService } from "./services/productLocality.service";
import { ProductPricesService } from "./services/productPrices.service";
import { EcommerceTemplatesService } from "./services/ecommerceTemplates.service";
import { ResourcesService } from "./services/resources.service";

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
          disable_resubscribing: false,
          max_attempts: 30,
          no_ready_check: true,
          retry_max_delay: 1000,
          retry_strategy: 1000
        }
      },
    ])
  ],
  controllers: [ProtocolController],
  providers: [
    BucketService,
    CategoriesService,
    UsersService,
    PagesService,
    ProtocolService,
    AuthService,
    SystemService,
    AdminProfileService,
    AdminThemesService,
    PublicThemesService,
    MainService,
    GeneralSettingsService,
    HelpService,
    DashboardBoxService,
    SitemapService,
    ProductsService,
    ProductLabelsService,
    ProductLocalityService,
    ProductPricesService,
    EcommerceTemplatesService,
    ResourcesService,
  ]
})

export class AppModule {}
