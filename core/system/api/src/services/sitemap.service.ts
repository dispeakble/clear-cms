import { Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";
import { ProtocolService } from "./protocol.service";

@Injectable()
export class SitemapService {

    private methods = ["getPages", "listCategories", "pagesByCategory"];

    constructor(private protocolService: ProtocolService) {
    }

    public getPages (params: any){
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageReq: payloadInterface = {
                        channel: `db`,
                        api: 'db',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `system`,
                            data: {
                                what: 'pages',
                                fields: ["*"],//it's optional. defaults to *
                            }
                        }
                    };

                    let pages = await this.protocolService.sendMessage(pageReq).toPromise()
                    pages = pages.data
                    const totalPages = pages.length

                    if(params.page) {
                        const offset = (params.page - 1) * parseInt(params.numberOfLinksPerPage);
                        const end = offset + parseInt(params.numberOfLinksPerPage);

                        // Offset and Links Per Page
                        pages = pages.slice(offset, end);
                    }

                    subscriber.next({type: 'page', data: {pages, totalPages}});
                    subscriber.complete();
                } catch(err) {
                    console.log('err', err)
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
    }

    public listCategories (){
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageReq: payloadInterface = {
                        channel: `db`,
                        api: 'db',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `system`,
                            data: {
                                what: 'categories',
                                fields: ["*"],//it's optional. defaults to *,
                            }
                        }
                    };

                    const categories = await this.protocolService.sendMessage(pageReq).toPromise()

                    subscriber.next({type: 'page', data: categories.data});
                    subscriber.complete();
                } catch(err) {
                    console.log('err', err)
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
    }

    public pagesByCategory(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageToCategoryReq: payloadInterface = {
                        channel: `db`,
                        api: 'db',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `system`,
                            data: {
                                what: 'pages_to_categories',
                                fields: ["page_id"],//it's optional. defaults to *,
                                how: "OR",
                                where: {
                                    category_id : params.id
                                }
                            }
                        }
                    };

                    let pageIds = await this.protocolService.sendMessage(pageToCategoryReq).toPromise();

                    if(pageIds.data && pageIds.data.length > 0) {
                        pageIds = pageIds.data.map((page) => page.page_id);
                    }

                    const pageReq: payloadInterface = {
                        channel: `db`,
                        api: 'db',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `system`,
                            data: {
                                what: 'pages',
                                fields: ["*"],//it's optional. defaults to *,
                                how: "OR",
                                where: {
                                    cat_id: params.id
                                }
                            }
                        }
                    };

                    let pages = await this.protocolService.sendMessage(pageReq).toPromise();
                    pages = pages.data;
                    const totalPages = pages.length

                    if(params.page) {
                        const offset = (params.page - 1) * parseInt(params.numberOfLinksPerPage);
                        const end = offset + parseInt(params.numberOfLinksPerPage);

                        // Offset and Links Per Page
                        pages = pages.slice(offset, end);
                    }

                    subscriber.next({type: 'page', data: {pages, totalPages}});
                    subscriber.complete();
                } catch(err) {
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
            console.log("System.sitemapService." + data.act + " not found");
        }
        return null;
    }

}