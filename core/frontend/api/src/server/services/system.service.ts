import {Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import {PayloadInterface} from "../interfaces/PayloadInterface";
import {ProtocolService} from "./protocol.service";

@Injectable()
export class SystemService {

    private methods = ["registerModule"];


    constructor(private protocolService: ProtocolService) {
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](Object.assign({}, data.payload));
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.SystemService." + data.act + " not found");
        }
        return null;
    }

    private checkService(params) {
        return new Promise((resolve, reject) => {
            const payload: PayloadInterface = {
                channel: params.channel,
                api: 'protocol',
                act: 'ping',
                payload: null
            };
            const serviceReq = this.protocolService.sendMessage(payload);
            serviceReq.subscribe(response => {
                if ('pong' === response.data) {
                    clearTimeout(rejectTimeout);
                    resolve(true);
                }
            }, () => {
                reject(false);
            }, () => {
                //resolve(true);
            });
            const rejectTimeout = setTimeout(() => {
                reject(false);
            }, 50);
        })

    }

    private async waitForService(params) {
        return new Promise((resolve) => {
            const checkInterval = setInterval(async () => {
                try {
                    const checkServiceResult = await this.checkService({channel: params.channel});
                    if (checkServiceResult) {
                        clearInterval(checkInterval);
                        resolve(true);
                    } else {
                        // eslint-disable-next-line no-console
                        console.log(`${params.channel} not ready yet`);
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.log(`${params.channel} not ready yet`);
                }
            }, 300);
        });
    }

    public async registerModule(data: ModuleInterface) {
        return new Promise(async (resolve_register) => {

            try {
                if(data.dependencies && data.dependencies.length) {
                    await Promise.all(data.dependencies.map((dep: Record<string, any>) => {
                        return this.waitForService({channel: dep.name});
                    }));
                } else {
                    await Promise.all([
                        this.waitForService({channel: `hub`}),
                        this.waitForService({channel: `db`}),
                        this.waitForService({channel: `bucket`}),
                        this.waitForService({channel: `frontendproxy`})
                    ]);
                }
            } catch {
                'noop';
            }



            const payload: PayloadInterface = {
                api: 'module',
                act: 'register',
                channel: `hub`,
                config: {
                    restart: true,
                    stop: false
                },
                payload: data
            };
            const registerSub = this.protocolService.sendMessage(payload);
            registerSub.subscribe(data => {
                resolve_register(data);
            }, err => {
                resolve_register(err);
            }, () => {
                resolve_register(null);
            });
        });
    }

}
