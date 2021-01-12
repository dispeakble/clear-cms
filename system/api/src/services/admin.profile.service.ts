import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as md5 from "md5";
import {Observable} from "rxjs";

@Injectable()
export class AdminProfile {

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
                    what: 'admin_auth',
                    fields: ["fname", "lname", "email"],
                    where: {
                        email: params.user.email,
                        active: 1
                    },
                    limit: [0, 1]
                }
            }
        };

        const response = await this.protocolService.sendMessage(payload);

        return response;
    }

    public async setInfo() {

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