import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import * as md5 from "md5";
import fs from "fs";

@Injectable()
export class UsersService {

    private methods = ["getOne", "updateRtHash", "deleteRefreshToken", "getUserById", "updateUser", "updateUserPassword", "getUserByEmailAndPassword"];

    constructor(
        @Inject('ProtocolService') private protocolService
        ) {
    }

    private config = {
        admin_table: "",
        admin_fields: []
    };

    public loadConfig() {
        const config_string = fs.readFileSync(__dirname + '/../../config/auth.json').toString('utf-8');
        this.config = JSON.parse(config_string);
    }

    private getUserByEmailAndPassword(email: string, password: string){
        return new Observable(subscriber => {
            (async () => {
                const userResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'auth',
                            fields: ['email'],
                            where: {
                                email: email,
                                active: 1,
                                password: password
                            },
                            limit: [0, 1]
                        }
                    }
                }).toPromise();

                subscriber.next(userResults)
                subscriber.complete()
            })()
        })
    }

    private getOne(email: string) {
        return new Observable(subscriber => {
            (async () => {
                const userResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'auth',
                            where: {
                                email: email,
                                active: 1
                            },
                            limit: [0, 1]
                        }
                    }
                }).toPromise();

                subscriber.next(userResults)
                subscriber.complete()
            })()
         })
    }

    private updateUser(payload: any, _user: any) {
        return new Observable(subscriber => {
            (async () => {
                const updateUserResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "set",
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'auth',
                            as: "Auth",
                            where: {
                                active: 1,
                                email: _user.email,
                            },
                            data: payload
                        }
                    }
                }).toPromise();

                subscriber.next(updateUserResults)
                subscriber.complete()
            })()
        })
    }

    private updateUserPassword(email: string, password: string){
        return new Observable(subscriber => {
            (async () => {
                const updateUserResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "set",
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: "auth",
                            as: "Auth",
                            where: {
                                active: 1,
                                email: email,
                            },
                            data: {
                                password: md5.default(String(password))
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(updateUserResults)
                subscriber.complete()
            })()
        })
    }

    private updateRtHash(refresh_token: string, email: string){
        return new Observable(subscriber => {
            (async () => {
                const updateRequest = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "set",
                    payload: {
                        db: "main",
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'auth',
                            where: {
                                email: email,
                            },
                            data: {
                                "refresh_token" : refresh_token
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(updateRequest)
                subscriber.complete()
            })()
        })
    }

    private deleteRefreshToken(userId: number){
        return new Observable(subscriber => {
            (async () => {
                const updateRequest = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "set",
                    payload: {
                        db: "main",
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'auth',
                            as: "Client",
                            where: {
                                id: userId
                            },
                            data: {
                                "refresh_token" : null,
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(updateRequest)
                subscriber.complete()
            })()
        })
    }

    private getUserById(userId: number){
        return new Observable(subscriber => {
            (async () => {
                const userResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: "main",
                        data: {
                            what: "auth",
                            as: "Client",
                            where: {
                                active: 1,
                                id: userId,
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(userResults)
                subscriber.complete()
            })()
        })
    }




    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.userService." + data.act + " not found");
        }
        return null;
    }

}