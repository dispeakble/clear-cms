import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {PayloadInterface} from "../interfaces/PayloadInterface";

@Injectable()
export class PagesService {

    private methods = ["list", "get"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try{
                    const payload: PayloadInterface = {
                        channel: `db`,
                        api: 'sql',
                        act: 'list',
                        payload: {
                            db: 'main',
                            data: {
                                what: 'page',
                                how: "AND",
                            }
                        }
                    };

                    if(params.where) {
                        payload.payload.data.where = params.where;
                    }

                    const res: any = await this.protocolService.sendMessage(payload).toPromise();

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
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageReq: PayloadInterface = {
                        channel: `db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
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

                    const page: any = await this.protocolService.sendMessage(pageReq).toPromise();

                    if(!page) {
                        subscriber.error({
                            message: "404 not found",
                            statusCode: 404
                        });
                        subscriber.complete();
                        return;
                    }

                    const settingPayload: PayloadInterface = {
                        channel: `db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            data: {
                                what: 'setting'
                            }
                        }
                    };

                    const settings: any =  await this.protocolService.sendMessage(settingPayload).toPromise();

                    const formattedPage = {
                        id: page.id,
                        title: page.title,
                        link: page.link,
                        pageConfig: JSON.parse(page.pageConfig[0].data),
                        settings: JSON.parse(settings.data),
                        items: page.boxes.map((box) => {
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
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Admin.pagesService." + data.act + " not found");
        }
        return null;
    }

}