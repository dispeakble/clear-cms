import {NestFactory} from '@nestjs/core';
import {Logger} from '@nestjs/common';
import {AppModule} from './app.module';
import * as fs from 'fs';
import express from 'express';
import {Transport} from "@nestjs/microservices";
import * as http from "http";
import * as https from "https";
import {ExpressAdapter} from "@nestjs/platform-express";

Logger.overrideLogger(['error']);

const logger = new Logger('Main');

let server;
let app;

const init = async () => {
    server = express();

    app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
    );

    await app.init();
    return true;
}

const createServer = async (data) => {
    switch (data.protocol) {
        case 'http':
            http.createServer(server).listen(data.port);
            break;
        case 'https':
            const httpsOptions = {//TODO insert these from a volume or something
                key: fs.readFileSync('./nest_certs/private-key.pem'),
                cert: fs.readFileSync('./nest_certs/public-certificate.pem'),
            };
            https.createServer(httpsOptions, server).listen(data.port);
            break;
        case 'redis':
            await app.connectMicroservice({
                transport: Transport.REDIS,
                options: {
                    url: data.protocol + '://' + data.name,
                    port: +data.port,
                    password: data.password
                },
            });

            break;
    }

    logger.log('https server started');

    return true;
}

async function bootstrap() {
    try {
        await init();
        console.log('init done');

        createServer({
            name: process.env.redis_server,
            port: process.env.redis_port,
            password: process.env.redis_password,
            protocol: 'redis'
        });

        createServer({port: process.env.public_port, protocol: 'http'});
        console.log('public server listening');

        createServer({port: process.env.backend_port, protocol: 'http'});
        console.log('backend server listening');

        console.log('redis connected');

        await app.startAllMicroservicesAsync();

    } catch (e) {
        logger.log('Warning! Could not start the proxy module');
    }
}

bootstrap();
