import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

Logger.overrideLogger(['error']);

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.REDIS,
        options: {
            url: 'redis://' + process.env.redis_server,
            port: +process.env.redis_port,
            password: process.env.redis_password,
            retryAttempts: 10,
            retryDelay: 5000,
        },
    });
    await app.listen(() => console.log('hub is ready.'));

}
bootstrap();
