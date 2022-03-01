import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";

@Injectable()
export class SequelizeService {
    private methods = ["list", "get", "add", "addBulk", "set", "rem"];

    constructor(
        @Inject('MainService') private mainService,
        @Inject('AgencyService') private agencyService,
        ) {

    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            const db = data.payload.db || 'main';
            return this[`${db}Service`].perform(data, config);
        } else {
            console.log("DB.sequelizeService." + data.act + " not found");
        }
        return null;
    }

}
