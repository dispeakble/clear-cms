import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {GotService} from "@t00nday/nestjs-got";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";



@Injectable()
export class AgencyService {
    private methods = ["get"];
    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public get(params) {
        return new Observable((subscriber) => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            db: 'agency',
                            channel: 'frontend',
                            data: {
                                what: 'hotel',
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();
                    subscriber.next({type: 'Theme received', data: res});
                    subscriber.complete();
                    return res;
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })

    }

    public async getHotels() {
        try {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'list',
                payload: {
                    db: 'agency',
                    channel: 'frontend',
                    data: {
                        what: 'hotel',
                    }
                }
            };

            const res = await this.protocolService.sendMessage(payload).toPromise();

            return res;
        } catch(err){
            return err
        }
    }


    /*async get(): Promise<any> {



        //TODO get from DB




        /!*const data = [
            [
                {
                    title: "Tours",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Hikking",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Travel",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Support",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
            ],
            [
                {
                    title: "Support",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Tours",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Travel",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Hikking",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
            ],
            [
                {
                    title: "Hikking",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Tours",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Support",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    title: "Travel",
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
            ],
        ]*!/
        return data;
    }*/

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Frontend.agencyService." + data.act + " not found");
        }
        return null;
    }
}