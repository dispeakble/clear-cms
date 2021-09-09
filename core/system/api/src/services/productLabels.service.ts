import { Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class ProductLabelsService {

    private methods = ["list", "add", "remove", "edit", "get"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list (params: any){
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
                                what: 'product_labels',
                                fields: ["*"]
                            }
                        }
                    };

                    const response = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({type: "label_list", data: response.data});
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public add(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'product_labels',
                                data: {
                                    title: params.title,
                                    value: params.value,
                                    description: params.description,
                                    type: params.type,
                                    active: params.active ? 1 : 0
                                }
                            }
                        }
                    };

                    const label = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The product was added",
                        data: {labelId: label.data[0]}
                    });
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
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'product_labels',
                                where: {
                                    id: params.id
                                },
                                data: {
                                    title: params.title,
                                    value: params.value,
                                    description: params.description,
                                    type: params.type,
                                    active: params.active ? 1 : 0
                                }
                            }
                        }
                    };

                    const label = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The label was edited",
                        data: { labelId: params.id }
                    });
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public get(params: any) {
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
                                what: 'product_labels',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };
                    const label = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The label fetched successfully",
                        data: label.data[0]
                    });
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public remove(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'product_labels',
                                how: 'OR',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The label/s deleted",
                        data: {}
                    });
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
            console.log("System.productLabelsService." + data.act + " not found");
        }
        return null;
    }

}