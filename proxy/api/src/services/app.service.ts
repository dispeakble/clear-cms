import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {

    private methods = ["portMappingListen", "updatePortMapping"];
    private portMappingCallback;

    constructor() {
        //this.createWebSocket();
    }

    private portMappingListen(data){
        this.portMappingCallback = data.cb;
    }

    private updatePortMapping(data){
        this.portMappingCallback(data);
        console.log(data);
        return data;
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload);
        } else {
            console.log("Proxy.appService." + data.act + " not found");
        }
        return null;
    }

}
