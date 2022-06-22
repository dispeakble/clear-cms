import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import * as md5 from "md5";
import {Observable} from "rxjs";

@Injectable()
export class AuthService {

    private methods = ["login", "logout"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private login(params: any) {
        console.log("login entered", params, "params")
        return new Observable(subscriber => {
            (async () => {
                try {
                    const loginPayload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: "sql",
                        act: "get",
                        payload: {
                            db: "main",
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: "client",
                                where: {
                                    active: 1,
                                    email: params.data.email,
                                    password: md5.default(params.data.password)
                                },
                                limit: [0, 1]
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(loginPayload).toPromise();

                    subscriber.next(res);
                    subscriber.complete();


                } catch (err) {
                    subscriber.next(err);
                    subscriber.complete();
                }
            })()
        })
    }

    private logout(params: any) {
        return new Promise((resolve) => {
            //here remove the session
        });
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