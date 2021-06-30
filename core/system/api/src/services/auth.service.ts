import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as md5 from "md5";
import {Observable} from "rxjs";
import * as mime from "mime";

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

    public doLogout() {
        return new Observable((observer) => {
            observer.next({
                type:'String',
                data: {logout: "ok"},
                mime: 'application/json',
                callback: {
                    api: 'session',
                    act: 'unregister',
                    async: false,
                    payload: {logout: "ok"}
                }
            });
            observer.complete();
        })
    }

    public doLogin(params: any) {
        return new Observable((observer) => {
            const request = params.body.payload;
            if (!request.hasOwnProperty('email') || !request.hasOwnProperty('password') || !request.email.length || !request.password.length) {
                observer.complete();
                return;
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
                            email: request.email,
                            active: 1,
                            'password': md5.default(request.password)
                        },
                        limit: [0, 1]
                    }
                }
            }
            observer.next({type: 'meta', content_type: 'application/json'});
            this.protocolService.sendMessage(payload).subscribe((auth_response) => {
                if (auth_response && auth_response.data && auth_response.data.length) {
                    observer.next({
                        type:'String',
                        data: auth_response.data[0],
                        mime: 'application/json',
                        callback: {
                            api: 'session',
                            act: 'register',
                            async: false,
                            payload: auth_response.data[0]
                        }
                    });
                } else {
                    observer.next({
                        type:'String',
                        data: {error: "Credentials mismatch"},
                        mime: 'application/json'
                    });
                }
                observer.complete();
            }, err => {
                console.log(err)
            }, () => {
                observer.complete();
            });
        });
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