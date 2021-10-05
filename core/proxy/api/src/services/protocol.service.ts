import {ClientProxy} from "@nestjs/microservices";
import {Inject, Injectable, CACHE_MANAGER} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Cache} from "cache-manager";
import {Observable} from "rxjs";

@Injectable()
export class ProtocolService {

    //exposed methods
    private methods = ["sendMessage", "emitMessage", "sendPost", "sendGet", "getMeta", "ping", "setValue", "getValue",
        "checkAccess", "requestHandshake", "confirmHandshake"];

    private handshakes = {};

    @Inject('REDIS_SERVICE') private redisService: ClientProxy;
    @Inject(CACHE_MANAGER) private cacheManager: Cache;

    constructor() {

    }

    public start() {
        return this.redisService.connect();
    }

    public sendMessage(data: payloadInterface) {

        const payload: payloadInterface = {
            channel: data.channel,
            api: data.api,
            act: data.act,
            type: data.type,
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

    public checkAccess(data: any){
        return new Promise((resolve) => {
            this.redisService.send({message: data.channel}, {
                api: 'bucket',
                act: 'checkAccess',
                payload: data.payload
            }).subscribe(data => {
                resolve(data);
            }, error => {
                resolve(error);
            }, () => {
            });
        });

    }

    public sendPost(data: any) {
        const payload = {
            api: data.api,
            act: data.act,
            payload: data.payload.body.payload
        };
        return this.redisService.send({message: data.channel}, payload);
    }

    public sendGet(data: any) {
        const payload = {
            api: 'bucket',
            act: 'get',
            payload: data.payload
        };
        return this.redisService.send({message: data.channel}, payload);
    }

    public getMeta(data: any){
        const payload = {
            api: 'bucket',
            act: 'getMeta',
            payload: data.payload
        };
        return this.redisService.send({message: data.channel}, payload).toPromise();
    }

    public ping(data: any, config: ModuleInterface){
        return {
            data: 'pong',
            name: config.name,
            version: config.version
        };
    }

    public setValue(key: string, value: any){
        return this.cacheManager.set(key, value, {ttl: 3600});
    }

    public getValue(key: string){
        return this.cacheManager.get(key);
    }

    /*-- Start Redis subscriber bidirectional lock --*/
    public startHandshake(params, config) {
        const myId = Math.round(Math.random() * 1000000);
        return {
            thePromise: new Promise((resolve) => {
                this.handshakes[myId] = resolve;
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
                type: params.type,
                payload: {
                    responderId: myId,
                    callerId: params.callerId,
                    message: 'handshake confirmed'
                }
            });

            params.perform({
                channel: config.channel,
                api: params.api,
                act: params.act,
                perform: params.perform,
                payload: {
                    initiator: initiator
                }
            })
        })
    }

    public confirmHandshake(params) {
        return new Observable(subscriber => {
            try {
                if (!this.handshakes.hasOwnProperty(params.callerId)) {
                    subscriber.complete();
                }
                this.handshakes[params.callerId]({
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
            console.log("Proxy.protocolService." + data.act + " not found");
        }
        return null;
    }

}