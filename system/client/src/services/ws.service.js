import io from "socket.io-client";

class WsService {

    client;
    url = 'ws://'+ window.location.host +'/ws';//TODO GET FROM SERVER AND WSS AS WELL
    options = {transports: ['websocket']};
    callbacks = {
        message: {}
    };

    start() {
        return new Promise((resolve_start) => {
            this.url = Number(window.location.port) === 3000 ? 'ws://localhost:9696/ws' : 'ws://'+ window.location.host +'/ws';
            this.client = io(this.url, this.options);
            this.client.on('disconnect', (e) => this.ondisconnect(e))
            this.client.on('connect', () => {
                resolve_start(true);
            });
        });
    }

    onmessage(params) {
        try {
            if(params && params.channel && this.callbacks.message.hasOwnProperty(params.channel)){
                this.callbacks.message[params.channel](params.data);//tricky...
            }
        } catch (err) {
            console.error(err);
        }
    }

    ondisconnect(params) {
        console.log(params);
    }

    emit(params){
        if(!this.client){
            return;
        }
        return this.client.emit('S', params);
    }

    send(params){
        if(!this.client){
            return;
        }
        return this.client.send('S', params);
    }

    subscribe(params){
        if(!this.client){
            return;
        }
        this.callbacks.message[params.channel] = params.callbacks.message;
        this.client.off(params.channel);
        this.client.on(params.channel, (e) =>
        {
            return this.onmessage({channel:params.channel, data: e})
        })//tricky...
    }

    unsubscribe(params){
        delete this.callbacks.message[params.channel];
    }

}

export default WsService;