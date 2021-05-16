import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class SystemService {

    private methods = ["registerModule"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Dev.systemService." + data.act + " not found");
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
