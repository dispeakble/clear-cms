import {Injectable} from '@nestjs/common';
import * as SystemInformation from "systeminformation";
import {ProtocolService} from "./protocol.service";
import * as os from "os";
import {Observable} from "rxjs";

@Injectable()
export class ResourcesService {

    private methods = ["getHardwareInfo"];

    constructor(private protocolService: ProtocolService) {
    }

    private getHardwareInfo(params) {
        return new Observable(subscriber => {
            (async () => {
                switch (params.type) {
                    case 'CPU':
                        const cpu_data = await SystemInformation.currentLoad();
                        subscriber.next({data: cpu_data});
                        subscriber.complete();
                        break;
                    case 'RAM':
                        const ram_data = await SystemInformation.mem();
                        subscriber.next({data: ram_data});
                        subscriber.complete();
                        break;
                    case 'NET':
                        const net_data = await SystemInformation.networkStats();
                        subscriber.next({data: net_data});
                        subscriber.complete();
                        break;
                }

            })()

        })
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](Object.assign({}, data.payload));
        } else {
            console.log("System.resources." + data.act + " not found");
        }
        return null;
    }

}
