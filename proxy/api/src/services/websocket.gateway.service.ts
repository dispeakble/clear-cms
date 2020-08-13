import {Injectable, Logger} from "@nestjs/common";
import {
    SubscribeMessage,
    MessageBody,
    /*ConnectedSocket,*/
    WebSocketGateway, ConnectedSocket,
    /*WebSocketServer,*/
    /*WsResponse,*/
} from '@nestjs/websockets';
import {from, Observable} from "rxjs";
import {Socket} from "socket.io";

@WebSocketGateway(8282)

@Injectable()
export class WebsocketGatewayService {

    private logger = new Logger();
    private subscriber;

    @SubscribeMessage('events')
    async onEvent(@MessageBody() data: unknown, @ConnectedSocket() client: Socket){
        //const event = 'events';
        //const response = [1, 2, 3];

        /*return from(response).pipe(
            map(data => ({ event, data })),
        );*/

        //TODO send the message to the registered pod

        this.logger.log('Got some message from someone');
        this.logger.log(JSON.stringify(data));

        return await new Promise((resolve) => {//the weirdest thing I've every done
            const callback = function(response){
                resolve(response);
            }

            this.subscriber.next({data:data, client:client, callback:callback});
        });

    }

    public subscribeToWs(data: any): Observable<any> {
        return new Observable<any>( subscriber => {
            this.subscriber = subscriber;
        } )
    }

}