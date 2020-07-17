import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import {
  ClientsModule, Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APP_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://redis',
          port: 6379
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
