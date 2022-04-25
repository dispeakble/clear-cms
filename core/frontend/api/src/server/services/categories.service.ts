// @ts-ignore
import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
// @ts-ignore
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class CategoriesService {

    private methods = ["list"];

    // @ts-ignore
    constructor(@Inject('ProtocolService') private protocolService) {

    }

    public list (params: any){
        return new Observable((subscriber: any) => {
            (async () => {

                try{
                    const payload: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'list',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_frontend`,
                            data: {
                                what: 'category',
                                fields: ["id", "title", "description", "backgroundImage", "parentId"],
                                where: params?.where
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise()

                    subscriber.next(res);
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })();
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            // @ts-ignore
            return this[data.act](data.payload, config);
        } else {
            // eslint-disable-next-line no-console
            console.log("Frontend.categoriesService." + data.act + " not found");
        }
        return null;
    }

}