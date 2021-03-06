import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, ConnectedSocket, MessageBody
} from '@nestjs/websockets';
import {Session} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {SessionService} from "../services/session.service";

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

    constructor(private sessionService: SessionService) {
    }


    afterInit(server: Server) {
        console.log('Websocket Initialized...');
        server.on('connection', async (socket, ...rest) => {

            const hasAccess = await this.sessionService.checkByCookie({cookies: socket.handshake.headers.cookie});

            if(!hasAccess){
                socket.emit('auth', {method:"redirect", data:{location:'/view-auth'}});
                socket.emit('disconnect');
                socket.disconnect(true);
                return console.log('Client does not have access. Please go away');
            }

            socket.on('disconnect', this.handleDisconnect);
            console.log('Websocket Connected...', rest);
            return {sid: socket.id}
        })


    }

    async handleConnection(client: Socket, @Session() session) {


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
