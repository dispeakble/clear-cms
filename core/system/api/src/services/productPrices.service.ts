import { Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class ProductPricesService {

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
                                what: 'prices_to_products',
                                fields: ["*"]
                            }
                        }
                    };

                    const response = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({type: "prices_list", data: response.data});
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
                                what: 'prices_to_products',
                                data: {
                                    product_id: params.product_id,
                                    currency: params.currency,
                                    value: params.value,
                                    active: params.active ? 1 : 0
                                }
                            }
                        }
                    };

                    const productPrice = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The Product price was added",
                        data: {labelId: productPrice.data[0]}
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
                                what: 'prices_to_products',
                                where: {
                                    id: params.id
                                },
                                data: {
                                    product_id: params.product_id,
                                    currency: params.currency,
                                    value: params.value,
                                    active: params.active ? 1 : 0
                                }
                            }
                        }
                    };

                    const productPrice = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The Product price was edited",
                        data: { priceId: params.id }
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
                                what: 'prices_to_products',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };
                    const productPrice = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The Product Price fetched successfully",
                        data: productPrice.data[0]
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
                                what: 'prices_to_products',
                                how: 'OR',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The Product price deleted",
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
            console.log("System.productPricesService." + data.act + " not found");
        }
        return null;
    }

}