import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class DashboardBoxService {

    private methods = ["list", "add", "remove", "edit"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private help = {
        giveBoxValues: (params) => {
            return {
                title: params.title,
                module: params.module,
                fontSize: params.fontSize || null,
                fontFamily: params.fontFamily || null,
                textColor: params.textColor || null,
                borderWidth: params.borderWidth,
                borderColor: params.borderColor,
                borderRadius: params.borderRadius,
                borderStyle: params.borderStyle,
                bgColor: params.bgColor || null,
                x: params.x,
                y: params.y,
                width: params.w,
                height: params.h,
                moduleOptions: params.moduleOptions,
                scrollbars: params.scrollbars ? 1 : 0
            }
        }
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'list',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'dashboardBox',
                        where: params?.where
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('rows')) {
                    if (data.rows.length > 0) {
                       response = data.rows.map((box, index) => {
                           return {
                               ...(box.bgColor !== null && {bgColor: box.bgColor}),
                               borderColor: box.borderColor,
                               borderRadius: box.borderRadius,
                               borderStyle: box.borderStyle,
                               borderWidth: box.borderWidth,
                               h: box.height,
                               w: box.width,
                               id: box.id,
                               module: box.module,
                               moduleOptions: JSON.parse(box.moduleOptions),
                               scrollbars: !!box.scrollbars,
                               title: box.title,
                               x: box.x,
                               y: box.y,
                               ...(box.fontSize !== null && {fontSize: box.fontSize}),
                               ...(box.fontFamily !== null && {fontFamily: box.fontFamily}),
                               ...(box.textColor !== null && {textColor: box.textColor}),
                           }
                       })
                    }
                }
                subscriber.next({type: 'box_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public add (params: any){
        return new Observable(subscriber => {

            (async () => {
                try {
                    const request: payloadInterface = {
                        channel: `${process.env.app}_db`,
                        api: 'sql',
                        act: 'add',
                        payload: {
                            db: 'main',
                            channel: `${process.env.app}_system`,
                            data: {
                                what: 'dashboardBox',
                                data: this.help.giveBoxValues(params)
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(request).toPromise();

                    subscriber.next({
                        success: "The box has added successfully",
                        data: res
                    })
                    subscriber.complete();
                } catch(err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    public edit (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'set',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'dashboardBox',
                        where: {
                            id: params.id
                        },
                        data: this.help.giveBoxValues(params)
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The box was edited",
                    data: data
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public remove (params: any){
        return new Observable(subscriber => {
            const request: payloadInterface = {
                channel: `${process.env.app}_db`,
                api: 'sql',
                act: 'rem',
                payload: {
                    db: 'main',
                    channel: `${process.env.app}_system`,
                    data: {
                        what: 'dashboardBox',
                        where: {
                            id: params.id
                        }
                    }
                }
            };

            this.protocolService.sendMessage(request).subscribe(data => {
                subscriber.next({
                    success: "The box was removed",
                    data: null
                })
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.dashboardBoxService." + data.act + " not found");
        }
        return null;
    }

}