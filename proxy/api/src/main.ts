import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as http from "http";
import * as https from "https";
import * as fs from 'fs';

Logger.overrideLogger(['error']);
// Create a logger instance
const logger = new Logger('Main');

async function bootstrap() {
    try {
        const microApp = await NestFactory.createMicroservice(AppModule, {
            transport: Transport.REDIS,
            options: {
                url: 'redis://' + process.env.redis_server,
                port: 6379
            },
        });

        await microApp.listen(() => console.log('proxy module is ready.', ...arguments));

        const httpsOptions = {
            key: fs.readFileSync('./nest_certs/private-key.pem'),
            cert: fs.readFileSync('./nest_certs/public-certificate.pem'),
        };

        const netApp = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter({https: httpsOptions, logger: true})
        );

        await netApp.listen(30443, '0.0.0.0');

        console.log('https server started');

    } catch(e){
        logger.log('Warning! Could not start the proxy module');
    }


}
bootstrap();
