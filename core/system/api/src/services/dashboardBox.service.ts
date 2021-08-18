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
                fontsize: params.fontSize || null,
                fontfamily: params.fontFamily || null,
                textcolor: params.textColor || null,
                borderwidth: params.borderWidth,
                bordercolor: params.borderColor,
                borderradius: params.borderRadius,
                bgcolor: params.backgroundColor || null,
                x: params.x,
                y: params.y,
                width: params.w,
                height: params.h,
                moduleoptions: params.moduleOptions,
                showscrollbars: params.showScrollbars ? 1 : 0
            }
        }
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'dashboard_box',
                        fields: ["id", "title", "module", "fontsize", "textcolor", "borderwidth", "bordercolor", "borderradius", "bgcolor", "x", "y", "width", "height", "moduleoptions", "showscrollbars"],
                        where: params?.where
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    if (data.data.length > 0) {
                       response = data.data.map((box, index) => {
                           return {
                               ...(box.bgcolor !== null && {backgroundColor: box.bgcolor}),
                               borderColor: box.bordercolor,
                               borderRadius: box.borderradius,
                               borderStyle: box.borderstyle,
                               borderWidth: box.borderwidth,
                               h: box.height,
                               w: box.width,
                               id: box.id,
                               module: box.module,
                               moduleOptions: JSON.parse(box.moduleoptions),
                               showScrollbars: !!box.showscrollbars,
                               title: box.title,
                               x: box.x,
                               y: box.y,
                               ...(box.fontsize !== null && {fontSize: box.fontsize}),
                               ...(box.fontfamily !== null && {fontFamily: box.fontfamily}),
                               ...(box.textcolor !== null && {textColor: box.textcolor}),
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
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'dashboard_box',
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
                channel: 'db',
                api: 'db',
                act: 'set',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'dashboard_box',
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
                channel: 'db',
                api: 'db',
                act: 'rem',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'dashboard_box',
                        how: 'OR',
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