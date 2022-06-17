import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";
import md5 from "md5";

@Injectable()
export class ClientsService {

    private methods = ["list", "add", "rem", "set"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {

            const whereObj = {
                'or': []
            };

            ["firstName", "lastName", "email"].map(field => {
                whereObj['or'].push({[field]: {'LIKE': `%${params.search}%`}});
            })

            const payload: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'list',
                payload: {
                    db: 'agency',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'client',
                        attributes: ["id", "firstName", "lastName", "email", "active", "createdAt", "accessedAt", "updatedAt"],
                        where: null,
                        order: params?.order || [],
                        limit: params?.limit
                    }
                }
            };

            if (params.search && params.search.length > 2) {
                payload.payload.data.where = whereObj;
            }

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'client_list', data: data});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public add(params: any) {
        return new Observable(subscriber => {

            (async () => {
                try {
                    const request: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'add',
                        payload: {
                            db: 'agency',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'client',
                                data: {
                                    firstName: String(params.firstName),
                                    lastName: String(params.lastName),
                                    email: String(params.email),
                                    password: md5(String(params.password)),
                                    type: Number(params.type),
                                    active: Number(params.active)
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({
                        success: "The client was added",
                        data: res
                    })
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    public set(params: any) {
        return new Observable(subscriber => {

            try {
                const where = {
                    id: +params.data.id
                };

                delete params.data.id;
                delete params.data.createdAt;
                delete params.data.accessedAt;

                const request: payloadInterface = {
                    channel: `${process.env.app}_db`,
                    api: 'sql',
                    act: 'set',
                    payload: {
                        db: 'agency',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'client',
                            data: params.data,
                            where: where
                        }
                    }
                };

                if(params.data.password && params.data.password.length) {
                    request.payload.data.data.password = md5(String(params.data.password));
                }

                this.protocolService.sendMessage(request).subscribe(data => {
                    subscriber.next({
                        success: "The client was updated",
                        data: null
                    })
                }, err => {
                    subscriber.error(err);
                }, () => {
                    subscriber.complete();
                });
            } catch (err) {
                subscriber.error(err);
            }

        })
    }

    public rem(params: any) {
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'rem',
                payload: {
                    db: 'agency',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'client',
                        where: {
                            id: Number(params.id)
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The client was removed",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.clientsService." + data.act + " not found");
        }
        return null;
    }

}