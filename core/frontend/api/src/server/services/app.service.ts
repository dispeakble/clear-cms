// @ts-ignore
import {Inject, Injectable} from '@nestjs/common';

@Injectable()
export class AppService {

    private methods = ["protocolCall"];

    // @ts-ignore
    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private async protocolCall(params: any) {

        const payload = {
            act: params.protocolMethod,
            payload: {
                channel: params.channel,
                api: params.api,
                act: params.act,
                payload: params.payload
            }
        };

        return this.protocolService.perform(payload);

    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            // @ts-ignore
            return this[data.act](data.payload);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.AppService." + data.act + " not found");
        }
        return null;
    }

}
