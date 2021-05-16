import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { BucketService } from './services/bucket.service';
import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {SystemService} from "./services/system.service";
import {HelpService} from "./services/help.service";


@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          detect_buffers: true,
          url:  'redis://' + process.env.redis_server,
          port: +process.env.redis_port,
          password: process.env.redis_password
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [BucketService, ProtocolService, SystemService, HelpService]
})

export class AppModule {}
