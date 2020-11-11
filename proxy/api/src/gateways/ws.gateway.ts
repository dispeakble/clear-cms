import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, MessageBody
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Socket, Server} from 'socket.io';

/**
 *    Important URIs:
 *    https://docs.nestjs.com/websockets/gateways
 *    https://socket.io/docs/server-api/
 *    https://socket.io/docs/client-api/
 */

//@WebSocketGateway({serveClient: true})
@WebSocketGateway({namespace: 'ws', transports: ['websocket']})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;
    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server) {
        this.logger.log('Initialized...');
        this.wss.on('connect', function (socket) {
            //console.log(server);
            socket.on('message', (data) => {
                socket.send('hehe')
            })
            return {sid: socket.id}
        })
        this.wss.on('error', function (data) {
            console.log(data);
        })

        console.log(this.wss.eventNames())

        this.wss.on('message', (data) => {
            console.log(data);
        })
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);

        return {event: 'C', data: {sid: client.id}}
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('S')
    handleMessage(client: Socket, payload: any): WsResponse<string> {
        this.logger.log(`Message received for ${client.id}`);
        this.logger.log(payload);
        //this.wss.emit('msgToClient', payload); // send data to every client
        //client.emit('messageToClient', payload); // send data to client socket only
        return {event: payload.channel, data: "pong"}; // send data to client socket only
    }
}
