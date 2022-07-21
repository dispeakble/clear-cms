import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as md5 from "md5";
import {Observable} from "rxjs";
import { ProtocolService } from "./protocol.service";

@Injectable()
export class AdminProfileService {

    private methods = ["getInfo", "setInfo"];

    constructor(private protocolService: ProtocolService) {

    }

    public async getInfo(params) {
        return new Observable(subscriber => {
            (async () => {
                const payload: payloadInterface = {
                    channel: `db`,
                    api: 'sql',
                    act: 'get',
                    payload: {
                        db: 'main',
                        channel: `system`,
                        data: {
                            what: 'auth',
                            fields: ["fname", "lname", "email", "address"],
                            where: {
                                id: params.client.id,
                                active: 1
                            },
                            limit: [0, 1]
                        }
                    }
                };

                const data = await this.protocolService.sendMessage(payload).toPromise();

                subscriber.next({
                    data: data
                });
                subscriber.complete();
            })()

        })

    }

    public async setInfo(params) {

        params.payload.fullName = params.payload.fname + " " + params.payload.lname;

        const request: payloadInterface = {
            channel: `db`,
            api: 'sql',
            act: 'set',
            payload: {
                db: 'main',
                channel: `system`,
                data: {
                    what: 'auth',
                    where: {
                        id: params.client.id,
                        active: 1
                    },
                    data: params.payload
                }
            }
        };

        //get the current password if the user wants to change it

        if (params.payload.password.length && params.payload.newPassword.length && params.payload.confirmPassword.length) {
            //double check password matching
            if (params.payload.newPassword !== params.payload.confirmPassword) {
                return {error: "Passwords don't match. Please try again"};
            }
            //check the old password

            const checkPasswordRequest: payloadInterface = {
                channel: `db`,
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'main',
                    channel: `system`,
                    data: {
                        what: 'auth',
                        fields: ["password"],
                        where: {
                            id: params.client.id,
                            "password": md5.default(params.payload.password),
                            active: 1
                        },
                        limit: [0, 1]
                    }
                }
            };

            const response = await this.protocolService.sendMessage(checkPasswordRequest).toPromise();

            if (response && response.password === md5.default(params.payload.password)) {
                request.payload.data.data.password = md5.default(request.payload.data.data.confirmPassword);

            } else {
                return {error: "Please type the correct current password and try again."};
            }

        } else {
            delete request.payload.data.data.password;
        }

        delete request.payload.data.data.newPassword;
        delete request.payload.data.data.confirmPassword;

        await this.protocolService.sendMessage(request).toPromise();

        return {
            success: "Your details were saved successfully",
            data:{
                fullName: params.payload.fullName
            }
        };
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.adminProfile." + data.act + " not found");
        }
        return null;
    }

}