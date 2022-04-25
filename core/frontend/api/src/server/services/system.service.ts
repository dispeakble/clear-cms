// @ts-ignore
import {Injectable} from '@nestjs/common';
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
            // @ts-ignore
            return this[data.act].call(Object.assign({}, data.payload));
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.SystemService." + data.act + " not found");
        }
        return null;
    }

    private checkService(params: any) {
        return new Promise((resolve, reject) => {
            const payload: payloadInterface = {
                channel: params.channel,
                api: 'protocol',
                act: 'ping',
                payload: null
            };
            const serviceReq = this.protocolService.sendMessage(payload);
            serviceReq.subscribe((response: any) => {
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

    private async waitForService(params: any) {
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
            await this.waitForService({channel: `${process.env.app}_hub`});
            await this.waitForService({channel: `${process.env.app}_db`});
            await this.waitForService({channel: `${process.env.app}_bucket`});
            await this.waitForService({channel: `${process.env.app}_frontendproxy`});

            const payload: payloadInterface = {
                api: 'module',
                act: 'register',
                channel: `${process.env.app}_hub`,
                config: {
                    restart: true,
                    stop: false
                },
                payload: data
            };
            const registerSub = this.protocolService.sendMessage(payload);
            registerSub.subscribe((data: any) => {
                resolve_register(data);
            }, (err: any) => {
                resolve_register(err);
            }, () => {
                resolve_register(null);
            });
        });
    }

}
