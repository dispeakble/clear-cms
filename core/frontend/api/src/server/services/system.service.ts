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
            console.log("FrontendApi.SystemService." + data.act + " not found");
        }
        return null;
    }

    private checkService(params) {
        return new Promise((resolve, reject) => {
            const payload: payloadInterface = {
                channel: params.channel,
                api: 'protocol',
                act: 'ping',
                payload: null
            };
            const serviceReq = this.protocolService.sendMessage(payload);
            serviceReq.subscribe(response => {
                console.log(response);
                if ('pong' === response.data) {
                    clearTimeout(rejectTimeout);
                    resolve(true);
                }
            }, err => {
                console.log(err);
                reject(false);
            }, () => {
                //resolve(true);
            });
            const rejectTimeout = setTimeout(() => {
                reject(false);
            }, 1000);
        })

    }

    private async waitForService(params) {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(async () => {
                try {
                    const checkServiceResult = await this.checkService({channel: params.channel});
                    if (checkServiceResult) {
                        clearInterval(checkInterval);
                        resolve(true);
                    } else {
                        console.log(`${params.channel} not ready yet`);
                    }
                } catch (err) {
                    console.log(`${params.channel} not ready yet`);
                }
            }, 2000);
        });
    }

    public async registerModule(data: ModuleInterface) {
        return new Promise(async (resolve_register) => {
            await this.waitForService({channel: 'hub'});
            await this.waitForService({channel: 'db'});
            await this.waitForService({channel: 'bucket'});
            await this.waitForService({channel: 'frontendproxy'});

            const payload: payloadInterface = {
                api: 'module',
                act: 'register',
                channel: 'hub',
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
