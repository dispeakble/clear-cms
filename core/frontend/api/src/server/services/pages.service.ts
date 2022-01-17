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
                                where: params.body.where,
                                include: [
                                    {
                                        model: 'pageBox',
                                        through: 'pageToBox',
                                        required: false
                                    },
                                    {
                                        model: 'category',
                                        through: 'pageToCategory',
                                        required: false
                                    },
                                    {
                                        model: 'pageConfig',
                                        through: 'pageToConfig',
                                        required: false
                                    }
                                ]
                            }
                        }
                    };

                    const page = await this.protocolService.sendMessage(pageReq).toPromise()
                    //page = page.data[0];
                    if(!page) {
                        subscriber.error({
                            message: "404 not found",
                            statusCode: 404
                        });
                        subscriber.complete();
                        return;
                    }


                    const {seoTitle,
                        useWebsiteTitle,
                        backgroundColor,
                        hasBackgroundGradient,
                        hasBackgroundColor,
                        hasBackgroundImage,
                        hasBackgroundRepeat,
                        hasBackgroundStretch,
                        backgroundGradient,
                        description,
                        fontFamily,
                        fontSize,
                        layoutBoxSpacing,
                        textColor,
                        templateUsed} = JSON.parse(page.pageConfig[0]?.data)

                    const formattedPage = {
                        id: page.id,
                        pageConfig: {
                            description:description,
                            seoTitle: seoTitle,
                            useWebsiteTitle: useWebsiteTitle,
                            hasBackgroundColor: hasBackgroundColor,
                            backgroundGradient: backgroundGradient,
                            backgroundColor: backgroundColor,
                            hasBackgroundImage: hasBackgroundImage,
                            hasBackgroundRepeat: !!hasBackgroundRepeat,
                            hasBackgroundStretch: !!hasBackgroundStretch,
                            hasBackgroundGradient: !!hasBackgroundGradient,
                            defaultPage: !!page.isHome,
                            fontFamily: fontFamily,
                            fontSize: fontSize,
                            layoutBoxSpacing: layoutBoxSpacing,
                            pageLink: page.link,
                            categoryId: page.category ? page.category[0].id : 0,
                            isTemplate: !!page.isTemplate,
                            pageTitle: page.title,
                            publish: !!page.active,
                            textColor: textColor,
                            templateUsed: templateUsed,
                        },
                        items: page.boxes.map((box) => {
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