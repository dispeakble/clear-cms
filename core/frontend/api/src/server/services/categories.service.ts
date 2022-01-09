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

    private methods = ["list", "add", "remove", "edit"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list (params: any){
        return new Observable(subscriber => {
            (async () => {

                try{
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'category',
                                fields: ["id", "title", "description", "backgroundImage", "parentId"],
                                where: params?.where
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise()

                    let results = null

                    if(res.hasOwnProperty('rows')){
                        if(res.rows.length > 0){
                            results = res.rows
                        }
                    }

                    subscriber.next({type: 'categories recieved', data: results});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })();
        })
    }

    public add(params: any){
        return new Observable(subscriber => {

            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'category',
                                data: {
                                    title: params.title,
                                    description: params.description,
                                    backgroundImage: params.backgroundimage,
                                    parentId: params.parentid
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The category was added",
                        data: res
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
            (async() => {
                try{
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'set',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'category',
                                where: {
                                    id: params.id
                                },
                                data: {
                                    title: params.title,
                                    description: params.description,
                                    backgroundImage: params.backgroundimage,
                                    parentId: params.parentid
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise()

                    subscriber.next({type: "Category updated successfully", data: res})
                    subscriber.complete()
                } catch(err){
                    subscriber.error(err)
                    subscriber.complete()
                }
            })()
        })
    }

    public remove (params: any){
        return new Observable(subscriber => {
            (async() => {
                try{
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'category',
                                how: 'OR',
                                where: {
                                    id: params.id || 0
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(payload).toPromise()
                    subscriber.next({type: "Category was removed", data: null})
                    subscriber.complete()
                }catch(err){
                    subscriber.error(err)
                    subscriber.complete()
                }
            })();
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
            console.log("Frontend.categoriesService." + data.act + " not found");
        }
        return null;
    }

}