import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {payloadInterface} from "../interfaces/payload.interface";
import * as md5 from "md5";

@Injectable()
export class AuthService {

    private methods = ["login", "logout"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private login(params: any) {
        console.log("login entered")
        return new Promise((resolve) => {
            try {
                const metaPayload: payloadInterface = {
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
                                email: params.email,
                                password: md5.default(params.password)
                            },
                            limit: [0, 1]
                        }
                    }
                };

                this.protocolService.sendMessage(metaPayload).subscribe((data) => {
                    if(data){
                        console.log("login data", data)
                    }
                }, (err) => {
                    resolve(err);
                }, () => {
                    // do nothing
                });

            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
                resolve(err);
            }
            //here add logic to query the db for the user and create the session
            //condition: email, md5(password) and active = 1
            //also update the user accessedAt value
            //good luck :D

        });
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