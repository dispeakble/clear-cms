import { Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class ProductLocalityService {

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
                                what: 'localities',
                                fields: ["*"]
                            }
                        }
                    };

                    const response = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({type: "locality_list", data: response.data});
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
                                what: 'localities',
                                data: {
                                    title: params.title,
                                    country_id: params.country_id,
                                    gps: params.gps,
                                    active: params.active ? 1 : 0
                                }
                            }
                        }
                    };

                    const locality = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The locality was added",
                        data: {labelId: locality.data[0]}
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
                                what: 'localities',
                                where: {
                                    id: params.id
                                },
                                data: {
                                    title: params.title,
                                    country_id: params.country_id,
                                    gps: params.gps,
                                    active: params.active ? 1 : 0
                                }
                            }
                        }
                    };

                    const locality = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The locality was edited",
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
                                what: 'localities',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };
                    const locality = await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The locality fetched successfully",
                        data: locality.data[0]
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
                                what: 'localities',
                                how: 'OR',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(payload).toPromise();

                    subscriber.next({
                        success: "The locality/s deleted",
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
            console.log("System.productLocalityService." + data.act + " not found");
        }
        return null;
    }

}