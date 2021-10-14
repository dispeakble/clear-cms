import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { FsService } from './services/fs.service';
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
          return_buffers: true,
          url:  'redis://' + process.env.redis_server,
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
  controllers: [AppController],
  providers: [FsService, ProtocolService, SystemService, HelpService]
})

export class AppModule {}
