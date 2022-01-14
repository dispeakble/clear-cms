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
                api: 'sql',
                act: 'list',
                payload: {
                    channel: 'frontend',
                    data: {
                        what: 'page',
                        where:{
                            active: 1
                        }
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'pages list', data: data});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public search(params: any){
        return new Observable(subscriber => {
            (async () => {
                try{
                    //TODO: retrieve list of pages accordingly to search params
                    //if search only by title
                    const pagesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'page',
                                fields: ['title, link'],
                                where:{
                                    title: {'LIKE': `%${params.searchQuery}%`}
                                }
                            }
                        }
                    };

                    const pages = await this.protocolService.sendMessage(pagesReq).toPromise()

                    //if search by category
                    const pagesToCategoriesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pageToCategory',
                                include:[{
                                    module:'category',
                                    required: true,
                                    where: {
                                        'OR': [
                                            {description: {'LIKE': `%${params.searchQuery}%`}},
                                            {title: {'LIKE': `%${params.searchQuery}%`}}
                                        ]
                                    }
                                },{
                                    module:'page',
                                    required: true
                                }],
                            }
                        }
                    };
                    const pages_categories = await this.protocolService.sendMessage(pagesToCategoriesReq).toPromise()

                    let pageToCategories:any = null
                    if(pages_categories.hasOwnProperty('rows')){
                        pageToCategories = pages_categories.rows
                    }

                    //TODO: retrieve list of pages and boxes(search in content) accordingly to search params

                    const pagesToBoxesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pageToBox',
                                include:[{
                                    module:'pageBox',
                                    required: true,
                                    where: {
                                        //TODO: check content to match search query
                                    }
                                },{
                                    module:'page',
                                    required: true
                                }],
                            }
                        }
                    };
                    const pages_boxes = await this.protocolService.sendMessage(pagesToBoxesReq).toPromise()

                    let pageToBoxes:any = null
                    if(pages_boxes.hasOwnProperty('rows')){
                        pageToBoxes = pages_boxes.rows
                    }

                    let data:any = null

                    switch(params.searchMethod){
                        case 'searchByPageTitle' : data = pages;break;
                        case 'searchByPageCategory' : data = pageToCategories;break;
                        case 'searchByBoxContent' : data = pageToBoxes ;break;
                        default: data = pages;break;
                    }


                    subscriber.next({type: 'String', data: data});
                    subscriber.complete();

                }catch(err){
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
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

                    const page = await this.protocolService.sendMessage(pageReq).toPromise()

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
                                        required: true,
                                    },
                                    {
                                        model: 'page',
                                        required: true
                                    }
                                ],
                                where: {
                                    pageId: page.id
                                }
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
                                        required: true
                                    },
                                    {
                                        model: 'page',
                                        required: true
                                    }
                                ],
                                where: {
                                    pageId: page.id
                                }
                            }
                        }
                    }

                    const _boxesRes = await this.protocolService.sendMessage(_boxesReq).toPromise()
                    let _boxesResults = null

                    if(_boxesRes.hasOwnProperty('rows')){
                        _boxesResults = _boxesRes.rows.map((box) => {
                            const {
                                fontSize,
                                fontFamily,
                                textColor,
                                bgColor,
                                bgGradientColor,
                                bgImage,
                                borderWidth,
                                borderColor,
                                borderRadius,
                                bgRepeat,
                                bgStretch,
                                bgGradient,
                                height,
                                width,
                                displayOptions,
                                borderStyle,
                                showScrollbars } = JSON.parse(box.data)

                            return{
                                id: box.boxId,
                                title: box.title,
                                module: box.module,
                                moduleOptions: box.moduleOptions,
                                x: box.x,
                                y: box.y,
                                templateUsed: box.templateUsed,
                                fontSize: fontSize,
                                fontFamily: fontFamily,
                                textColor: textColor,
                                bgColor: bgColor,
                                bgGradientColor: bgGradientColor,
                                bgImage: bgImage,
                                borderWidth: borderWidth,
                                borderColor: borderColor,
                                borderRadius: borderRadius,
                                bgRepeat: bgRepeat,
                                bgStretch: bgStretch,
                                bgGradient: bgGradient,
                                height: height,
                                width: width,
                                displayOptions: displayOptions,
                                borderStyle: borderStyle,
                                showScrollbars: showScrollbars,
                            }
                        })
                    }



                    const pagesToCategoriesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'frontend',
                            data: {
                                what: 'pageToCategory',
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
                        items: _boxesResults?.map((box) => {
                            return {
                                ...(box.bgColor !== null && {backgroundColor: box.bgColor}),
                                ...(box.bgGradientColor !== null && {backgroundGradientColor: box.bgGradientColor}),
                                backgroundImage: box.bgImage,
                                backgroundRepeat: !!box.bgRepeat,
                                backgroundStretch: !!box.bgStretch,
                                backgroundGradient: !!box.bgGradient,
                                borderColor: box.borderColor,
                                borderRadius: box.borderRadius,
                                borderStyle: box.borderStyle,
                                borderWidth: box.borderWidth,
                                h: box.height,
                                w: box.width,
                                i: box.id.toString(),
                                id: box.id,
                                module: box.module,
                                moduleOptions: JSON.parse(box.moduleOptions),
                                displayOptions: JSON.parse(box.displayOptions),
                                showScrollbars: !!box.showScrollbars,
                                title: box.title,
                                x: box.x,
                                y: box.y,
                                ...(box.fontSize !== null && {fontSize: box.fontSize}),
                                ...(box.fontFamily !== null && {fontFamily: box.fontFamily}),
                                ...(box.textColor !== null && {textColor: box.textColor}),
                                templateUsed: box.templateUsed,
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