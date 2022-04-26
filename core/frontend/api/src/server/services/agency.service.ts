import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";
import {promises as fsPromises} from "fs";
import path from "path";

@Injectable()
export class AgencyService {
    private methods = ["getSettings", "getTranslations"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    getTranslations(params: any) {
        return new Observable((subscriber) => {
            (async () => {
                const json_data = await fsPromises.readFile( path.join(__dirname, '../../src/client/languages/agency', `${params.language}.json`), {
                    encoding: 'utf-8'
                } );
                subscriber.next(json_data);
                subscriber.complete();
            })()
        });
    }

    getSettings() {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: "sql",
                        act: "get",
                        payload: {
                            db: "main",
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: "setting",
                                limit: [0, 1]
                            }
                        }
                    };

                    const result = {};

                    try {
                        const res = await this.protocolService.sendMessage(payload).toPromise();
                        const data = JSON.parse(res.data);

                        result['websiteName'] = data['websiteName'];
                        result['applicationVersion'] = data['applicationVersion'];
                        result['selectedTheme'] = data['selectedTheme'];
                        result['colorScheme'] = data['colorScheme'];

                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(err);
                    }

                    subscriber.next(result);
                    subscriber.complete();
                    return true;
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.agencyService." + data.act + " not found");
        }
        return null;
    }
}