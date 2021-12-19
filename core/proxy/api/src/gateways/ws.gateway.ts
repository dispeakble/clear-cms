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

    private async checkSession(client) {
        let hasAccess = null;
        try {
            hasAccess = await this.sessionService.checkByCookie({cookies: client.handshake.headers.cookie.replace(/ /g,"")});
        } catch (err) {
            console.log(err);
        }

        if(!hasAccess){
            client.emit('auth', {method:"redirect", data:{location:'/view-auth'}});
            client.emit('disconnect');
            client.disconnect(true);
            return console.log('Client does not have access. Please go away');
        }
    }


    afterInit(server: Server) {
        console.log('Websocket Initialized...');
        server.on('connection', async (client, ...rest) => {
            await this.checkSession(client);

            client.on('disconnect', this.handleDisconnect);
            console.log('Websocket Connected...', rest);
            return {sid: client.id}
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
        return new Promise<WsResponse>(async (resolve) => {
            try {
                await this.checkSession(client);

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

    registerCallbacks(params) {
        const cbNames = Object.keys(params.callbacks);
        cbNames.map((cb) => {
            this.callbacks[cb] = params.callbacks[cb];
        })
    }
}
