import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";

@Injectable()
export class PublicThemesService {

    private methods = ["getOne", "getAll", "addInfo", "setInfo", "remInfo"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    onApplicationBootstrap() {

    }

    public async getAll() {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'public_themes',
                                fields: ["id", "title", "isdefault", "thumbnail"]
                            }
                        }
                    };

                    const data = await this.protocolService.sendMessage(payload).toPromise();

                    let response = null;

                    if (data && data.hasOwnProperty('data')) {
                        response = data.data;
                    }

                    subscriber.next({type: 'Themes recieved', data: response});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async getOne(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'public_themes',
                                fields: [
                                    "title",
                                    "bgcolor",
                                    "bgimage",
                                    "fontsize",
                                    "fontfamily",
                                    "textcolor",
                                    "isdefault",
                                    "thumbnail",
                                    "boxspacing",
                                    "bgrepeat",
                                    "bgstretch",
                                    "bggradient",
                                    "mui"],
                                where: params.where,
                                limit: [0, 1]
                            }
                        }
                    };

                    const data = await this.protocolService.sendMessage(payload).toPromise();

                    let response = {};

                    if (data && data.hasOwnProperty('data')) {
                        response = data.data[0];
                    }

                    subscriber.next({type: 'Theme recieved', data: response});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async setInfo(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
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

                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'public_themes',
                                where: params.where,
                                data: params.data
                            }
                        }
                    };

                    await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({type: "The theme was updated", data: null});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async addInfo(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'public_themes',
                                data: {
                                    "title": params.title,
                                    "bgcolor": params.bgcolor,
                                    "bgimage": params.bgimage,
                                    "fontsize": params.fontsize,
                                    "fontfamily": params.fontfamily,
                                    "textcolor": params.textcolor,
                                    "isdefault": params.isdefault,
                                    "thumbnail": params.thumbnail,
                                    "boxspacing": params.boxspacing,
                                    "bgrepeat": params.bgrepeat,
                                    "bgstretch": params.bgstretch,
                                    "bggradient": params.bggradient,
                                    "mui": params.mui
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({type: "The theme was added", data: null});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
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


    }

    public async remInfo(params) {
        return new Observable((subscriber) => {
            (async () => {
               try {
                   const request: payloadInterface = {
                       channel: 'db',
                       api: 'db',
                       act: 'rem',
                       payload: {
                           channel: 'system',
                           data: {
                               what: 'public_themes',
                               where: params
                           }
                       }
                   };

                   await this.protocolService.sendMessage(request).toPromise();
                   subscriber.next({type: 'The theme was removed', data: null});
                   subscriber.complete();
               } catch(err){
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
            console.log("System.publicThemes." + data.act + " not found");
        }
        return null;
    }

}