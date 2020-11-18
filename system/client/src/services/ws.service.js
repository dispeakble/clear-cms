import io from "socket.io-client";

class WsService {

    client;
    url = 'ws://127.0.0.1:9696/ws';//TODO GET FROM SERVER AND WSS AS WELL
    options = {transports: ['websocket']};
    callbacks = {
        message: {}
    };

    start(data) {
        return new Promise((resolve_start) => {
            this.client = io(this.url, this.options);

            //['message', 'disconnect'].map((e) => this.client.on(e, this['on' + e]));


            this.client.on('disconnect', (e) => this.ondisconnect(e))


            this.client.on('connect', () => {
                resolve_start(true);
            })
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
        return this.client.emit('S', params);
    }

    send(params){
        return this.client.send('S', params);
    }

    subscribe(params){
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