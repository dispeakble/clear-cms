import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {

    private methods = ["publicPortMappingListen", "updatePortMapping"];
    private portMappingCallback;

    constructor() {
        //this.createWebSocket();
    }

    private publicPortMappingListen(data){
        this.portMappingCallback = data.callback;
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
            console.log("Frontend.appService." + data.act + " not found");
        }
        return null;
    }

}
