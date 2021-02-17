import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from "@nestjs/microservices";
import * as compression from 'compression';
//import {SessionAdapter} from "./adapters/session.adapter";

let httpsOptions;
let app;

const init = async () => {

    if(process.env.ssl_key && process.env.ssl_cert){
        httpsOptions = {
            key: process.env.ssl_key,
            cert: process.env.ssl_cert
        };

        app = await NestFactory.create(
            AppModule,{
                httpsOptions: httpsOptions
            }
        );
    } else {
        app = await NestFactory.create(
            AppModule
        );
    }

    app.use(compression.default());

    //left here for example: app.useWebSocketAdapter(new SessionAdapter(app));

    await app.init();

    await app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            return_buffers: true,
            url: 'redis://' + process.env.redis_server,
            port: +process.env.redis_port,
            password: process.env.redis_password
        }
    });

    await app.startAllMicroservicesAsync();
    console.log('init done');

    app.listen(process.env.backend_port, '0.0.0.0');

    console.log('Proxy module started');

}

async function bootstrap() {
    try {
        init();
    } catch (e) {
        console.log('Warning! Could not start the proxy module');
    }
}

bootstrap();
