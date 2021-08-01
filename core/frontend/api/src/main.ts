import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

Logger.overrideLogger(['error']);
// Create a logger instance
const logger = new Logger('Main');

async function bootstrap() {
    try {
        const app = await NestFactory.createMicroservice(AppModule, {
            transport: Transport.REDIS,
            options: {
                url: 'redis://' + process.env.redis_server,
                port: +process.env.redis_port,
                password: process.env.redis_password
            },
        });
        await app.listen(() => console.log('Frontend is ready.'));
    } catch(e){
        logger.log('Frontend:bootstrap! Could not connect to redis');
    }

}
bootstrap();
