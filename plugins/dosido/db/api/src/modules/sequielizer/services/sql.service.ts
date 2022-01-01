import {Injectable} from '@nestjs/common';
import {User} from "../models/user.model";
import {Op} from "sequelize";
import {Observable, Subscriber} from "rxjs";
import {InjectModel} from "@nestjs/sequelize";
import moment from "moment";

@Injectable()
export class SqlService {
    private methods = ["list", "get", "add", "set", "rem"];

    constructor(
        @InjectModel(User) private userModel: typeof User
    ) { }

    /*convertDateToUnix(data) {
        const keys = Object.keys(data);
        keys.map(key => {

            if(data[key] instanceof Date) {
                data[key] = moment(data[key]).unix();
            }
        });

        return data;
    }*/

    private convertWhereOp(params: any) {
        const result = {};

        if("object" !== typeof params) {
            return params;
        }

        Object.keys(params).map(key => {

            if(params[key] instanceof Array) {
                params[key] = params[key].map(val => this.convertWhereOp(val));
            } else if("object" === typeof params[key]) {
                params[key] = this.convertWhereOp(params[key]);
            }

            if(Op.hasOwnProperty(key.toLowerCase())) {
                result[Op[key.toLowerCase()]] = params[key];
            } else {
                result[key] = params[key];
            }

        })

        return result;
    }

    list(params: any) {
        return new Observable(subscriber => {
            (async () => {
                const model = this[`${params.data.what}Model`];

                if(!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if (params.fields) {
                    payload.attributes = params.fields;
                }

                if(params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                if(params.data.order) {
                    const orderArray = [];

                    Object.keys(params.data.order).map(key => {
                        orderArray.push([key, params.data.order[key]]);
                    });

                    payload.order = orderArray;
                }

                if (params.data.limit) {
                    payload.limit = params.data.limit[1];
                    payload.offset = params.data.limit[0];
                }

                try {
                    const result = await model.findAndCountAll(payload);
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }

            })()
        });

    }

    add(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const model = this[`${params.data.what}Model`];

                    if(!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const result = await model.create(params.data.data);

                    subscriber.next(result.dataValues);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }
            })();
        });
    }

    set(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const model = this[`${params.data.what}Model`];

                    if(!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const where = this.convertWhereOp(params.data.where);

                    const result = await model.update(params.data.fields, {where: where});

                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }
            })();
        });
    }

    rem(params: any) {
        return new Observable(subscriber => {
            (async () => {
                const model = this[`${params.data.what}Model`];

                if(!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if(params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                try {
                    const result = await model.destroy(payload);
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }

            })()
        });
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload);
        } else {
            console.log("DB.sqlService." + data.act + " not found");
        }
        return null;
    }

}
