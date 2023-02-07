import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import { ProtocolService } from "./protocol.service";
import { BucketService } from "./bucket.service";

@Injectable()
export class GeneralSettingsService {

    private methods = ["getInfo", "setInfo"];

    constructor(private protocolService: ProtocolService, private bucketService: BucketService) {

    }

    public async getInfo() {
        return new Observable(subscriber => {
            (async () => {
                const payload: payloadInterface = {
                    channel: `db`,
                    api: 'sql',
                    act: 'get',
                    payload: {
                        db: 'main',
                        channel: `system`,
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

                if(params.payload.data.logoBase64Data) {

                    const parts = params.payload.data.logoBase64Data.split(';base64,');

                    this.bucketService.perform({
                        act: 'uploadFromBase64',
                        payload: {
                            base64: parts[1],
                            filename: params.payload.data.websiteLogo,
                            path: 'images'
                        }
                    }).toPromise();

                    delete params.payload.data.logoBase64Data;
                }

                const request: payloadInterface = {
                    channel: `db`,
                    api: 'sql',
                    act: 'set',
                    payload: {
                        db: 'main',
                        channel: `system`,
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
                        success: "General Settings Updated",
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