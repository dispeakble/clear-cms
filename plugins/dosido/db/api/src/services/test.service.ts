import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";

@Injectable()
export class TestService {

    private methods = ["checkTables"];

    private pool;

    private config = {
        host: process.env.pg_host,
        port: process.env.pg_port || 5432,
        database: 'postgres',
        user: process.env.pg_user,
        password: process.env.pg_password,
        max: 2000000,
        connectionTimeoutMillis: 2000,
    };

    constructor(
      @Inject('PgPool') private pgPool,
    ) {

    }

    start() {
        return new Promise((resolve) => {
            ;(async () => {
                let tableList = null;
                this.pool = new this.pgPool(this.config);
                try {
                    tableList = await this.pool.query('SELECT table_name FROM information_schema.tables');
                } catch (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                resolve(tableList.rows && tableList.rows.length > 0);
                return;

            })();
        });

    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("DB.testService." + data.act + " not found");
        }
        return null;
    }

}
