import {Inject, Injectable} from '@nestjs/common';
import {SessionDataInterface} from "../interfaces/sessiondata.interface";

@Injectable()
export class SessionService {

    private methods = ["check", "register", "unregister", "checkByCookie"];

    constructor(@Inject('ProtocolService') private protocolService) {

    }

    public check(params): boolean {
        if (params.session && params.session.hasOwnProperty('user') && !!params.session.user) {
            return true;
        }
        return false;
    }

    parseCookie(params) {
        return new Promise(async (resolve) => {
            if(!params || !params.cookies || !params.cookies.length){
                return resolve(null);
            }
            const cookies = params.cookies.split(';');
            let cookie_id = "";
            if (cookies.length) {
                cookies.map((cookie_string => {
                    const cookie_parts = cookie_string.split('=');
                    if (cookie_parts.length) {
                        if (cookie_parts[0] === 'connect.sid') {
                            cookie_id = cookie_parts[1];
                            cookie_id = cookie_id.split('.')[0].substring(4);
                        }
                    }
                }));
            }

            const sessionData: SessionDataInterface = await this.protocolService.getValue('sess:' + cookie_id);
            if(!sessionData){
                resolve(null);
                return;
            }
            const expires = new Date(sessionData.cookie.expires);
            if (expires && expires > new Date() && sessionData.user) {
                resolve(sessionData);
            } else {
                resolve(null);
            }
        });
    }


    checkByCookie(params) {
        return new Promise(async (resolve) => {
            const sessionData = await this.parseCookie(params);
            if(sessionData && sessionData.hasOwnProperty('user')){
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    public register(params) {
        return new Promise((resolve, reject) => {
            if (params.session && params.data) {
                params.session.user = params.data;
                resolve(params.data);
            }
            resolve(false);
        });

    }

    public unregister(params) {
        return new Promise((resolve, reject) => {
            if (params.session) {
                delete params.session.user;
                resolve(params.data);
            }
            resolve(false);
        });

    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](Object.assign({}, data.payload));
        } else {
            console.log("Frontend.sessionService." + data.act + " not found");
        }
        return null;
    }

}
