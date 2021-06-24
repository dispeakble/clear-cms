import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

Logger.overrideLogger(['error']);
// Create a logger instance
const logger = new Logger('Dev');

async function bootstrap() {
    try {
        let app = await NestFactory.create(
            AppModule
        );
        await app.init();
        //await app.listen(() => console.log('dev is ready.', ...arguments));
    } catch(e){
        logger.log('Warning! Could not start event listener');
    }


}
bootstrap();
