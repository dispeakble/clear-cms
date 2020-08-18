import {Module, Scope} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ProtocolController } from './controllers/protocol.controller';
import { AppService } from './services/app.service';
import {
  ClientsModule, Transport,
} from '@nestjs/microservices';
import {ProtocolService} from "./services/protocol.service";
import {ModuleService} from "./services/module.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://' + process.env.redis_server,
          port: +process.env.redis_port
        }
      },
    ])
  ],
  controllers: [AppController, ProtocolController],
  providers: [AppService, ProtocolService, ModuleService]
})

export class AppModule {}
