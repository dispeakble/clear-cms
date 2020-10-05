import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
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
    switch(data.protocol){
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
            app.connectMicroservice({
                transport: Transport.REDIS,
                options: {
                    url: 'redis://' + data.name,
                    port: +data.port
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
        createServer({port: 8181, protocol: 'http'});
        console.log('http done');
        //createServer({port: 30443, protocol: 'https'});
        //console.log('https done');
        createServer({name:process.env.redis_server, port: process.env.redis_port, protocol: 'redis'});
        console.log('redis done');

        await app.startAllMicroservicesAsync();

        //await app.listen(8282, '0.0.0.0');
        //await app.listen(30443, '0.0.0.0');

        /*setInterval(async () => {
            const port = Math.floor(Math.random()) * 10 + 8000;
            createServer({port: port, type: 'http'});
            console.log('created server on port: ' + port);
        }, 1000)*/

    } catch(e){
        logger.log('Warning! Could not start the proxy module');
    }


}
bootstrap();
