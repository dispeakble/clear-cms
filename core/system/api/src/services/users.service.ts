import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class UsersService {

    private methods = ["list", "add", "remove", "edit"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'users',
                        fields: ["id", "fname", "lname", "email", "type", "active", "added", "accessed"],
                        where: params?.where
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    response = data.data;
                }
                subscriber.next({type: 'users_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public add (params: any){
        return new Observable(subscriber => {

            (async () => {
                try {
                    const request: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'users',
                                data: {
                                    fname: params.fname,
                                    lname: params.lname,
                                    email: params.email,
                                    password: params.password,
                                    type: params.type,
                                    active: params.active,
                                    added: Date.now(),
                                    accessed: 0
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
                } catch(err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    public edit (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'users',
                        where: {
                            id: params.id
                        },
                        data: {
                            fname: params.fname,
                            lname: params.lname,
                            email: params.email,
                            password: params.password,
                            type: params.type,
                            active: params.active
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The user was edited",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public remove (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'rem',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'users',
                        where: {
                            id: params.id
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