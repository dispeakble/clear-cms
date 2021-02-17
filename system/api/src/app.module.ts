import { Module } from '@nestjs/common';
import { ProtocolController } from './controllers/protocol.controller';
import { SystemService } from './services/system.service';
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';
import { AdminProfileService } from './services/adminProfile.service';
import { AdminThemesService } from './services/adminThemes.service';
import { PublicThemesService } from './services/publicThemes.service';
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
          url: 'redis://' + process.env.redis_server,
          port: +process.env.redis_port,
          password: process.env.redis_password
        }
      },
    ])
  ],
  controllers: [ProtocolController],
  providers: [HttpService, ProtocolService, AuthService, SystemService, AdminProfileService, AdminThemesService, PublicThemesService]
})

export class AppModule {}
