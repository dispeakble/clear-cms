import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from "@nestjs/microservices";
import * as compression from 'compression';

let app;

const init = async () => {
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

    return 'Frontend module started';

}

function bootstrap() {
    try {
        init().then((message) => {
            console.log(message);
        });
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

bootstrap();
