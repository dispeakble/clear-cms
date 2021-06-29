import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from "@nestjs/microservices";

const init = async () => {

    let app = await NestFactory.create(
        AppModule
    );

    //left here for example: app.useWebSocketAdapter(new SessionAdapter(app));

    await app.init();

    await app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            return_buffers: true,
            url: 'redis://' + process.env.redis_server,
            port: +process.env.redis_port,
            password: process.env.redis_password,
            retryAttempts: 20,
            retryDelay: 3000,
        }
    });

    await app.startAllMicroservicesAsync();
    console.log('init done');

    //app.listen(+process.env.backend_port, '0.0.0.0');

    console.log('Bucket module started');

}

try {
    init();
} catch (e) {
    console.log('Warning! Could not start the bucket module');
}
