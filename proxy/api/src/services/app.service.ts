import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {

    private methods = [""];

    constructor() {
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act].call(Object.assign({}, data.payload));
        } else {
            console.log("Proxy.appService." + data.act + " not found");
        }
        return null;
    }

}
