import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as md5 from "md5";

@Injectable()
export class AdminProfileService {

    private methods = ["getInfo", "setInfo"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    onApplicationBootstrap() {

    }

    public async getInfo(params) {
        const payload: payloadInterface = {
            channel: 'db',
            api: 'db',
            act: 'get',
            payload: {
                channel: 'system',
                data: {
                    what: 'auth_admin',
                    fields: ["fname", "lname", "email"],
                    where: {
                        id: params.client.id,
                        active: 1
                    },
                    limit: [0, 1]
                }
            }
        };

        const data = await this.protocolService.sendMessage(payload);

        let response = {};

        if (data && data.hasOwnProperty('data')) {
            response = data.data[0];
        }

        return response;
    }

    public async setInfo(params) {

        params.payload.fullName = params.payload.fname + " " + params.payload.lname;

        const request: payloadInterface = {
            channel: 'db',
            api: 'db',
            act: 'set',
            payload: {
                channel: 'system',
                data: {
                    what: 'auth_admin',
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
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'auth_admin',
                        fields: ["password"],
                        where: {
                            id: params.client.id,
                            "MD5(password)": md5.default(params.payload.password),
                            active: 1
                        },
                        limit: [0, 1]
                    }
                }
            };

            const response = await this.protocolService.sendMessage(checkPasswordRequest);

            if (response && response.data && response.data.length && response.data[0].password === params.payload.password) {
                request.payload.data.data.password = request.payload.data.data.confirmPassword + "";

            } else {
                return {error: "Please type the correct current password and try again."};
            }

        } else {
            delete request.payload.data.data.password;
        }

        delete request.payload.data.data.newPassword;
        delete request.payload.data.data.confirmPassword;

        await this.protocolService.sendMessage(request);

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