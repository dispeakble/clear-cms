import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
//import * as md5 from "md5";

@Injectable()
export class AdminThemesService {

    private methods = ["getOne", "getAll", "addInfo", "setInfo", "remInfo"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    onApplicationBootstrap() {

    }

    public getAll() {
        return new Observable((subscriber) => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'admin_themes',
                        fields: ["id", "title", "isdefault", "thumbnail"]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    response = data.data;
                }
                subscriber.next({type: 'admin_themes_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })

    }

    public getOne(params) {
        return new Observable((subscriber) => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'admin_themes',
                        fields: ["title", "isdefault", "thumbnail", "data"],
                        where: params.where,
                        limit: [0, 1]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = {};

                if (data && data.hasOwnProperty('data')) {
                    response = data.data[0];
                }
                    subscriber.next({type: 'admin_theme', data: response});
                }, err => {
                    subscriber.error(err);
                }, () => {
                    subscriber.complete();
            });
        });
    }

    public async setInfo(params) {

        if(params.data.isdefault){
            await this.setInfo({
                where:{
                    isdefault: 1
                },
                data:{
                    isdefault: 0
                }
            })
        }

        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'admin_themes',
                        where: params.where,
                        data: params.data
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

    public async addInfo(params) {
        if(params.isdefault){
            await this.setInfo({
                where:{
                    isdefault: 1
                },
                data:{
                    isdefault: 0
                }
            })
        }
        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'add',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'admin_themes',
                        data: {
                            title: params.title,
                            isdefault: params.isdefault,
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

    public remInfo(params) {
        return new Observable((subscriber) => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'rem',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'admin_themes',
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