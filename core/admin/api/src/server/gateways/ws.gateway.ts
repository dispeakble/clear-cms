import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { parse } from "url";
import { Logger } from "@nestjs/common";

/**
 *    Important URIs:
 *    https://docs.nestjs.com/websockets/gateways
 *    https://socket.io/docs/server-api/
 *    https://socket.io/docs/client-api/
 */

@WebSocketGateway({ namespace: "api/ws", transports: ["websocket", "polling"], allowUpgrades: true })
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;
    private callbacks = {};

    afterInit(server: Server) {
        Logger.log("Server Websocket Initialized...");
        server.on("connection", async (client, ...rest) => {
            client.on("disconnect", this.handleDisconnect);
            Logger.log("Client Websocket Connected...");
            return { sid: client.id };
        });
        server.on('upgrade', (req, socket, head) => {
            const { pathname } = parse(req.url, true);
            if (pathname !== '/_next/webpack-hmr') {
                socket.handleUpgrade(req, socket, head, function done(ws) {
                    socket.emit('connection', ws, req);
                });
            }
        });
    }

    async handleConnection(client: Socket) {
        Logger.log(`Client connected`);
        return new Promise<WsResponse>(async () => {
            client.emit("M", "welcome")
        });
    }

    handleDisconnect() {
        Logger.log("D");
    }

    @SubscribeMessage("D")
    onDisconnect(@ConnectedSocket() client: Socket) {
        client.disconnect(true);
    }

    @SubscribeMessage("M")
    onMessage(@ConnectedSocket() client: Socket, @MessageBody() params: any) {
        return new Promise(async (resolve) => {
            try {
                const response = await this.callbacks["onMessage"]({ data: params, client: client });
                response.id = params.id;
                const payload = {
                    event: "M",
                    data: response
                };
                resolve(payload);
            } catch (err) {
                Logger.log("Failed to resolve onMessage", JSON.stringify(err));
                resolve({ event: params.channel, data: null });
            }
        });
    }

    registerCallbacks(params) {
        const cbNames = Object.keys(params.callbacks);
        cbNames.map((cb) => {
            this.callbacks[cb] = params.callbacks[cb];
        });
    }
}
