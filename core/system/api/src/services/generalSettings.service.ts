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
                    channel: `${process.env.app}_db`,
                    api: 'sql',
                    act: 'get',
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'setting',
                            fields: ["id", "data"],
                            where: {
                                isDefault: 1
                            },
                        }
                    }
                };

                const data = await this.protocolService.sendMessage(payload).toPromise();

                let response = {};

                if (data && data.hasOwnProperty('data')) {
                    response = data;
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
                    channel: `${process.env.app}_db`,
                    api: 'sql',
                    act: 'set',
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'setting',
                            where: {
                                isDefault: 1
                            },
                            data: {
                                data: JSON.stringify(params.payload.data)
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