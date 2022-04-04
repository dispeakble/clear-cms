import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import InitDb from './init.db';
const initDb = new InitDb();

async function bootstrap() {
    try {
        const createdDatabases = await initDb.start();
        const app = await NestFactory.create(
          AppModule.register({
              createdDatabases: createdDatabases,
          }),
        );
        await app.init();
        await app.connectMicroservice({
            transport: Transport.REDIS,
            options: {
                url:  'redis://' + process.env.redis_server,
                port: +process.env.redis_port,
                password: process.env.redis_password,
                retryAttempts: 20,
                retryDelay: 5000,
                detect_buffers: true,
                disable_resubscribing: false,
                max_attempts: 30,
                no_ready_check: true,
                retry_max_delay: 1000,
                retry_strategy: 1000
            }
        });
        app.startAllMicroservices();
    } catch(err){
        console.error(err);
        process.exit(1);
    }

}
bootstrap();
