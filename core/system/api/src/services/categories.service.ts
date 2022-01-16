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

    private methods = ["list", "total", "add", "rem", "set"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public total(params: any) {
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'sql',
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

    public list(params: any) {
        return new Observable(subscriber => {

            const whereObj = {
                'or': []
            };

            ["title", "description"].map(field => {
                whereObj['or'].push({[field]: {'LIKE': `%${params.search}%`}});
            })

            const payload: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'list',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'category',
                        fields: ["id", "title", "description", "backgroundImage", "parentId", "createdAt", "updatedAt"],
                        where: null,
                        order: params?.order,
                        limit: params?.limit
                    }
                }
            };

            if (params?.search && params?.search.length > 2) {
                payload.payload.data.where = whereObj;
            } else if(params?.where) {
                payload.payload.data.where = params.where;
            }

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'categories_list', data: data});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public add(params: any) {
        return new Observable(subscriber => {

            (async () => {
                try {
                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'category',
                                data: {
                                    title: params.title,
                                    description: params.description,
                                    backgroundImage: params.backgroundImage,
                                    parentId: params.parentId
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({
                        success: "The category was added",
                        data: res
                    })
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    public set(params: any) {
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'category',
                        where: {
                            id: params.id
                        },
                        fields: {
                            title: params.title,
                            description: params.description,
                            backgroundImage: params.backgroundImage,
                            parentId: params.parentId
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The category was updated",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public rem(params: any) {
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'rem',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'category',
                        where: {
                            id: params.id
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

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.categoriesService." + data.act + " not found");
        }
        return null;
    }

}