import io from "socket.io-client";
import config from '../../package.json';

class WsService {

    client;
    url = `${config.proxy}/ws`;
    options = {transports: ['websocket']};
    callbacks = {
        message: {}
    };

    isConnected = false;

    start() {
        return new Promise((resolve_start) => {
            this.url = this.url;
            this.client = io(this.url, this.options);
            this.client.on('disconnect', (e) => this.ondisconnect(e))
            this.client.on('connect', () => {
                this.isConnected = true;
                resolve_start(true);
            });

            setTimeout(() => {
                resolve_start(true);
            }, 3000)
        });
    }

    onmessage(params) {
        try {
            if(params && params.channel){
                if(this.callbacks.message.hasOwnProperty(params.channel)){
                    this.callbacks.message[params.channel](params.data);
                } else {

                }

            }
        } catch (err) {
            console.error(err);
        }
    }

    ondisconnect(params) {
        this.isConnected = false;
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