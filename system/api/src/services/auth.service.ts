import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as md5 from "md5";

@Injectable()
export class AuthService {

    private methods = ["doLogout", "doLogin", "loadConfig", "ping"];
    private config = {
        admin_table: "",
        admin_fields: []
    };

    constructor(@Inject('ProtocolService') private protocolService) {


    }

    public ping() {
        return "pong";
    }

    public loadConfig() {
        const config_string = fs.readFileSync(__dirname + '/../../config/auth.json').toString('utf-8');
        this.config = JSON.parse(config_string);
    }

    onApplicationBootstrap() {
        try {
            this.loadConfig();
        } catch (err) {
            console.log(err);
        }
    }

    public async doLogout() {
        return {
            data: {logout: "ok"},
            mime: 'application/json',
            callback: {
                api: 'session',
                act: 'unregister',
                async: false,
                payload: {logout: "ok"}
            }
        };
    }

    public async doLogin(params) {

        if (!params.hasOwnProperty('email') || !params.hasOwnProperty('password') || !params.email.length || !params.password.length) {
            return null;
        }

        const payload: payloadInterface = {
            channel: 'db',
            api: 'db',
            act: 'get',
            payload: {
                channel: 'system',
                data: {
                    what: this.config.admin_table,
                    fields: this.config.admin_fields,
                    where: {
                        email: params.email,
                        active: 1,
                        'MD5(password)': md5.default(params.password)//TODO call MD5
                    },
                    limit: [0, 1]
                }
            }
        }
        const auth_response = await this.protocolService.sendMessage(payload);

        if (auth_response && auth_response.data && auth_response.data.length) {

            return {
                data: auth_response.data,
                mime: 'application/json',
                callback: {
                    api: 'session',
                    act: 'register',
                    async: false,
                    payload: auth_response.data[0]
                }
            };
        }

        return null;
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.httpService." + data.act + " not found");
        }
        return null;
    }

}