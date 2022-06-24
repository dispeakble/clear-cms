import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import * as md5 from "md5";
import {Observable} from "rxjs";
import {randomBytes} from "crypto";

@Injectable()
export class AuthService {

    private methods = ["login", "logout", "getToken"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private getToken(params:any){
        return new Observable(subscriber => {
            (async () => {
                const tokenResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: "agency",
                        data: {
                            what: "client",
                            as: "Client",
                            attributes: ['token'],
                            where: {
                                active: 1,
                                email: params.data.email
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(tokenResults.token);
                subscriber.complete();
            })()
        })
    }

    private login(params: any) {
        return new Observable(subscriber => {
            (async () => {
                const loginResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: "agency",
                        data: {
                            what: "client",
                            as: "Client",
                            attributes: ['firstName', 'lastName' , 'email', 'accessedAt', 'createdAt'],
                            where: {
                                active: 1,
                                email: params.data.email,
                                password: md5.default(params.data.password)
                            }
                        }
                    }
                }).toPromise();

                if(loginResults){
                    const token = randomBytes(32).toString("hex");

                    await this.protocolService.sendMessage({
                        channel: `${process.env.app}_db`,
                        api: "sql",
                        act: "set",
                        payload: {
                            db: "agency",
                            data: {
                                what: "client",
                                as: "ClientUpdate",
                                where: {
                                    email: params.data.email
                                },
                                data: {
                                    "accessedAt": new Date(),
                                    "token": token
                                }
                            }
                        }
                    }).toPromise();

                    loginResults.accessedAt = new Date()
                    loginResults.token = token
                }

                subscriber.next({data: loginResults || {error: "Credentials mismatch."}});
                subscriber.complete();
            })()
        })
    }

    private logout(params: any) {
        return new Observable(subscriber => {
            (async () => {
                const logoutRequest = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "set",
                    payload: {
                        db: "agency",
                        data: {
                            what: "client",
                            as: "ClientLogout",
                            where: {
                                email: params.data.email
                            },
                            data: {
                                "token": ""
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(logoutRequest);
                subscriber.complete();
            })()
        })
    }


    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.authService." + data.act + " not found");
        }
        return null;
    }

}