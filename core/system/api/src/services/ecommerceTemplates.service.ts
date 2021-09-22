import { Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class EcommerceTemplatesService {

    private methods = ["listTemplates", "list", "edit"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'ecommerce_templates',
                                fields: ["*"],
                                ...params
                            }
                        }
                    };

                    const response = await this.protocolService.sendMessage(payload).toPromise();
                    let templateList = [];

                    if(response.data.length > 0) {
                        templateList = response.data;
                    }

                    subscriber.next({type: "ecommerce_templete_list", data: templateList});
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }


    public listTemplates (params: any){
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages',
                                fields: ["*"],
                                where: {
                                    istemplate: 1,
                                    ...params
                                }
                            }
                        }
                    };

                    const response = await this.protocolService.sendMessage(payload).toPromise();
                    let templateList = [];

                    if(response.data.length > 0) {
                        templateList = response.data;
                    }

                    subscriber.next({type: "templete_list", data: templateList});
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public edit(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const templateList = await Promise.all(params.ecommerceTemplates.map(async template => {
                        const row = await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'db',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'ecommerce_templates',
                                    data: {
                                        template_id: template.template_id,
                                        title: template.title,
                                        type: template.type
                                    },
                                    where: {
                                        id: template.id
                                    }
                                }
                            }
                        }).toPromise();
                        return row.data
                    }));

                    subscriber.next({type: "E commerce template list updated", data: templateList});
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.ProductTemplatesService." + data.act + " not found");
        }
        return null;
    }

}