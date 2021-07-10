import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import {Pool} from "pg";
import {Observable} from "rxjs";

@Injectable()
export class DbService {

    private config = {
        host: process.env.pg_host,
        port: process.env.pg_port || 5432,
        database: process.env.pg_db,
        user: process.env.pg_user,
        password: process.env.pg_password,
        max: 2000000,
        connectionTimeoutMillis: 2000
    }

    private pool;
    private methods = ["get", "add", "set", "rem"];
    private help = {
        is: {
            empty: (params) => {
                switch (Object.prototype.toString.call(params)) {
                    default:
                        return undefined;
                        break;
                    case '[object Undefined]':
                        return true;
                        break;
                    case '[object Null]':
                        return true;
                        break;
                    case '[object Boolean]':
                        return !params;
                        break;
                    case '[object Array]':
                        return params.length === 0;
                        break;
                    case '[object Object]':
                        return Object.keys(params).length === 0 && params.constructor === Object;
                        break;
                }

            },
            object: (params) => params instanceof Object,
            array: (params) => params instanceof Array,
            string: (params) => params instanceof String,
            number: (params) => params instanceof Number,
            boolean: (params) => params instanceof Boolean
        },
        not: {
            empty: (params) => !this.help.is.empty(params),
            object: (params) => !this.help.is.object(params),
            array: (params) => !this.help.is.array(params),
            string: (params) => !this.help.is.string(params),
            number: (params) => !this.help.is.number(params),
            boolean: (params) => !this.help.is.boolean(params)
        }

    }
    private crud = {
        get: (params) => {
            let QUERY_STRING,
                FIELDS = params.fields.join(', ') || '*',
                QUERY_PARAMS = [],
                WHERE_STRING,
                WHERE_PIECES = [],
                HOW = params.how || 'AND',
                x = 1;

            QUERY_STRING = 'SELECT ' + FIELDS + ' FROM ' + params.what;

            if (params.where && Object.keys(params.where).length > 0) {
                if (params.how && this.help.is.array(params.where)) {
                    for (let col = 0, t = params.where.length; col < t; col++) {
                        for (let row in params.where[col]) {
                            if (params.where[col].hasOwnProperty(row)) {
                                if (null === params.where[col][row]) {
                                    WHERE_STRING = row + ' IS NULL';
                                } else {
                                    WHERE_STRING = row;
                                    WHERE_STRING += '=';
                                    WHERE_STRING += '$' + x;
                                    QUERY_PARAMS.push(params.where[col][row]);
                                }

                                WHERE_PIECES.push(WHERE_STRING);
                            }
                        }
                        x++;
                    }
                } else {
                    for (let i in params.where) {
                        if (params.where.hasOwnProperty(i)) {
                            if (null === params.where[i]) {
                                WHERE_STRING = i + ' IS NULL';
                            } else {
                                WHERE_STRING = i;
                                WHERE_STRING += '=';
                                WHERE_STRING += '$' + x;
                                QUERY_PARAMS.push(params.where[i]);

                                x++;
                            }

                            WHERE_PIECES.push(WHERE_STRING);
                        }
                    }
                }

                QUERY_STRING += ' WHERE ' + WHERE_PIECES.join(' ' + HOW + ' ');
            }

            if (params.order) {
                let order_params = [];
                if (this.help.is.array(params.order)) {
                    for (let i = 0, t = params.order.length; i < t; i++) {
                        let key = Object.keys(params.order[i])[0];
                        order_params.push('"' + key + '" ' + params.order[i][key]);
                    }

                    QUERY_STRING += ' ORDER BY ' + order_params.join(', ');
                } else if (Object.keys(params.order).length > 0) {
                    for (let i in params.order) {
                        if (params.order.hasOwnProperty(i)) {
                            order_params.push('"' + i + '" ' + params.order[i]);
                        }
                    }

                    QUERY_STRING += ' ORDER BY ' + order_params.join(', ');
                }
            }

            if (params.limit && params.limit.length > 0) {
                QUERY_STRING += ' LIMIT ' + params.limit[1] + ' OFFSET ' + params.limit[0];
            }

            return {string: QUERY_STRING, params: QUERY_PARAMS};

        },
        add: (params) => {

            let QUERY_STRING,
                QUERY_PARAMS = [],
                ADD_PIECES_COLUMNS = [],
                ADD_PIECES_VALUES = [],
                ADD_PIECES_ENTRIES = [],
                x = 1;

            if(this.help.is.array(params.data)){
                //QUERY_STRING = 'INSERT INTO ' + params.what + ' (' + ADD_PIECES_COLUMNS.join(', ') + ') VALUES(' + ADD_PIECES_VALUES.join(', ') + ') RETURNING *';
                QUERY_STRING = 'INSERT INTO ' + params.what + ' (' + ADD_PIECES_COLUMNS.join(', ') + ') ';
                params.data.map((el, i) => {
                    x = 1;
                    for (let y in el) {
                        if (el.hasOwnProperty(y)) {
                            ADD_PIECES_COLUMNS.push(y);
                            ADD_PIECES_VALUES.push('$' + x);
                            QUERY_PARAMS.push(el[y]);
                            x++;
                        }
                    }

                    QUERY_STRING += '(' + ADD_PIECES_VALUES.join(', ') + ') ';
                    ADD_PIECES_ENTRIES.push(QUERY_STRING);
                })
                QUERY_STRING += 'VALUES' + ADD_PIECES_ENTRIES.join(', ');
                QUERY_STRING += ' RETURNING *';
            } else {
                for (let i in params.data) {
                    if (params.data.hasOwnProperty(i)) {
                        ADD_PIECES_COLUMNS.push(i);
                        ADD_PIECES_VALUES.push('$' + x);
                        QUERY_PARAMS.push(params.data[i]);
                        x++;
                    }
                }

                QUERY_STRING = 'INSERT INTO ' + params.what + ' (' + ADD_PIECES_COLUMNS.join(', ') + ') VALUES(' + ADD_PIECES_VALUES.join(', ') + ') RETURNING *';
            }





            return {string: QUERY_STRING, params: QUERY_PARAMS};
        },
        set: (params) => {

            let QUERY_STRING,
                QUERY_PARAMS = [],
                WHERE_STRING = '',
                WHERE_PIECES = [],
                SET_STRING = '',
                SET_PIECES = [],
                HOW = params.how || 'AND',
                x = 1;

            QUERY_STRING = 'UPDATE ' + params.what;

            for (let i in params.data) {
                if (params.data.hasOwnProperty(i)) {
                    QUERY_PARAMS.push(params.data[i]);

                    SET_STRING = i;
                    SET_STRING += '=';
                    SET_STRING += '$' + x;
                    SET_PIECES.push(SET_STRING);

                    if (/^\d+$/.test(params.data[i])) {
                        params.data[i] = parseInt(params.data[i]);
                    }
                    x++;
                }
            }

            QUERY_STRING += ' SET ' + SET_PIECES.join(', ');

            if (params.where && Object.keys(params.where).length > 0) {
                if (params.how && this.help.is.array(params.where)) {
                    for (let col = 0, t = params.where.length; col < t; col++) {
                        for (let row in params.where[col]) {
                            if (params.where[col].hasOwnProperty(row)) {
                                if (null === params.where[col][row]) {
                                    WHERE_STRING = row + ' IS NULL';
                                } else {
                                    WHERE_STRING = row;
                                    WHERE_STRING += '=';
                                    WHERE_STRING += '$' + x;
                                    QUERY_PARAMS.push(params.where[col][row]);
                                }

                                WHERE_PIECES.push(WHERE_STRING);
                            }
                        }
                        x++;
                    }
                } else {
                    for (let i in params.where) {
                        if (params.where.hasOwnProperty(i)) {
                            if (null === params.where[i]) {
                                WHERE_STRING = i + ' IS NULL';
                            } else {
                                WHERE_STRING = i;
                                WHERE_STRING += '=';
                                WHERE_STRING += '$' + x;
                                QUERY_PARAMS.push(params.where[i]);

                                x++;
                            }

                            WHERE_PIECES.push(WHERE_STRING);
                        }
                    }
                }

                QUERY_STRING += ' WHERE ' + WHERE_PIECES.join(' ' + HOW + ' ');
            }

            if (params.order) {
                if (this.help.is.array(params.order)) {
                    let order_params = [];

                    for (let i = 0, t = params.order.length; i < t; i++) {
                        let key = Object.keys(params.order[i])[0];
                        order_params.push(key + ' ' + params.order[i][key]);
                    }

                    QUERY_STRING += ' ORDER BY ' + order_params.join(', ');
                } else if (Object.keys(params.order).length > 0) {
                    let order_params = [];

                    for (let i in params.order) {
                        if (params.order.hasOwnProperty(i)) {
                            order_params.push(i + ' ' + params.order[i]);
                        }
                    }

                    QUERY_STRING += ' ORDER BY ' + order_params.join(', ');
                }
            }

            return {string: QUERY_STRING, params: QUERY_PARAMS};
        },
        rem: (params) => {

            let QUERY_STRING,
                QUERY_PARAMS = [],
                REM_STRING = '',
                REM_PIECES = [],
                x = 0;

            for (let i in params.where) {
                if (params.where.hasOwnProperty(i)) {

                    if(this.help.is.array(params.where)){
                        /*params.where.map(where_param => {
                            QUERY_PARAMS.push(where_param);
                        })*/
                    } else {
                        QUERY_PARAMS.push(params.where[i]);

                        x++;

                        REM_STRING = i;
                        REM_STRING += '=';
                        REM_STRING += '$' + x + '';
                        REM_PIECES.push(REM_STRING);

                        if (/^\d+$/.test(params.where[i])) {
                            params.where[i] = Number(params.where[i]);
                        }
                    }




                }
            }

            QUERY_STRING = 'DELETE FROM ' + params.what + ' WHERE ' + REM_PIECES.join(` ${params.how || 'AND'} `);

            QUERY_STRING += ' RETURNING * ';

            return {string: QUERY_STRING, params: QUERY_PARAMS};
        },
        query: (params) => {
            return {string: params.where, params: params.params};
        }
    }

