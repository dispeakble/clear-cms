import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
    try {
        const app = await NestFactory.create(
            AppModule
        );

        await app.init();

        await app.connectMicroservice({
            transport: Transport.REDIS,
            options: {
                url: 'redis://' + process.env.redis_server,
                port: +process.env.redis_port,
                password: process.env.redis_password,
                retryAttempts: 20,
                retryDelay: 5000,
                disable_resubscribing: false,
                max_attempts: 30,
                no_ready_check: true,
                detect_buffers: true,
                retry_max_delay: 1000,
                retry_strategy: 1000
            }
        });

        await app.startAllMicroservices();
    } catch(err){
        console.error(err);
        process.exit(1);
    }

}
bootstrap();
