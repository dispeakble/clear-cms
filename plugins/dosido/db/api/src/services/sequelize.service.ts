import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";

@Injectable()
export class SequelizeService {
    private methods = ["list", "get", "add", "set", "rem"];

    constructor(@Inject('SqlService') private sqlService) {

    }

    list(params: any) {
        return this.sqlService.list(params);
    }

    get(params: any) {
        return this.sqlService.get(params);
    }

    add(params: any) {
        return this.sqlService.add(params);
    }

    set(params: any) {
        return this.sqlService.set(params);
    }

    rem(params: any) {
        return this.sqlService.rem(params);
    }


    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("DB.appService." + data.act + " not found");
        }
        return null;
    }

}
