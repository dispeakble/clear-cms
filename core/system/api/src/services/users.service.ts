import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class UsersService {

    private methods = ["list", "add", "rem", "set"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {

            const whereObj = {
                'or': []
            };

            ["fname", "lname", "email"].map(field => {
                whereObj['or'].push({[field]: {'LIKE': `%${params.search}%`}});
            })

            const payload: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'list',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'user',
                        fields: ["id", "fname", "lname", "email", "type", "active", "createdAt", "accessedAt", "updatedAt"],
                        where: null,
                        order: params?.order,
                        limit: params?.limit
                    }
                }
            };

            if (params.search && params.search.length > 2) {
                payload.payload.data.where = whereObj;
            }

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'users_list', data: data});
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
                            db: 'main',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'user',
                                data: {
                                    fname: String(params.fname),
                                    lname: String(params.lname),
                                    email: String(params.email),
                                    password: String(params.password),
                                    type: Number(params.type),
                                    active: Number(params.active)
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(request).toPromise();


                    subscriber.next({
                        success: "The user was added",
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
            const request: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'set',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'user',
                        data: params.data,
                        where: params.where
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The user was updated",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public rem(params: any) {
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'rem',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'user',
                        where: {
                            id: Number(params.id)
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The user was removed",
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
            console.log("System.usersService." + data.act + " not found");
        }
        return null;
    }

}