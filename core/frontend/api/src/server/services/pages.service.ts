import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class PagesService {

    private methods = ["list", "get"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try{
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'page',
                                fields: ['*'],
                                how: "AND",
                                ...(params.where && {where: params.where})
                            }
                        }
                    };

                    const res = await this.protocolService.sendMessage(payload).toPromise();

                    let results = null
                    if(res && res.hasOwnProperty('rows')){
                        if(res.rows.length > 0){
                            results = res.rows
                        }
                    }

                    subscriber.next({type: 'pages recieved', data: results});
                    subscriber.complete();
                } catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })();
        })
    }

    public get(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'page',
                                fields: ['*']
                            }
                        }
                    };

                    if(params.body.how) {
                        pageReq.payload.data.how = params.body.how;
                    }

                    if(params.body.where) {
                        pageReq.payload.data.where = params.body.where;
                    }

                    let page = await this.protocolService.sendMessage(pageReq).toPromise()
                    page = page.data[0];
                    if(!page) {
                        subscriber.error({
                            message: "404 not found",
                            statusCode: 404
                        });
                        subscriber.complete();
                        return;
                    }
                    /*
                    const pagesToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pageToConfig',
                                fields: ["*"],//it's optional. defaults to *
                                how: "OR",
                                where: {
                                    pageId: page.id
                                }
                            }
                        }
                    };
                    const pagesToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise()

                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pageConfig',
                                fields: ["*"],//it's optional. defaults to *
                                how: "OR",
                                where: {
                                    id: pagesToConfig.data[0].config_id
                                }
                            }
                        }
                    };
                    let config = await this.protocolService.sendMessage(configReq).toPromise()
                    config = config.data[0]
                    */

                    const _configReq : payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: "frontend",
                            data: {
                                what: 'pageToConfig',
                                fields: ['data'],
                                include:[
                                    {
                                        model: 'pageConfig',
                                    },
                                    {
                                        model: 'page',
                                        where:{
                                            id: page.id
                                        }
                                    }
                                ]
                            }
                        }
                    }

                    const pageConfig = await this.protocolService.sendMessage(_configReq).toPromise()

                    /*
                    const pagesToBoxReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pageToBox',
                                fields: ["*"],//it's optional. defaults to *
                                how: "OR",
                                where: {
                                    pageId: page.id
                                }
                            }
                        }
                    };
                    const pageToBoxes = await this.protocolService.sendMessage(pagesToBoxReq).toPromise()
                    let boxes = {data: []}
                    if (pageToBoxes.data?.length) {
                        const boxReq: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'get',
                            payload: {
                                channel: 'frontend',
                                data: {
                                    what: 'pageBox',
                                    fields: ["*"],//it's optional. defaults to *
                                    how: "OR",
                                    where: pageToBoxes.data.map(({boxId}) => {
                                        return {
                                            id: boxId,
                                        }
                                    })
                                }
                            }
                        };
                        boxes = await this.protocolService.sendMessage(boxReq).toPromise()
                        boxes.data = boxes.data.map((box) => {
                            const location = pageToBoxes.data.find((boxConfig) => boxConfig.box_id === box.id);
                            return {
                                ...box,
                                x: location.x,
                                y: location.y,
                                template_used: location.template_used
                            }
                        })
                    }
                    */

                    //TODO: retrieve page boxes using one request
                    const _boxesReq : payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: "frontend",
                            data: {
                                what: 'pageToBox',
                                include:[
                                    {
                                        model: 'pageBox',
                                    },
                                    {
                                        model: 'page',
                                        where:{
                                            id: page.id
                                        }
                                    }
                                ]
                            }
                        }
                    }

                    const _boxesRes = await this.protocolService.sendMessage(_boxesReq).toPromise()
                    let _boxesResults = null

                    if(_boxesRes.hasOwnProperty('rows')){
                        _boxesResults = _boxesRes.rows
                    }

                    const pagesToCategoriesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'PageToCategory',
                                fields: ["categoryId"],
                                where: {
                                    pageId: page.id
                                }
                            }
                        }
                    };

                    const pagesToCategories = await this.protocolService.sendMessage(pagesToCategoriesReq).toPromise();
                    const categoryId = pagesToCategories ? pagesToCategories.categoryId : 0;

                    const {bgColor,
                        bgImage,
                        bgRepeat,
                        bgStretch,
                        bgGradient,
                        fontFamily,
                        fontSize,
                        layoutBoxSpacing,
                        textColor,
                        templateUsed} = JSON.parse(pageConfig.data)

                    const formattedPage = {
                        id: page.id,
                        pageConfig: {
                            backgroundColor: bgColor,
                            backgroundImage: bgImage,
                            backgroundRepeat: !!bgRepeat,
                            backgroundStretch: !!bgStretch,
                            backgroundGradient: !!bgGradient,
                            defaultPage: !!page.isHome,
                            fontFamily: fontFamily,
                            fontSize: fontSize,
                            layoutBoxSpacing: layoutBoxSpacing,
                            pageLink: page.link,
                            categoryId: categoryId,
                            isTemplate: !!page.isTemplate,
                            pageTitle: page.title,
                            publish: !!page.active,
                            textColor: textColor,
                            templateUsed: templateUsed,
                        },
                        items: _boxesResults.map((box) => {
                            return {
                                ...(box.bgcolor !== null && {backgroundColor: box.bgcolor}),
                                ...(box.bggradientcolor !== null && {backgroundGradientColor: box.bggradientcolor}),
                                backgroundImage: box.bgimage,
                                backgroundRepeat: !!box.bgrepeat,
                                backgroundStretch: !!box.bgstretch,
                                backgroundGradient: !!box.bggradient,
                                borderColor: box.bordercolor,
                                borderRadius: box.borderradius,
                                borderStyle: box.borderstyle,
                                borderWidth: box.borderwidth,
                                h: box.height,
                                w: box.width,
                                i: box.id.toString(),
                                id: box.id,
                                module: box.module,
                                moduleOptions: JSON.parse(box.moduleoptions),
                                displayOptions: JSON.parse(box.displayoptions),
                                showScrollbars: !!box.showscrollbars,
                                title: box.title,
                                x: box.x,
                                y: box.y,
                                ...(box.fontsize !== null && {fontSize: box.fontsize}),
                                ...(box.fontfamily !== null && {fontFamily: box.fontfamily}),
                                ...(box.textcolor !== null && {textColor: box.textcolor}),
                                templateUsed: box.template_used,
                                ...(box.template_used !== 0 && {
                                    resizeHandles: []
                                })
                            }
                        })
                    }


                    subscriber.next({type: 'String', data: formattedPage});
                    subscriber.complete();
                } catch (err) {
                    console.log('err', err)
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
            console.log("Frontend.pagesService." + data.act + " not found");
        }
        return null;
    }

}