    constructor(@Inject('PgPool') private pgPool: Pool) {
        this.pool = new this.pgPool(this.config);
        this.add({
            what: 'categories',

        })
    }

    async get(params) {

        const payload = {
            action: 'get',
            data: params.data
        }

        const res = await this.query(payload);

        return res;
    }

    async add(params) {

        const payload = {
            action: 'add',
            data: params.data
        }

        const res = await this.query(payload);

        return res;
    }

    async set(params) {

        const payload = {
            action: 'set',
            data: params.data
        }

        const res = await this.query(payload);

        return res;
    }

    async rem(params) {

        const payload = {
            action: 'rem',
            data: params.data
        }

        const res = await this.query(payload);

        return res;
    }

    query(params) {
        return new Observable((subscriber) => {
            try {
                const query = this.crud[params.action](params.data);//returns query string and params

                this.pool.query(query.string, query.params, (err, result) => {

                    if (err) {
                        console.error("error running query", err, query, params);
                        subscriber.error({
                            data: null,
                            what: params.data.what
                        });
                        subscriber.complete();
                        return;
                    }

                    if ("undefined" === typeof result) {
                        console.error("result undefined: ", err, query);
                        subscriber.next({
                            data: null,
                            what: params.data.what
                        });
                        subscriber.complete();
                        return;
                    }

                    subscriber.next({
                        data: result.rows,
                        what: params.data.what
                    });
                    subscriber.complete();

                });
            } catch (err) {
                console.log(err);
                subscriber.error(err);
                subscriber.complete();
            }
        });
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
