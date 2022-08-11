import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as md5 from "md5";
import {Observable} from "rxjs";
import {randomBytes} from "crypto";
import {sendEmail} from "../utils/sendEmail";
import axios from "axios"

@Injectable()
export class ResetEmailService {

    private methods = ["generateRecoverEmail", "doChangePassword", "loadConfig", "ping"];
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

    public generateRecoverEmail(params: any) {
        return new Observable(observer => {
            (async () => {
                try {
                    const request = params.body.payload;
                    if (!request.hasOwnProperty('email')) {
                        observer.complete();
                        return;
                    }
                    const adminRequest: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_system`,
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
                    };

                    const adminResponse = await this.protocolService.sendMessage(adminRequest).toPromise();

                    if (!adminResponse.hasOwnProperty('email')) {
                        observer.complete();
                        return;
                    }

                    //remove previous tokens if any
                    const removeTokenPayload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'token',
                                where: {
                                    userId: adminResponse.id,
                                }
                            }
                        }
                    };

                    const removeTokenResponse = await this.protocolService.sendMessage(removeTokenPayload).toPromise();

                    const resetToken = randomBytes(32).toString("hex");

                    const addTokenPayload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'add',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'token',
                                data: {
                                    userId: adminResponse.id,
                                    token: resetToken
                                }
                            }
                        }
                    };

                    const addTokenResponse = await this.protocolService.sendMessage(addTokenPayload).toPromise();

                    const settingsRequest: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'setting',
                                data: {
                                    isDefault: 1,
                                }
                            }
                        }
                    };

                    const settingsResponse = await this.protocolService.sendMessage(settingsRequest).toPromise();
                    const settings = JSON.parse(settingsResponse.data);

                    const link = `https://${settings.websiteDomain}/password-reset?token=${resetToken}`;

                    await sendEmail(
                        settings.emailSender,
                        settings.emailPassword,
                        adminResponse.email,
                        `Password reset link for ${adminResponse.fullname}`,
                        {
                            name: adminResponse.fname,
                            link: link
                        }
                    );

                    observer.next({
                        type: 'String',
                        data: {success: "email sent."},
                        mime: 'application/json',
                    });

                    observer.complete();
                } catch (err) {
                    observer.error(err);
                    observer.complete();
                }
            })();
        });
    }

    public async doChangePassword(params: any) {
        try {
            const body = params.body.payload;
            const tokenPayload: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
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

            if (tokenResponse) {
                const updateAdmin: payloadInterface = {
                    channel: `${process.env.app}_db`,
                    api: 'sql',
                    act: 'set',
                    payload: {
                        db: 'main',
                        channel: `${process.env.app}_system`,
                        data: {
                            what: 'auth',
                            data: {
                                password: md5.default(String(body.password)),
                            },
                            where: {
                                id: Number(tokenResponse.userId)
                            }
                        }
                    }
                };

                const changePasswordResponse = await this.protocolService.sendMessage(updateAdmin).toPromise();

                if (changePasswordResponse) {
                    const remTokenPayload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'token',
                                where: {
                                    token: body.token,
                                }
                            }
                        }
                    }

                    const remTokenResponse = await this.protocolService.sendMessage(remTokenPayload).toPromise();
                } else {
                    return {
                        data: {error: "Internal server error"}
                    }
                }
            };

            const getAdminPayload: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'auth',
                        where: {
                            id: tokenResponse.userId,
                        }
                    }
                }
            }

            const resAdmin = await this.protocolService.sendMessage(getAdminPayload).toPromise();

            return await axios({
                url: '/api/auth/login',
                method: "POST",
                data:{
                    email: resAdmin.email,
                    password: md5.default(body.password)
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })

        } catch(err) {
            console.error(err)
        }
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.resetEmailService." + data.act + " not found");
        }
        return null;
    }

}