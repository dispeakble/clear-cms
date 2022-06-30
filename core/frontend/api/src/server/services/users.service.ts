import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";

@Injectable()
export class UsersService {

    private methods = ["getOne", "updateRtHash", "deleteRefreshToken", "getUserById"];

    constructor(
        @Inject('ProtocolService') private protocolService
        ) {
    }


    private getOne(email: string) {
        return new Observable(subscriber => {
            (async () => {
                const userResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: "agency",
                        data: {
                            what: "client",
                            as: "Client",
                            where: {
                                active: 1,
                                email: email,
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(userResults)
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
                        db: "agency",
                        data: {
                            what: "client",
                            as: "Client",
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
                        db: "agency",
                        data: {
                            what: "client",
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
                        db: "agency",
                        data: {
                            what: "client",
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