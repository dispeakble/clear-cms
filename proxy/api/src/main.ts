import {NestFactory} from '@nestjs/core';
import {Logger} from '@nestjs/common';
import {AppModule} from './app.module';
import * as fs from 'fs';
import express from 'express';
import {Transport} from "@nestjs/microservices";
import * as http from "http";
import * as https from "https";
import {ExpressAdapter} from "@nestjs/platform-express";
import {join} from "path";

Logger.overrideLogger(['error']);

const logger = new Logger('Main');

let server;
let app;

const init = async () => {
    server = express();

    app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server)
    );

    await app.init();

    return app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            url: 'redis://' + process.env.redis_server,
            port: +process.env.redis_port,
            password: process.env.redis_password
        }
    });

}

const createServer = async (data) => {
    switch (data.protocol) {
        case 'http':
            http.createServer(server).listen(data.port, '0.0.0.0');
            break;
        case 'https'://not needed behind load balancer
            if (process.env.ssl_key && process.env.ssl_cert) {
                const httpsOptions = {
                    key: process.env.ssl_key,
                    cert: process.env.ssl_cert
                };
                https.createServer(httpsOptions, server).listen(data.port, '0.0.0.0');
            }

            break;
        case 'redis':
            await app.connectMicroservice({
                transport: Transport.REDIS,
                options: {
                    url: data.protocol + '://' + data.name,
                    port: +data.port,
                    password: data.password
                }
            });

            break;
    }

    logger.log('https server started');

    return true;
}

async function bootstrap() {
    try {
        await init();
        await app.startAllMicroservicesAsync();
        console.log('init done');

        createServer({protocol: 'redis', name: process.env.redis_server, port: process.env.backend_port})
        console.log('redis done');

        if (process.env.ssl_key && process.env.ssl_cert) {
            createServer({protocol: 'https', port: process.env.backend_port})
        } else {
            createServer({protocol: 'http', port: process.env.backend_port})
        }
        console.log('http done');




        console.log('Proxy module started');

    } catch (e) {
        console.log('Warning! Could not start the proxy module');
    }
}

bootstrap();
