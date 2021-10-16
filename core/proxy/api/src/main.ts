import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from "@nestjs/microservices";
import * as compression from 'compression';

let httpsOptions;
let app;

const init = async () => {
    try {
        app = await NestFactory.create(
            AppModule
        );
        app.use(compression.default());

        //left here for example: app.useWebSocketAdapter(new SessionAdapter(app));

        await app.init();

        await app.connectMicroservice({
            transport: Transport.REDIS,
            options: {
                detect_buffers: true,
                url: 'redis://' + process.env.redis_server,
                port: +process.env.redis_port,
                password: process.env.redis_password,
                disable_resubscribing: false,
                max_attempts: 30,
                no_ready_check: true,
                retry_max_delay: 1000,
                retry_strategy: 1000
            }
        });

        await app.startAllMicroservicesAsync();

        app.listen(+process.env.backend_port, '0.0.0.0');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

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
