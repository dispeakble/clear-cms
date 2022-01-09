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
                                    isDefault: theme.isDefault,
                                    thumbnail: theme.thubmnail
                                }
                            })
                        }
                    }

                    subscriber.next({type: 'Themes received', data: results});
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
                        isDefault: res.isDefault,
                        thumbnail : res.thumbnail,
                        bgColor : JSON.parse(res.data).bgColor,
                        bgImage: JSON.parse(res.data).bgImage,
                        fontSize: JSON.parse(res.data).fontSize,
                        fontFamily: JSON.parse(res.data).fontFamily,
                        textColor: JSON.parse(res.data).textColor,
                        boxSpacing: JSON.parse(res.data).boxSpacing,
                        bgRepeat: JSON.parse(res.data).bgRepeat,
                        bgStretch: JSON.parse(res.data).bgStretch,
                        bgGradient: JSON.parse(res.data).bgGradient,
                        mui: JSON.parse(res.data).mui
                    }

                    subscriber.next({type: 'Theme received', data: results});
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
                        bgColor: params.data.bgColor,
                        bgImage: params.data.bgImage,
                        fontSize: params.data.fontSize,
                        textColor: params.data.textColor,
                        fontFamily: params.data.fontFamily,
                        boxSpacing: params.data.boxSpacing,
                        bgRepeat: params.data.bgRepeat,
                        bgStretch: params.data.bgStretch,
                        bgGradient: params.data.bgGradient,
                        mui: params.data.mui
                    }

                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'set',
                        payload: {
                            channel: 'frontend',
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

    public async add(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {

                    if(params.isDefault){
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
                        bgColor: params.bgColor,
                        bgImage: params.bgImage,
                        fontSize: params.fontSize,
                        textColor: params.textColor,
                        fontFamily: params.fontFamily,
                        boxSpacing: params.boxSpacing,
                        bgRepeat: params.bgRepeat,
                        bgStretch: params.bgStretch,
                        bgGradient: params.bgGradient,
                        mui: params.mui
                    }
                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'frontend',
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