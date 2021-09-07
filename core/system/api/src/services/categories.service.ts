import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";

@Injectable()
export class CategoriesService {

    private methods = ["list", "total", "add", "remove", "edit"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public total (params: any) {
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'categories',
                        fields: ["COUNT(id) as total"],
                        where: params?.where
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    response = data.data[0];
                }

                subscriber.next({type: 'categories_total', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        });
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
                        what: 'categories',
                        fields: ["id", "title", "description", "backgroundimage", "parentid"],
                        where: params?.where,
                        limit: params?.limit
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    response = data.data;
                }

                subscriber.next({type: 'categories_list', data: response, totalCategories: data.data.length});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public add (params: any){
        return new Observable(subscriber => {

            (async () => {
                try {
                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'categories',
                                data: {
                                    title: params.title,
                                    description: params.description,
                                    backgroundimage: params.backgroundimage,
                                    parentid: params.parentid
                                }
                            }
                        }
                    };

                    const cat = await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({
                        success: "The category was added",
                        data: {categoryId: cat.data[0].id}
                    })
                    subscriber.complete();
                } catch(err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

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
                        what: 'categories',
                        where: {
                            id: params.id
                        },
                        data: {
                            title: params.title,
                            description: params.description,
                            backgroundimage: params.backgroundimage,
                            parentid: params.parentid
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The category was edited",
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
                        what: 'categories',
                        how: 'OR',
                        where: {
                            id: params.id || 0
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The category was removed",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public completePath (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'bucket',
                api: 'fs',
                act: 'completePath',
                payload: {
                    path: params.path
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
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
            console.log("System.categoriesService." + data.act + " not found");
        }
        return null;
    }

}