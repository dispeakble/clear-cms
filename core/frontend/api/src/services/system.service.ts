import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import {ProtocolService} from "./protocol.service";

@Injectable()
export class SystemService {

    private methods = ["registerModule"];



    constructor(private protocolService: ProtocolService) {
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act].call(Object.assign({}, data.payload));
        } else {
            console.log("Frontend.appService." + data.act + " not found");
        }
        return null;
    }

    public registerModule(data: ModuleInterface) {
        let payload: payloadInterface = {
            api: 'module',
            act: 'register',
            channel: 'hub',
            config: {
                restart: true,
                stop: false
            },
            payload: data
        };
        return this.protocolService.sendMessage(payload);
    }

}
