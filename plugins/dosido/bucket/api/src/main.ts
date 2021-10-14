import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from "@nestjs/microservices";
import {Logger} from "@nestjs/common";

Logger.overrideLogger(['error']);
// Create a logger instance
const logger = new Logger('Db');

async function bootstrap() {
    try {
        const app = await NestFactory.createMicroservice(AppModule, {
            transport: Transport.REDIS,
            options: {
                url:  'redis://' + process.env.redis_server,
                port: +process.env.redis_port,
                password: process.env.redis_password,
                retryAttempts: 20,
                retryDelay: 3000,
                return_buffers: true,
                detect_buffers: true,
                disable_resubscribing: false,
                max_attempts: 30,
                no_ready_check: true,
                retry_max_delay: 1000,
                retry_strategy: 1000
            }
        });
        await app.listen(() => console.log('Bucket started.', ...arguments));
    } catch(e){
        logger.log('Warning! Could not start event listener');
    }
}
bootstrap();
