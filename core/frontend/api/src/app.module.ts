import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { SystemService } from './services/system.service';
import { BucketService } from './services/bucket.service';
import { HelpService } from './services/help.service';
import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {GotModule} from "@t00nday/nestjs-got";

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
  providers: [ProtocolService, SystemService, BucketService, HelpService]
})

export class AppModule {}
