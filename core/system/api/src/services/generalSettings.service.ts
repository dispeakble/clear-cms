import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as md5 from "md5";
import {Observable} from "rxjs";

@Injectable()
export class GeneralSettingsService {

    private methods = ["getInfo", "setInfo"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    public async getInfo(params) {
        return new Observable(subscriber => {
            (async () => {
                const payload: payloadInterface = {
                    channel: 'db',
                    api: 'db',
                    act: 'get',
                    payload: {
                        channel: 'system',
                        data: {
                            what: 'settings',
                            fields: ["id", "data"],
                            where: {
                                is_default: 1
                            },
                        }
                    }
                };

                const data = await this.protocolService.sendMessage(payload).toPromise();

                let response = {};

                if (data && data.hasOwnProperty('data') && data.data.length > 0) {
                    response = data.data[0];
                    subscriber.next({
                        success: "General Settings Fetched",
                        data: response
                    });
                }

                subscriber.next({
                    data: response
                });

                subscriber.complete();
            })()
        })
    }

    public async setInfo(params) {
        return new Observable(subscriber => {
            (async () => {
                const request: payloadInterface = {
                    channel: 'db',
                    api: 'db',
                    act: 'set',
                    payload: {
                        channel: 'system',
                        data: {
                            what: 'settings',
                            where: {
                                is_default: 1
                            },
                            data: {
                                data: params.payload.data
                            },
                        }
                    }
                };

                this.protocolService.sendMessage(request).subscribe(data => {
                    subscriber.next({
                        success: "General Settings Updated New",
                        data: data
                    })
                }, err => {
                    subscriber.error(err);
                }, () => {
                    subscriber.complete();
                });
            })()
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.generalSettings." + data.act + " not found");
        }
        return null;
    }

}