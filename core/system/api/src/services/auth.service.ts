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

    private methods = ["doLogout", "doLogin", "doPasswordReset", "loadConfig", "doChangePassword", "ping"];
    private config = {
        admin_table: "",
        admin_fields: [],
        host:""
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

    public doPasswordReset(params: any){
        return new Observable(observer => {
            const request = params.body.payload;
            if(!request.hasOwnProperty('email')){
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
                        },
                        limit: [0, 1]
                    }
                }
            }

            observer.next({type: 'meta', content_type: 'application/json'});
            this.protocolService.sendMessage(payload).subscribe(async (reset_response) => {
                if(reset_response && reset_response.email){
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
                                    userId: reset_response.id,
                                },
                                limit: [0, 1]
                            }
                        }
                    }

                    const res = await this.protocolService.sendMessage(tokenPayload).toPromise();
                    if(res) {
                        const remPayload: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'rem',
                            payload: {
                                db: 'main',
                                channel: 'system',
                                data: {
                                    what: 'token',
                                    where: {
                                        userId: reset_response.id,
                                    }
                                }
                            }
                        }

                        const resDel = await this.protocolService.sendMessage(remPayload).toPromise();
                    }

                    const tempSalt = 10;

                    const resetToken = randomBytes(32).toString("hex")
                    const hash = await bcrypt.hash(resetToken, Number(tempSalt))

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
                                    userId: reset_response.id,
                                    token: hash,
                                    createdAt: Date.now()
                                }
                            }
                        }
                    }

                    const addToken = await this.protocolService.sendMessage(addTokenPayload).toPromise();

                    const link = `http://${this.config.host}/password-reset?token=${resetToken}&id=${reset_response.id}`;

                    await sendEmail(reset_response.email, "Password reset!", {name: reset_response.fname, link: link })

                    observer.next({
                        success: "link sent",
                        data: null
                    })
                } else {
                    observer.next({
                        error: "error occurred",
                        data: null
                    })
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

    public async doChangePassword(params: any){
        return new Observable((subscriber) => {
            const body = params.body.payload;
            //check if the token exists as long as the user
            const request: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'main',
                    channel: 'system',
                    data: {
                        what: 'token',
                        where: {
                            userId: body.id,
                        },
                        limit: [0, 1]
                    }
                }
            };
            subscriber.next({type: 'meta', content_type: 'application/json'});
            this.protocolService.sendMessage(request).subscribe(async (data) => {
                const isValid = await bcrypt.compare(body.token, data.token);
                if(data && isValid ){
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
                                    'password': md5.default(String(body.password)),
                                },
                                where: {
                                    'id': Number(body.id)
                                }
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(updateAdmin).toPromise();

                    if(res){
                        const remPayload: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'rem',
                            payload: {
                                db: 'main',
                                channel: 'system',
                                data: {
                                    what: 'token',
                                    where: {
                                        userId: body.id,
                                    }
                                }
                            }
                        }

                        const resDel = await this.protocolService.sendMessage(remPayload).toPromise();
                        //create new token for the user
                        const tempSalt = 10;

                        const resetToken = randomBytes(32).toString("hex")
                        const hash = await bcrypt.hash(resetToken, Number(tempSalt))

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
                                        userId: body.id,
                                        token: hash,
                                        createdAt: Date.now()
                                    }
                                }
                            }
                        }

                        const addTokenRes = await this.protocolService.sendMessage(addTokenPayload).toPromise();
                    }

                    subscriber.next({
                        success: "The user password was updated",
                        data: null
                    })
                } else {
                    subscriber.next({
                        error: "The user was not updated",
                        data: null
                    });
                }
                subscriber.complete()
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
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