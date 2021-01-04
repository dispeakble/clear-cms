import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, ConnectedSocket, MessageBody
} from '@nestjs/websockets';
import {Logger, UseGuards} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {WsAuthGuard} from "../guards/ws.auth.guard";

/**
 *    Important URIs:
 *    https://docs.nestjs.com/websockets/gateways
 *    https://socket.io/docs/server-api/
 *    https://socket.io/docs/client-api/
 */

@WebSocketGateway({namespace: 'ws', transports: ['websocket']})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;
    private logger: Logger = new Logger('AppGateway');
    private callbacks = {};


    afterInit(server: Server) {
        console.log('Websocket Initialized...');
        this.wss.on('connect', (socket) => {
            //TODO CHECK IF THE SESSION IS AUTHORIZED AND REJECT NON-LOGINS
            console.log('Websocket Connected...');
            socket.on('message', (data) => {
                socket.send('handshake...')
            })
            socket.on('disconnect', this.handleDisconnect);
            return {sid: socket.id}
        })


    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('D')
    onDisconnect(@ConnectedSocket() client: Socket){
        client.disconnect(true);
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('S')
    onMessage(@ConnectedSocket() client: Socket, @MessageBody() params: any): Promise<WsResponse> {
        //console.log(`Message received for ${client.id}`);
        //console.log(params);
        return new Promise<WsResponse>(async (resolve) => {
            try {
                const response = {
                    event: params.channel,
                    data: await this.callbacks['onMessage']({data: params, client: client})
                };
                resolve(response);
            } catch (err) {
                console.log('Failed to resolve onMessage', JSON.stringify(err));
                resolve({event: params.channel, data: null});
            }
        })
    }

    //app functionality
    registerCallbacks(params) {
        const cbNames = Object.keys(params.callbacks);
        cbNames.map((cb) => {
            this.callbacks[cb] = params.callbacks[cb];
        })
    }
}
