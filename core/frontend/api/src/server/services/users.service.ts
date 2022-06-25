import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";

@Injectable()
export class UsersService {

    private methods = ["getOne"];

    constructor(
        @Inject('ProtocolService') private protocolService
        ) {
    }


    private getOne(email: string) {
        return new Observable(subscriber => {
            (async () => {
                const userResults = await this.protocolService.sendMessage({
                    channel: `${process.env.app}_db`,
                    api: "sql",
                    act: "get",
                    payload: {
                        db: "agency",
                        data: {
                            what: "client",
                            as: "Client",
                            where: {
                                active: 1,
                                email: email,
                            }
                        }
                    }
                }).toPromise();

                subscriber.next(userResults)
                subscriber.complete()
            })()
         })
    }




    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.userService." + data.act + " not found");
        }
        return null;
    }

}