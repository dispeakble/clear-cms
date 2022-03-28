import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as md5 from "md5";
import {Observable} from "rxjs";
import {randomBytes} from "crypto";
import * as bcrypt from 'bcrypt';
import * as utils from "../utils/sendEmail"
import {sendEmail} from "../utils/sendEmail";

@Injectable()
export class AuthService {

    private methods = ["doLogout", "doLogin", "generateRecoverEmail", "loadConfig", "doChangePassword", "ping"];
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
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'main',
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
                if (auth_response && auth_response && auth_response) {
                    observer.next({
                        type:'String',
                        data: auth_response,
                        mime: 'application/json',
                        callback: {
                            api: 'session',
                            act: 'register',
                            async: false,
                            payload: auth_response
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
                observer.next({
                    type:'String',
                    data: {error: "Internal server error"},
                    mime: 'application/json'
                });
                observer.complete();
            }, () => {
                observer.complete();
            });
        });
    }

    public generateRecoverEmail(params: any){
        return new Observable(observer => {
            (async () => {
                try{
                    const request = params.body.payload;
                    if(!request.hasOwnProperty('email')){
                        observer.complete();
                        return;
                    }
                    const adminRequest: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: 'system',
                            data: {
                                what: this.config.admin_table,
                                fields: this.config.admin_fields,
                                where: {
                                    email: request.email,
                                    active: 1,
                                },
                                limit: [0, 1]
                            }
                        }
                    }

                    const adminResponse = await this.protocolService.sendMessage(adminRequest).toPromise();

                    if(adminResponse && adminResponse.email){
                        const tokenPayload: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'get',
                            payload: {
                                db: 'main',
                                channel: 'system',
                                data: {
                                    what: 'token',
                                    where: {
                                        userId: adminResponse.id,
                                    },
                                    limit: [0, 1]
                                }
                            }
                        }

                        const tokenResponse = await this.protocolService.sendMessage(tokenPayload).toPromise();
                        if(tokenResponse) {
                            const removeTokenPayload: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'rem',
                                payload: {
                                    db: 'main',
                                    channel: 'system',
                                    data: {
                                        what: 'token',
                                        where: {
                                            userId: adminResponse.id,
                                        }
                                    }
                                }
                            }

                            const removeTokenResponse = await this.protocolService.sendMessage(removeTokenPayload).toPromise();
                        }

                        const resetToken = randomBytes(32).toString("hex")

                        const addTokenPayload: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'add',
                            payload: {
                                db: 'main',
                                channel: 'system',
                                data: {
                                    what: 'token',
                                    data:{
                                        userId: adminResponse.id,
                                        token: resetToken,
                                        createdAt: Date.now()
                                    }
                                }
                            }
                        }

                        const addTokenResponse = await this.protocolService.sendMessage(addTokenPayload).toPromise();

                        const settingsRequest: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'get',
                            payload: {
                                db: 'main',
                                channel: 'system',
                                data: {
                                    what: 'setting',
                                    data:{
                                        isDefault: 1,
                                    }
                                }
                            }
                        }

                        const settingsResponse = await this.protocolService.sendMessage(settingsRequest).toPromise();
                        const settings = JSON.parse(settingsResponse.data)
                        const link = `http://${settings.websiteDomain}/password-reset?token=${resetToken}`;

                        //await sendEmail(reset_response.email, "Password reset!", {name: reset_response.fname, link: link })

                        observer.next({
                            type:'String',
                            data: {success: "email sent."},
                            mime: 'application/json',
                        });
                    } else {
                        observer.next({
                            type:'String',
                            data: {error: "Internal server error"},
                            mime: 'application/json'
                        })
                    }
                    observer.complete()
                }catch(err){
                    observer.error(err);
                    observer.complete();
                }

            })()
        });
    }

    public async doChangePassword(params: any){
        return new Observable((subscriber) => {
            (async () => {
                const body = params.body.payload;
                const tokenPayload: payloadInterface = {
                    channel: 'db',
                    api: 'sql',
                    act: 'get',
                    payload: {
                        db: 'main',
                        channel: 'system',
                        data: {
                            what: 'token',
                            where: {
                                token: body.token,
                            },
                            limit: [0, 1]
                        }
                    }
                };

                const tokenResponse = await this.protocolService.sendMessage(tokenPayload).toPromise();

                if(tokenResponse){
                    const updateAdmin: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'set',
                        payload: {
                            db: 'main',
                            channel: 'system',
                            data: {
                                what: 'auth',
                                data:{
                                    password: md5.default(String(body.password)),
                                },
                                where: {
                                    id: Number(tokenResponse.userId)
                                }
                            }
                        }
                    };

                    const changePasswordResponse = await this.protocolService.sendMessage(updateAdmin).toPromise();

                    if(changePasswordResponse) {
                        const remTokenPayload: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'rem',
                            payload: {
                                db: 'main',
                                channel: 'system',
                                data: {
                                    what: 'token',
                                    where: {
                                        token: body.token,
                                    }
                                }
                            }
                        }

                        const remTokenResponse = await this.protocolService.sendMessage(remTokenPayload).toPromise();
                    }

                    const getAdminPayload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: 'system',
                            data: {
                                what: 'auth',
                                where: {
                                    id: tokenResponse.userId,
                                }
                            }
                        }
                    }

                    const resAdmin = await this.protocolService.sendMessage(getAdminPayload).toPromise();

                    const loginResponse = await this.doLogin({
                        body: {
                            payload:{
                                email: resAdmin.email,
                                password: body.password
                            }
                        }
                    }).toPromise();

                    subscriber.next(loginResponse);

                }else {
                    subscriber.error({
                        type:'String',
                        data: {error: "Internal server error"},
                        mime: 'application/json'
                    })
                }
                subscriber.complete()

            })();

        })
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