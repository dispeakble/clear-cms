import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";

@Injectable()
export class PublicThemesService {

    private methods = ["get", "list", "add", "set", "rem"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    onApplicationBootstrap() {

    }

    public async list() {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'publicTheme',
                                fields: ["id", "title", "isDefault", "thumbnail"]
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();

                    let results = null

                    if(res && res.hasOwnProperty('rows')){
                        if(res.rows.length > 0){
                            results = res.rows.map((theme, i) => {
                                return{
                                    id : theme.id,
                                    title: theme.title,
                                    isdefault: theme.isDefault,
                                    thumbnail: theme.thubmnail
                                }
                            })
                        }
                    }

                    subscriber.next({type: 'Themes recieved', data: results});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async get(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'publicTheme',
                                fields: [
                                    "id",
                                    "title",
                                    "data",
                                    "isDefault",
                                    "thumbnail",],
                                where: params.where,
                                limit: [0, 1]
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();
                    const results = {
                        id: res.id,
                        title: res.title,
                        isdefault: res.isDefault,
                        thumbnail : res.thumbnail,
                        bgcolor : JSON.parse(res.data).bgcolor,
                        bgimage: JSON.parse(res.data).bgimage,
                        fontsize: JSON.parse(res.data).fontsize,
                        fontfamily: JSON.parse(res.data).fontfamily,
                        textcolor: JSON.parse(res.data).textcolor,
                        boxspacing: JSON.parse(res.data).boxspacing,
                        bgrepeat: JSON.parse(res.data).bgrepeat,
                        bgstretch: JSON.parse(res.data).bgstretch,
                        bggradient: JSON.parse(res.data).bggradient,
                        mui: JSON.parse(res.data).mui
                    }

                    subscriber.next({type: 'Theme recieved', data: results});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async set(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    if(params.data.isDefault){
                        await this.set({
                            where:{
                                isDefault: 1
                            },
                            data:{
                                isDefault: 0
                            }
                        })
                    }

                    const _data = {
                        bgcolor: params.data.bgcolor,
                        bgimage: params.data.bgimage,
                        fontsize: params.data.fontsize,
                        textcolor: params.data.textcolor,
                        fontfamily: params.data.fontfamily,
                        boxspacing: params.data.boxspacing,
                        bgrepeat: params.data.bgrepeat,
                        bgstretch: params.data.bgstretch,
                        bggradient: params.data.bggradient,
                        mui: params.data.mui
                    }

                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'publicTheme',
                                where: params.where,
                                fields: [
                                    "title",
                                    "data",
                                    "isDefault",
                                    "thumbnail",],
                                data: {
                                    "title": params.data.title,
                                    "data": JSON.stringify(_data),
                                    "isDefault": params.data.isDefault,
                                    "thumbnail": params.data.thumbnail,
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({type: "The theme was updated", data: res});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async add(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const _data = {
                        bgcolor: params.bgcolor,
                        bgimage: params.bgimage,
                        fontsize: params.fontsize,
                        fontfamily: params.fontfamily,
                        textcolor: params.textcolor,
                        boxspacing: params.boxspacing,
                        bgrepeat: params.bgrepeat,
                        bgstretch: params.bgstretch,
                        bggradient: params.bggradient,
                        mui: params.mui
                    }
                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'publicTheme',
                                data: {
                                    "title": params.title,
                                    "data": JSON.stringify(_data),
                                    "isDefault": params.isdefault ? 1 : 0,
                                    "thumbnail": params.thumbnail,
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({type: "The theme was added", data: res});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
        if(params.isdefault){
            await this.set({
                where:{
                    isDefault: 1
                },
                data:{
                    isDefault: 0
                }
            })
        }


    }

    public async rem(params) {
        return new Observable((subscriber) => {
            (async () => {
               try {
                   const request: payloadInterface = {
                       channel: 'db',
                       api: 'sql',
                       act: 'rem',
                       payload: {
                           channel: 'system',
                           data: {
                               what: 'publicTheme',
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