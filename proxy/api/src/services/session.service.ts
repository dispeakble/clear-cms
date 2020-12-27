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

    public register(params): boolean {
        if (params.session && params.data) {
            params.session.user = params.data;
            return params.data;
        }
        return false;
    }

    public unregister(params): boolean {
        if (params.session) {
            delete params.session.user;
            return true;
        }
        return false;
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
