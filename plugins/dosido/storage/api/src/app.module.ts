import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {SystemService} from "./services/system.service";
import {FileUtils} from "./utils/file.utils";


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url:  'redis://' + process.env.redis_server,
          port: +process.env.redis_port,
          password: process.env.redis_password
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [ProtocolService, SystemService]
})

export class AppModule {}
