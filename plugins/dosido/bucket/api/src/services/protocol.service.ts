import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";


@Injectable()
export class ProtocolService {

    //exposed methods
    private methods = ["sendMessage", "emitMessage", "ping", "setValue", "getValue", "startHandshake", "requestHandshake", "confirmHandshake"];
    private handhakes: any = {};

    @Inject('REDIS_SERVICE') private redisService: ClientProxy;

    public start() {
        return this.redisService.connect();
    }

    public sendMessage(data: payloadInterface) {

        let payload: payloadInterface = {
            channel: data.channel,
            api: data.api,
            act: data.act,
            payload: data.payload || ""
        };

        return this.redisService.send({message: data.channel}, payload);

    }

    public emitMessage(data: any) {

        let payload: payloadInterface = {
            api: data.module,
            act: data.act,
            channel: data.channel,
            payload: data.payload || ""
        };

        return this.redisService.emit({message: data.channel}, payload);

    }

    public ping(data: any, config: ModuleInterface){
        return {
            data: 'pong',
            name: config.name,
            version: config.version
        };
    }

    /*-- Start Redis subscriber bidirectional lock --*/
    public startHandshake(params, config) {
        const myId = Math.round(Math.random() * 1000000);
        return {
            thePromise: new Promise((resolve) => {
                this.handhakes[myId] = resolve;
            }),
            theObserver: this.sendMessage({
                channel: params.channel,
                api: 'protocol',
                act: 'requestHandshake',
                payload: {
                    callerId: myId,
                    indication: params.indication,
                    respond: {
                        channel: config.config.channel,
                        api: 'protocol',
                        act: 'confirmHandshake'
                    }

                }
            })
        }
    }

    public requestHandshake(params, config) {
        return new Observable(subscriber => {
            const myId = Math.round(Math.random() * 1000000);//TODO use UUID
            subscriber.next({
                responderId: myId,
                message: 'handshake request received'
            });

            const initiator = this.sendMessage({
                channel: params.respond.channel,
                api: params.respond.api,
                act: params.respond.act,
                payload: {
                    responderId: myId,
                    callerId: params.callerId,
                    message: 'handshake confirmed'
                }
            });

            params.perform({
                channel: config.config.channel,
                api: params.indication.api,
                act: params.indication.act,
                payload: {
                    initiator: initiator
                }
            }).subscribe((response) => {
                subscriber.next(response);
            }, (errResponse) => {
                subscriber.error(errResponse);
            }, () => {

            })

        })
    }

    public confirmHandshake(params) {
        return new Observable(subscriber => {
            try {
                if (!this.handhakes.hasOwnProperty(params.callerId)) {
                    subscriber.complete();
                }
                this.handhakes[params.callerId]({
                    responderId: params.responderId,
                    thePusher: subscriber
                });
            } catch (err) {
                console.log(err.message)
            }
        });
    }

    /*-- End Redis subscriber bidirectional lock --*/

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Bucket.protocolService." + data.act + " not found");
        }
        return null;
    }

}