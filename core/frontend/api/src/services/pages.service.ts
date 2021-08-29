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
            const payload: payloadInterface = {
                channel: 'db',
                api: 'db',
                act: 'get',
                payload: {
                    channel: 'frontend',
                    data: {
                        what: 'pages',
                        fields: ["id", "title", "pagelink", "is_default", "publish", "cat_id"],
                        how: "AND",
                        ...(params.where && {where: params.where})
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    const pages = data.data.map((page) => {
                        return {
                            id: page.id,
                            pageConfig: {
                                pageTitle: page.title,
                                defaultPage: !!page.is_default,
                                publish: !!page.publish,
                                category: page.cat_id,
                                isTemplate: !!page.istemplate,
                                pageLink: page.pagelink,
                            }

                        }
                    });

                    response = [...pages]
                }
                subscriber.next({type: 'pages_list', data: response});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public get(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pages',
                                // fields: ["*"],//it's optional. defaults to *
                                // how: "OR",
                                where: params.body ? params.body.where : params.where
                            }
                        }
                    };

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
                    const pagesToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pages_to_config',
                                fields: ["*"],//it's optional. defaults to *
                                how: "OR",
                                where: {
                                    page_id: page.id
                                }
                            }
                        }
                    };
                    const pagesToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise()

                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'page_config',
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
                    const pagesToBoxReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pages_to_boxes',
                                fields: ["*"],//it's optional. defaults to *
                                how: "OR",
                                where: {
                                    page_id: page.id
                                }
                            }
                        }
                    };
                    const pageToBoxes = await this.protocolService.sendMessage(pagesToBoxReq).toPromise()
                    let boxes = {data: []}
                    if (pageToBoxes.data?.length) {
                        const boxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'get',
                            payload: {
                                channel: 'frontend',
                                data: {
                                    what: 'page_box',
                                    fields: ["*"],//it's optional. defaults to *
                                    how: "OR",
                                    where: pageToBoxes.data.map(({box_id}) => {
                                        return {
                                            id: box_id,
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

                    const pagesToCategoriesReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pages_to_categories',
                                fields: ["category_id"],
                                where: {
                                    page_id: page.id
                                }
                            }
                        }
                    };

                    const pagesToCategories = await this.protocolService.sendMessage(pagesToCategoriesReq).toPromise();
                    let categoryId = 0;
                    if (pagesToCategories.data?.length) {
                        categoryId = pagesToCategories.data[0].category_id;
                    }

                    const formattedPage = {
                        id: page.id,
                        pageConfig: {
                            backgroundColor: config.bgcolor,
                            backgroundImage: config.bgimage,
                            backgroundRepeat: !!config.bgrepeat,
                            backgroundStretch: !!config.bgstretch,
                            backgroundGradient: !!config.bggradient,
                            defaultPage: !!page.is_default,
                            fontFamily: config.fontfamily,
                            fontSize: config.fontsize,
                            layoutBoxSpacing: [config.boxsizing, config.boxsizing],
                            pageLink: page.pagelink,
                            categoryId: categoryId,
                            isTemplate: !!page.istemplate,
                            pageTitle: page.title,
                            publish: !!page.publish,
                            textColor: config.textcolor,
                            templateUsed: config.templateused,
                        },
                        items: boxes.data.map((box) => {
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