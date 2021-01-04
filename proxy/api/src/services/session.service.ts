import {Injectable} from '@nestjs/common';

@Injectable()
export class SessionService {

    private methods = ["check", "register", "unregister"];

    public check(params): boolean {
        if (params.session && params.session.hasOwnProperty('user') && !!params.session.user) {
            return true;
        }
        return false;
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
            console.log("Proxy.sessionService." + data.act + " not found");
        }
        return null;
    }

}
