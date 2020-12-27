import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {SessionDataInterface} from "../interfaces/sessiondata.interface";


@Injectable()
export class WsAuthGuard implements CanActivate {

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return new Promise(async (resolve) => {
            try {
                const wsClient = context.switchToWs().getClient();

                const cookies = wsClient.handshake.headers.cookie.split(';');
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
                const expires = new Date(sessionData.cookie.expires);
                if (expires && expires > new Date() && sessionData.user) {
                    return resolve(true);
                }
            } catch (err) {
                console.log(err);
            }

            return resolve(false);
        });
    }

    canServe(params) {
        return true;
    }

    checkWs(params) {
        if (params && params.session && params.session.user && params.session.user.email && params.session.user.fullname) {
            return true;
        }
        return false;
    }

    checkHttp(params) {
        return true;
    }
}