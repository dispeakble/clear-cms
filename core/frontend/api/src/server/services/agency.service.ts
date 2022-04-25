import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class AgencyService {
    private methods = ["get", "getTemplateVersion"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public get() {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                    channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'agency',
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: 'hotel',
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();
                    subscriber.next({type: 'Theme received', data: res});
                    subscriber.complete();
                    return res;
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async getHotels() {
        try {
            const payload: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'list',
                payload: {
                    db: 'agency',
                    channel: `${process.env.app}_frontend`,
                    data: {
                        what: 'hotel',
                    }
                }
            };

            return await this.protocolService.sendMessage(payload).toPromise();
        } catch (err) {
            return err
        }
    }

    getSettings() {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    /*const payload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'agency',
                            channel: 'frontend',
                            data: {
                                what: 'hotel',
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();*/
                    //TODO GET FROM DB SETTINGS INSTEAD OF HARD CODING
                    subscriber.next({
                        type: 'settings',
                        data: {
                            template: {
                                version: 'v2',
                                pallete: {
                                    primary: '#F00',
                                    secondary: '#0F0'
                                }
                            }
                        }
                    });
                    subscriber.complete();
                    return true;
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.agencyService." + data.act + " not found");
        }
        return null;
    }
}