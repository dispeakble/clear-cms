import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";

@Injectable()
export class PagesService {

    private methods = ["list", "add", "remove", "edit"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'pages',
                        fields: ["id", "title", "is_default", "publish", "cat_id"]
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    response = data.data;
                }
                subscriber.next({type: 'pages_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public add (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'add',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'pages',
                        data: {
                            title: params.title,
                            description: params.description,
                            parentid: params.parentid
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The page was added",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public edit (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'pages',
                        where: {
                            id: params.id
                        },
                        data: {
                            title: params.title,
                            description: params.description,
                            parentid: params.parentid
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The page was edited",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public remove (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'rem',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'pages',
                        how: 'OR',
                        where: {
                            id: params.id || 0
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The page was removed",
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
            console.log("System.pagesService." + data.act + " not found");
        }
        return null;
    }

}