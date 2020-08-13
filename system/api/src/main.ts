import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

Logger.overrideLogger(['error']);
// Create a logger instance
const logger = new Logger('Main');
const DEV = process.env.debug || false;

async function bootstrap() {
    try {
        const tmpRedis = {transport: Transport.REDIS,
            options: {
            url: 'redis://' + process.env.redis_server,
                port: +process.env.redis_port
        }};
        const app = await NestFactory.createMicroservice(AppModule, tmpRedis);
        await app.listen(() => logger.log('System:bootstrap complete'));
    } catch(e){
        logger.log('System:bootstrap! Could not connect to redis');
    }

}
bootstrap();
