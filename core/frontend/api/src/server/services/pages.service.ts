// @ts-ignore
import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
// @ts-ignore
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class PagesService {

    private methods = ["list", "get"];


    // @ts-ignore
    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable((subscriber: any) => {
            (async () => {
                try{
                    const payload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'list',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: 'page',
                                how: "AND",
                            }
                        }
                    };

                    if(params.where) {
                        payload.payload.data.where = params.where;
                    }

                    const res = await this.protocolService.sendMessage(payload).toPromise();

                    let results = null
                    if(res && res.hasOwnProperty('rows')){
                        if(res.rows.length > 0){
                            results = res.rows
                        }
                    }

                    subscriber.next({type: 'pages_list', data: results});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })();
        })
    }

    public get(params: any) {
        return new Observable((subscriber: any) => {
            (async () => {
                try {
                    const pageReq: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: 'page',
                                include: [{
                                    model: 'pageBox',
                                    through: 'pageToBox',
                                    required: false
                                }, {
                                    model: 'category',
                                    through: 'pageToCategory',
                                    required: false
                                }, {
                                    model: 'pageConfig',
                                    through: 'pageToConfig',
                                    required: false
                                }]
                            }
                        }
                    };

                    if(params.body.where) {
                        pageReq.payload.data.where = params.body.where;
                    }

                    const page = await this.protocolService.sendMessage(pageReq).toPromise();

                    if(!page) {
                        subscriber.error({
                            message: "404 not found",
                            statusCode: 404
                        });
                        subscriber.complete();
                        return;
                    }

                    const settingPayload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: 'setting'
                            }
                        }
                    };

                    const settings =  await this.protocolService.sendMessage(settingPayload).toPromise();

                    const formattedPage = {
                        id: page.id,
                        title: page.title,
                        link: page.link,
                        pageConfig: JSON.parse(page.pageConfig[0].data),
                        settings: JSON.parse(settings.data),
                        items: page.boxes.map((box: any) => {
                            box.data = JSON.parse(box.data);
                            box.moduleOptions = JSON.parse(box.moduleOptions);
                            return box;
                        })
                    }

                    subscriber.next({type: 'CompletePage', data: formattedPage});
                    subscriber.complete();
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.log('err', err)
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            // @ts-ignore
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.pagesService." + data.act + " not found");
        }
        return null;
    }

}