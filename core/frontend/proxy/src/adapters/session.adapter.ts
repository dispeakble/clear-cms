import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import {Inject} from "@nestjs/common";
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
        return super.createIOServer(port, options);
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