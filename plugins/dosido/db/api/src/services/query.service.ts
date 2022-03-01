import {Injectable} from '@nestjs/common';
import {Op} from "sequelize";
import {Observable} from "rxjs";

@Injectable()
export class QueryService {
    private methods = ["list", "get", "add", "addBulk", "set", "rem"];

    constructor() {
    }

    private convertInclude(params: any) {

        const includes = params.data.map((incl) => {

            const result = {...incl};

            const model = params.getModel(incl.model);

            if (!model) {
                return null;
            }

            result.model = model;

            if (result['through']) {
                result.through = params.getModel(incl.through);
            }

            if (result.where) {
                result.where = this.convertWhereOp(result.where);
            }

            return result;
        });

        return includes;

    }

    private convertWhereOp(params: any) {
        //ex: {where: {name:{'LIKE':'%abc%'}}}
        //ex: {where: {name:{'OR':[{name: {'LIKE': '%abc%'}}, {active: 1}]}}}
        //ex: {where: {id:[1,2,3,4]} //will be 1 OR 2 OR ...
        const result = {};

        if ("object" !== typeof params || Array.isArray(params)) {
            return params;
        }

        Object.keys(params).map(key => {

            if (params[key] instanceof Array) {
                params[key] = params[key].map(val => this.convertWhereOp(val));
            } else if ("object" === typeof params[key]) {
                params[key] = this.convertWhereOp(params[key]);
            }

            if (Op.hasOwnProperty(key)) {
                result[Op[key]] = params[key];
            } else {
                result[key] = params[key];
            }

        })

        return result;
    }

    list(params: any) {
        return new Observable(subscriber => {
            (async () => {

                if (undefined === params.data.count) {
                    params.data.count = true;
                }

                const model = params.getModel(params.data.what);

                if (!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if (params.data.fields) {
                    payload.attributes = params.data.fields;
                }

                if (params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                if (params.data.order) {
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

                if (params.data.include) {
                    payload.include = this.convertInclude({
                        getModel: params.getModel,
                        model: params.data.what,
                        data: params.data.include
                    });
                }

                try {
                    let result = null;
                    if (params.data.count) {
                        result = await model.findAndCountAll(payload);
                    } else {
                        result = await model.findAll(payload);
                    }

                    //will receive {count: Number, rows: []}
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    console.log(payload);
                    subscriber.error(err.message);
                    subscriber.complete();
                }

            })()
        });

    }

    get(params: any) {
        return new Observable(subscriber => {
            (async () => {

                const model = params.getModel(params.data.what);

                if (!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if (params.data.fields) {
                    payload.attributes = params.data.fields;
                }

                if (params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                if (params.data.order) {
                    const orderArray = [];

                    Object.keys(params.data.order).map(key => {
                        orderArray.push([key, params.data.order[key]]);
                    });

                    payload.order = orderArray;
                }

                if (params.data.include) {
                    payload.include = this.convertInclude({
                        getModel: params.getModel,
                        model: params.data.what,
                        data: params.data.include
                    });
                }

                try {
                    const result = await model.findOne(payload);
                    //will receive the requested fields
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    console.log(payload);
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

                    const model = params.getModel(params.data.what);

                    if (!model) {
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

    addBulk(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {

                    const model = params.getModel(params.data.what);

                    if (!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const result = await model.bulkCreate(params.data.records, {
                        returning: params.data.returning || false,
                        validate: params.data.validate || false,
                        fields: params.data.fields,
                        ignoreDuplicates: params.data.ignoreDuplicates || false
                    });

                    subscriber.next(params.data.returning ? result.map(res => {
                        return res.dataValues
                    }) : true);
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

                    const model = params.getModel(params.data.what);

                    if (!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const where = this.convertWhereOp(params.data.where);

                    const result = await model.update(params.data.data, {where: where});

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

                const model = params.getModel(params.data.what);

                if (!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if (params.data.where) {
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
