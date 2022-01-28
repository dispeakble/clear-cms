import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";

@Injectable()
export class TestService {

    private methods = ["waitForDb", "isReady"];

    private ready = false;

    constructor(@Inject('SequelizeService') private sequelizeService) {

    }

    async onApplicationBootstrap() {
        const checkIntervalId = setInterval(async () => {

            const dbTest = await this.testDb();

            if(dbTest) {
                clearInterval(checkIntervalId);
                clearTimeout(checkTimeoutId);
                this.ready = true;
            }
        }, 300);

        const checkTimeoutId = setTimeout(() => {
            clearInterval(checkIntervalId);
            process.exit(1);
        }, 30 * 1000);
    }

    private isReady() {
        return this.ready;
    }

    private async testDb() {
        return new Promise(resolve => {
            this.sequelizeService.get({
                data: {
                    what: 'auth',
                    limit: [0, 1],
                },
            }).subscribe(data => {
                resolve(data);
            }, err => {
                resolve(false);
            }, () => {
                resolve(false)
            });
        });

    }

    public waitForDb() {
        return new Promise(resolve => {
            const checkIntervalId = setInterval(() => {
                console.log('Waiting for Postgres')
                if(this.ready) {
                    clearInterval(checkIntervalId);
                    clearTimeout(checkTimeoutId);
                    resolve(true);
                }
            }, 300);

            const checkTimeoutId = setTimeout(() => {
                clearInterval(checkIntervalId);
                resolve(false);
            }, 30 * 1000);

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
