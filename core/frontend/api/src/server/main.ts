// @ts-ignore
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import {Transport} from "@nestjs/microservices";


async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(compression());

    await app.init();

    await app.connectMicroservice({
      transport: Transport.REDIS,
      options: {
        detect_buffers: true,
        url: 'redis://' + process.env.redis_server,
        port: process?.env?.redis_port,
        password: process.env.redis_password,
        disable_resubscribing: false,
        max_attempts: 30,
        no_ready_check: true,
        retry_max_delay: 1000,
        retry_strategy: 1000
      }
    });

    await app.startAllMicroservices();

    await app.listen(Number(process.env.backend_port), '0.0.0.0');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }

}
bootstrap();
