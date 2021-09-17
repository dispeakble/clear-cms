import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import {Transport} from "@nestjs/microservices";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());

  await app.init();

  await app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      return_buffers: true,
      url: 'redis://' + process.env.redis_server,
      port: +process.env.redis_port,
      password: process.env.redis_password
    }
  });

  await app.startAllMicroservices();

  await app.listen(Number(process.env.backend_port), '0.0.0.0');
  console.log(`listening on port ${process.env.backend_port}`)
}
bootstrap();
