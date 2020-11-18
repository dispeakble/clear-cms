import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
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
    private callbacks = {};

    afterInit(server: Server) {
        this.logger.log('Initialized...');
        this.wss.on('connect', function (socket) {
            socket.on('message', (data) => {
                console.log(data);
                socket.send('handshake...')
            })
            return {sid: socket.id}
        })
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('S')
    onMessage(client: Socket, payload: any): Promise<WsResponse> {
        this.logger.log(`Message received for ${client.id}`);
        this.logger.log(payload);
        try {
            return new Promise<WsResponse>(async (resolve) => {
                const data = {event: payload.channel, data: await this.callbacks['onMessage'](payload)}
                resolve(data)
            })

        } catch(err){
            console.log('cannot call onMessage on parent', JSON.stringify(err));
        }
    }

    //app functionality
    registerCallbacks(params){
        let cbNames = Object.keys(params.callbacks);
        cbNames.map((cb) => {
            this.callbacks[cb] = params.callbacks[cb];
        })
    }
}
