import { Inject, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {

    public logger: Logger = new Logger('App.Service');
    private methods = ["protocolCall"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private protocolCall(params) {

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
            return this[data.act](data.payload);
        } else {
            this.logger.log(`Admin.AppService.${data.act} not found`);
        }
        return null;
    }

}
