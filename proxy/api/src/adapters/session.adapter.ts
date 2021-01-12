import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'socket.io';
//import * as sharedsession from 'express-socket.io-session';
import {ConfigService} from "../services/config.service";
import { RedisService } from 'nestjs-redis';
import * as session from "express-session";
import * as ConnectRedis from 'connect-redis';
import {Inject} from "@nestjs/common";
import * as http from "http";
import {MessageMappingProperties} from "@nestjs/websockets";
import {EMPTY, fromEvent, Observable} from "rxjs";
import {filter, mergeMap} from "rxjs/operators";

/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */

export class SessionAdapter extends IoAdapter {
    private app: NestExpressApplication;

    @Inject('REDIS_SERVICE') private redisService;
    @Inject('Session') private session;

    constructor(app : NestExpressApplication) {
        super(app);
        this.app = app;
    }

    createIOServer(port: number, options?: any): any {
        //left here for example
        console.log(this.session);
        const server : Server = super.createIOServer(port, options);
        //const configService: ConfigService = this.app.get(ConfigService)

        // const redisClient = this.redisService.getClient();
        // const store = new RedisStore({ client: redisClient });
        //
        // let ses = session.default({
        //     store,
        //     saveUninitialized: true,
        //     secret: configService.SESSION_SECRET,
        //     resave: false,
        //     cookie: {
        //         signed: true,
        //         maxAge: 86400000
        //     }
        // });
        //
        // this.app.use(ses)
        return server;
    }

    bindClientConnect(server, callback: Function) {
        server.on('connection', callback);
    }

    bindMessageHandlers(
        client: WebSocket,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ) {
        fromEvent(client, 'message')
            .pipe(
                mergeMap(data => this.bindMessageHandler(data, handlers, process)),
                filter(result => result),
            )
            .subscribe(response => client.send(JSON.stringify(response)));
    }

    bindMessageHandler(
        buffer,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ): Observable<any> {
        const message = JSON.parse(buffer.data);
        const messageHandler = handlers.find(
            handler => handler.message === message.event,
        );
        if (!messageHandler) {
            return EMPTY;
        }
        return process(messageHandler.callback(message.data));
    }

    close(server) {
        server.close();
    }
}