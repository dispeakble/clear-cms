import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";

@Injectable()
export class AdminThemesService {

    private methods = ["get", "list", "add", "set", "rem"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    public list() {
        return new Observable((subscriber) => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'list',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'adminTheme',
                        fields: ["id", "title", "isDefault", "thumbnail"]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('rows')) {
                    response = data.rows;
                }
                subscriber.next({type: 'admin_themes_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })

    }

    public get(params) {
        return new Observable((subscriber) => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'adminTheme',
                        fields: params.fields || ["title", "isDefault", "thumbnail", "data"],
                        where: params.where,
                        limit: [0, 1]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'admin_theme', data: data});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        });
    }

    public async set(params) {

        if (params.data.isDefault) {
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'adminTheme',
                        where: {
                            isDefault: 1
                        },
                        fields: {
                            isDefault: 0
                        }
                    }
                }
            };

            await this.protocolService.sendMessage(request).toPromise();
        }

        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'adminTheme',
                        where: params.where,
                        fields: params.data
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The theme was updated",
                    data: null
                });
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        });
    }

    public async add(params) {
        if (params.isDefault) {
            await this.set({
                where: {
                    isDefault: 1
                },
                data: {
                    isDefault: 0
                }
            })
        }
        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'add',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'adminTheme',
                        data: {
                            title: params.title,
                            isDefault: params.isDefault,
                            thumbnail: params.thumbnail,
                            data: params.data,
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The theme was added",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })

    }

    public rem(params) {
        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'rem',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'adminTheme',
                        where: params
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The theme was removed",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.adminThemes." + data.act + " not found");
        }
        return null;
    }

}