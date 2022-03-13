import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, ConnectedSocket, MessageBody
} from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';

/**
 *    Important URIs:
 *    https://docs.nestjs.com/websockets/gateways
 *    https://socket.io/docs/server-api/
 *    https://socket.io/docs/client-api/
 */

@WebSocketGateway({namespace: 'ws', transports: ['websocket']})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;
    private callbacks = {};

    constructor() {
    }


    afterInit(server: Server) {
        console.log('Websocket Initialized...');
        server.on('connection', async (socket) => {
            socket.on('disconnect', this.handleDisconnect);
            this.handleConnection();
            return {sid: socket.id};
        })
    }

    handleConnection() {
        console.log('Websocket Connected...');
    }

    handleDisconnect() {
        console.log(`Client disconnected`);
    }

    @SubscribeMessage('D')
    onDisconnect(@ConnectedSocket() client: Socket){
        client.disconnect(true);
    }

    @SubscribeMessage('S')
    onMessage(@ConnectedSocket() client: Socket, @MessageBody() params: any): Promise<WsResponse> {
        //console.log(`Message received for ${client.id}`);
        //console.log(params);
        return new Promise<WsResponse>(async (resolve) => {
            try {
                const response = await this.callbacks['onMessage']({data: params, client: client});
                response.id = params.id;
                const payload = {
                    event: params.channel,
                    data: response
                };
                resolve(payload);
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
