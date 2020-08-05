import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fs from 'fs';
import {Transport} from "@nestjs/microservices";

Logger.overrideLogger(['error']);

const logger = new Logger('Main');

async function bootstrap() {
    try {

        const httpsOptions = {
            key: fs.readFileSync('./nest_certs/private-key.pem'),
            cert: fs.readFileSync('./nest_certs/public-certificate.pem'),
        };

        const netApp = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter({https: httpsOptions, logger: true})
        );

        const microservice = netApp.connectMicroservice({
            transport: Transport.REDIS,
            options: {
                url: 'redis://' + process.env.redis_server,
                port: +process.env.redis_port
            },
        });

        const default_http_port = +process.env.private_http_port || 30443;

        await netApp.startAllMicroservicesAsync();

        await netApp.listen(default_http_port, '0.0.0.0');

        console.log('https server started');

    } catch(e){
        logger.log('Warning! Could not start the proxy module');
    }


}
bootstrap();
