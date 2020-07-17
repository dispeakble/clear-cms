import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

// Create a logger instance
const logger = new Logger('Main');

async function bootstrap() {
    try {
        const app = await NestFactory.createMicroservice(AppModule, {
            transport: Transport.REDIS,
            options: {
                url: 'redis://' + process.env.redis_server,
                port: 6379
            },
        });
        await app.listen(() => console.log('dev is ready.', ...arguments));
    } catch(e){
        logger.log('Warning! Could not start event listener');
    }


}
bootstrap();
