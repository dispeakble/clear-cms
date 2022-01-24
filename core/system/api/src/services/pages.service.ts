import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";
import {omit} from "lodash";

@Injectable()
export class PagesService {

    private methods = ["list", "add", "rem", "edit", "get", "duplicate"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {

            const whereObj = {
                'and': {
                    isTemplate: params.isTemplate ? 1 : 0
                }
            };

            if (params.search && params.search.length > 2) {
                whereObj['and']['or'] = [];
                ["title", "link"].map(field => {
                    whereObj['and']['or'].push({[field]: {'LIKE': `%${params.search}%`}});
                });
            }

            const payload: payloadInterface = {
                channel: 'db',
                api: 'sql',
                act: 'list',
                payload: {
                    channel: 'system',
                    data: {
                        what: 'page',
                        where: {},
                        order: params?.order,
                        limit: params?.limit,
                    }
                }
            };

            payload.payload.data.where = whereObj;

            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next({type: 'pages_list', data: data});
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    private get(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                where: {
                                    id: params.id
                                },
                                include: [{
                                    model: 'pageBox',
                                    through: 'pageToBox',
                                    required: false
                                },{
                                    model: 'category',
                                    through: 'pageToCategory',
                                    required: false
                                },{
                                    model: 'pageConfig',
                                    through: 'pageToConfig',
                                    required: false
                                }]
                            }
                        }
                    };

                    const page = await this.protocolService.sendMessage(pageReq).toPromise()

                    const formattedPage = {
                            ...page,
                            pageConfig: {...JSON.parse(page.pageConfig[0].data),
                        },
                        categories: page.categories ? page.categories.map(cat => cat.id) : []
                    }

                    /*if(boxes.data && boxes.data.length) {
                        formattedPage.boxes = boxes.data.map((box) => {
                            return {
                                ...box,
                                moduleOptions: JSON.parse(box.moduleoptions),
                                displayOptions: JSON.parse(box.displayoptions),
                            }
                        })
                    }*/
                    subscriber.next({type: 'page', data: formattedPage});
                    subscriber.complete();
                } catch (err) {
                    console.log('err', err)
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()
        })
    }

    private add(params: any) {
        return new Observable(subscriber => {

            (async () => {
                try {
                    const {boxes, pageProps, pageConfig} = params;
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                data: {
                                    title: pageProps.title,
                                    isHome: pageProps.isHome ? 1 : 0,
                                    active: pageProps.active ? 1 : 0,
                                    link: String(pageProps.link),
                                    isTemplate: pageProps.isTemplate ? 1 : 0,
                                    templateId: pageProps.templateId
                                }
                            }
                        }
                    };
                    const page = await this.protocolService.sendMessage(pageReq).toPromise();

                    if(Array.isArray(pageConfig.categories) && pageConfig.categories.length) {
                        const pageToCategoryReq = {
                            channel: 'db',
                            api: 'sql',
                            act: 'addBulk',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToCategory',
                                    records: pageConfig.categories.map(catId => {
                                        return {
                                            pageId: page.id,
                                            categoryId: catId
                                        }
                                    }),
                                    fields: ['pageId', 'categoryId']
                                }
                            }
                        };

                        await this.protocolService.sendMessage(pageToCategoryReq).toPromise();
                    }

                    delete pageConfig.categories;

                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageConfig',
                                data: {
                                    data: JSON.stringify(pageConfig)
                                }
                            }
                        }
                    };
                    const config = await this.protocolService.sendMessage(configReq).toPromise();

                    const pageToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToConfig',
                                data: {
                                    pageId: page.id,
                                    configId: config.id,
                                }
                            }
                        }
                    };

                    this.protocolService.sendMessage(pageToConfigReq).toPromise();

                    let boxesIds = []
                    const boxPositions = []
                    if (boxes.length) {
                        const newBoxes = boxes.filter(box => !box.data.templateUsed);
                        if (newBoxes.length) {
                            const pageBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'addBulk',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageBox',
                                        records: newBoxes.map((box) => {
                                            boxPositions.push({x: box.data.x, y: box.data.y});
                                            return {
                                                title: box.title,
                                                module: box.module,
                                                data: JSON.stringify(omit(box.data, ['i', 'x', 'y'])),
                                                moduleOptions: JSON.stringify(box.moduleOptions),
                                            }
                                        }),
                                        fields: ['title', 'module', 'data', 'moduleOptions'],
                                        validate: true,
                                        returning: true
                                    }
                                }
                            };

                            const boxes = await this.protocolService.sendMessage(pageBoxReq).toPromise();

                            const pageToBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'addBulk',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        records: boxes.map((box, index) => {
                                            return {
                                                pageId: page.id,
                                                boxId: box.id,
                                                x: boxPositions[index].x,
                                                y: boxPositions[index].y,
                                                templateUsed: 0
                                            }
                                        }),
                                        fields: ['pageId', 'boxId', 'x', 'y'],
                                        returning: true
                                    }
                                }
                            };

                            await this.protocolService.sendMessage(pageToBoxReq).toPromise();
                            boxesIds = boxes.map((box) => box.id);
                        }

                        // Select boxes from template other than inherited
                        const newBoxesFromTemplate = boxes.filter(box => (box.data.templateUsed && pageConfig.templateUsed !== box.data.templateUsed))
                        if (newBoxesFromTemplate && newBoxesFromTemplate.length) {
                            const pageToBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'addBulk',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        records: newBoxesFromTemplate.map((box) => {
                                            return {
                                                pageId: page.id,
                                                boxId: box.id,
                                                x: box.data.x,
                                                y: box.data.y,
                                                templateUsed: box.data.templateUsed
                                            }
                                        }),
                                        fields: ['pageId', 'boxId', 'x', 'y'],
                                        returning: true
                                    }
                                }
                            };
                            await this.protocolService.sendMessage(pageToBoxReq).toPromise();
                        }

                        // add boxes to the pages which are inherited from template
                        if (pageConfig.templateUsed) {
                            const templateIdReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'get',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'page',
                                        fields: ['id'],
                                        where: {
                                            title: pageConfig.templateUsed,
                                            isTemplate: 1
                                        }
                                    }
                                }
                            }

                            const templateId = await this.protocolService.sendMessage(templateIdReq).toPromise();

                            const pageToBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        data: boxes.filter(box => box.data.templateUsed).map((box) => {
                                            return {
                                                pageId: page.id,
                                                boxId: box.id,
                                                templateUsed: templateId.id,
                                                x: box.data.x,
                                                y: box.data.y
                                            }
                                        })
                                    }
                                }
                            };

                            await this.protocolService.sendMessage(pageToBoxReq).toPromise();
                            boxesIds = [...boxesIds, ...boxes.map((box) => box.id)];
                        }
                    }

                    subscriber.next({
                        success: "The page was added",
                        data: {pageId: page.id, boxes: boxesIds}
                    })
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }

            })()

        })
    }

    private edit(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    
                    const pageId = Number(params.pageProps.pageId);
                    
                    /*
                    * 1. update the page
                    * */

                    const {boxes, pageProps, pageConfig} = params;
                    const newBoxesDetails = [];
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                where: {
                                    id: pageId
                                },
                                data: {
                                    title: pageProps.title,
                                    isHome: pageProps.isHome ? 1 : 0,
                                    active: pageProps.active ? 1 : 0,
                                    link: pageProps.link || "",
                                    isTemplate: pageProps.isTemplate ? 1 : 0,
                                    templateId: pageProps.templateId,
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pageReq).toPromise();

                    /*
                    * 2. delete unused category associations and add new ones
                    * */

                    const pageToCategoryDelReq = {
                        channel: 'db',
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToCategory',
                                where: {
                                    'and': {
                                        pageId: pageId,
                                        categoryId: {
                                            'notIn': pageConfig.categories || []
                                        }
                                    }
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pageToCategoryDelReq).toPromise();

                    if(pageConfig.categories.length) {
                        const pageToCategoryReq = {
                            channel: 'db',
                            api: 'sql',
                            act: 'addBulk',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToCategory',
                                    records: pageConfig.categories.map(catId => {
                                        return {categoryId: catId, pageId: pageId}
                                    }),
                                    ignoreDuplicates: true
                                }
                            }
                        };

                        await this.protocolService.sendMessage(pageToCategoryReq).toPromise();
                    }

                    delete pageConfig.categories;

                    const pagesToConfigReq: payloadInterface = {//TODO CAN BE JOINED WITH PAGE pageConfig
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToConfig',
                                where: {
                                    pageId: pageId
                                }
                            }
                        }
                    };
                    const pagesToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise();

                    /*
                    * 3. delete background image
                    * */

                    if (pageConfig.deleteOldBackground) {
                        //try to delete the existing background image
                        const oldConfigReq: payloadInterface = {//TODO CAN BE JOINED WITH PAGE pageToConfig
                            channel: 'db',
                            api: 'sql',
                            act: 'get',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageConfig',
                                    where: {
                                        id: pagesToConfig.configId
                                    }
                                }
                            }
                        };

                        const oldConfig = await this.protocolService.sendMessage(oldConfigReq).toPromise();

                        if (oldConfig.data && oldConfig.data.length) {
                            try {
                                const oldConfigData = JSON.parse(oldConfig.data);

                                if (oldConfig.hasBackgroundImage && oldConfig.backgroundImage.length) {
                                    await this.protocolService.sendMessage({
                                        channel: 'bucket',
                                        api: 'fs',
                                        act: 'rm',
                                        payload: {
                                            channel: 'system',
                                            selection: [`/pages/page-${pageId}/${oldConfigData.backgroundImage}`]
                                        }
                                    }).toPromise();
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }

                    /*
                    * 4. update pageConfig
                    * */

                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageConfig',
                                where: {
                                    id: pagesToConfig.configId
                                },
                                data: {
                                    data: JSON.stringify(pageConfig)
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(configReq).toPromise();

                    /*
                    5. get pages_to_boxes
                    */

                    const ptb_req: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToBox',
                                where: {
                                    pageId: pageId,
                                }
                            }
                        }
                    };

                    const ptb = await this.protocolService.sendMessage(ptb_req).toPromise();

                    /*
                    6. see what boxes are missing to delete them and theirs files
                    */
                    if (ptb.count) {

                        let missing_boxIds = ptb.rows.map(box => box['boxId']);
                        const template_boxIds = ptb.rows.filter(box => box.templateUsed !== 0).map((box) => box['boxId']);
                        missing_boxIds = missing_boxIds.filter(boxId => {
                            let found = false;
                            boxes.forEach(box => {
                                found = found || (box.id === boxId);
                            })
                            return !found;
                        });

                        if (missing_boxIds.length) {
                            await Promise.all(missing_boxIds.map(async boxId => {
                                await this.protocolService.sendMessage({
                                    channel: 'db',
                                    api: 'sql',
                                    act: 'rem',
                                    payload: {
                                        channel: 'system',
                                        data: {
                                            what: 'pageToBox',
                                            where: {
                                                boxId: boxId,
                                                pageId: pageId
                                            }
                                        }
                                    }
                                }).toPromise();

                                if (template_boxIds.indexOf(boxId) === -1) {
                                    await this.protocolService.sendMessage({
                                        channel: 'db',
                                        api: 'sql',
                                        act: 'rem',
                                        payload: {
                                            channel: 'system',
                                            data: {
                                                what: 'pageBox',
                                                where: {
                                                    id: boxId
                                                }
                                            }
                                        }
                                    }).toPromise();

                                    await this.protocolService.sendMessage({
                                        channel: 'bucket',
                                        api: 'fs',
                                        act: 'rm',
                                        payload: {
                                            channel: 'system',
                                            selection: [`/pages/page-${pageId}/box-${boxId}`]
                                        }
                                    }).toPromise();
                                }
                            }));
                        }
                    }

                    /*
                    7. add new boxes and pages_to_boxes
                    */

                    const newBoxes = boxes.filter(box => !box.id);

                    if (newBoxes.length) {

                        const newBoxesMeta = newBoxes.map(newBox => {
                            return {
                                x: newBox.data.x,
                                y: newBox.data.y,
                                i: newBox.data.i,
                            }
                        });

                        const newBoxesData = newBoxes.map(newBox => {
                            return {
                                title: newBox.title,
                                module: newBox.module,
                                data: JSON.stringify(omit(newBox.data, ['x', 'y', 'i'])),
                                moduleOptions: JSON.stringify(newBox.moduleOptions),
                            }
                        })

                        const newAddedBoxes = await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'addBulk',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageBox',
                                    returning: true,
                                    records: newBoxesData,
                                    fields: ['title', 'module', 'data', 'moduleOptions']
                                }
                            }
                        }).toPromise();

                        const newPTB = await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'addBulk',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToBox',
                                    records: newAddedBoxes.map((newBox, index) => {
                                        return {
                                            pageId: Number(params.pageProps.pageId),
                                            boxId: newBox.id,
                                            x: newBoxesMeta[index].x,
                                            y: newBoxesMeta[index].y,
                                            templateUsed: 0
                                        }
                                    }),
                                    fields: ['pageId', 'boxId', 'x', 'y']
                                }
                            }
                        }).toPromise();

                        newAddedBoxes.map((newBox, index) => {//for reference number. seamless update
                            newBox.ref = newBoxesMeta[index].i;
                            newBoxesDetails.push({
                                id: newBox.id,
                                ref: newBoxesMeta[index].i
                            })
                            return newBox;
                        });

                    }

                    /*
                    8. update existing boxes and relations.
                    */

                    const existingBoxes = boxes.filter(box => box.id && !box.data.templateUsed);

                    await Promise.all(existingBoxes.map(async box => {

                        const pageBoxPayload =  {
                            channel: 'db',
                            api: 'sql',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageBox',
                                    data: {
                                        title: box.title,
                                        module: box.module,
                                        data: JSON.stringify(omit(box.data, ['x', 'y', 'i'])),
                                        moduleOptions: JSON.stringify(box.moduleOptions)
                                    },
                                    where: {
                                        id: box.id
                                    }
                                }
                            }
                        }

                        await this.protocolService.sendMessage(pageBoxPayload).toPromise();

                        await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToBox',
                                    data: {
                                        x: box.data.x,
                                        y: box.data.y
                                    },
                                    where: {
                                        pageId: pageId,
                                        boxId: box.id
                                    }
                                }
                            }
                        }).toPromise();

                    }));

                    /*
                    9. update existing boxes from templates
                    */

                    const boxesFromTemplate = boxes.filter(box => box.hasOwnProperty('id') && box.data.templateUsed);

                    let existingBoxIdsFromTemplate = [];

                    if (ptb.data && ptb.data.length) {
                        existingBoxIdsFromTemplate = ptb.data.filter((box) => box.data.templateUsed).map((box) => box.boxId)
                    }

                    const existingBoxesFromTemplate = boxesFromTemplate.filter((box) => {
                        return existingBoxIdsFromTemplate.length && existingBoxIdsFromTemplate.indexOf(box.id) > -1;
                    })

                    if (existingBoxesFromTemplate && existingBoxesFromTemplate.length) {
                        await Promise.all(existingBoxesFromTemplate.map(async box => {
                            await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'sql',
                                act: 'set',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        data: {
                                            x: box.data.x,
                                            y: box.data.y
                                        },
                                        where: {
                                            pageId: pageId,
                                            boxId: box.id
                                        }
                                    }
                                }
                            }).toPromise();
                        }));
                    }

                    /*
                    * 10. add new boxes from template
                    * */

                    const newBoxesFromTemplate = boxesFromTemplate.filter((box) => {
                        return !(existingBoxIdsFromTemplate.length && existingBoxIdsFromTemplate.indexOf(box.id) > -1);
                    })

                    if (newBoxesFromTemplate && newBoxesFromTemplate.length) {
                        await Promise.all(newBoxesFromTemplate.map(async box => {
                            await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'sql',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        data: {
                                            x: box.data.x,
                                            y: box.data.y,
                                            templateUsed: box.data.templateUsed,
                                            pageId: pageId,
                                            boxId: box.id
                                        }
                                    }
                                }
                            }).toPromise();
                        }));
                    }

                    const boxesIds = [];

                    if (newBoxesDetails.length) {
                        newBoxesDetails.map(newBox => {
                            boxesIds.push({id: newBox.id, ref: newBox.ref})
                        });
                    }

                    if (existingBoxes.length) {
                        existingBoxes.map(box => {
                            boxesIds.push({id: box.id})
                        });
                    }

                    subscriber.next({
                        success: "The page was saved",
                        data: {
                            pageId: pageId,
                            boxes: boxesIds
                        }
                    })
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }

            })()
        })
    }

    private rem(params: any) {
        return new Observable(subscriber => {

            (async () => {
                try {
                    this._removeFiles({
                        where: {
                            id: params.id
                        }
                    });

                    // select pageToBox
                    const pageToBoxReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToBox',
                                count: false,
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };

                    const pageToBox = await this.protocolService.sendMessage(pageToBoxReq).toPromise();

                    // delete pageToBox first because of foreign key
                    const delPageToBoxReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToBox',
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };

                    this.protocolService.sendMessage(delPageToBoxReq).toPromise();

                    // delete pageBox
                    if (pageToBox.rows && pageToBox.rows.length) {
                        const boxesReq: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageBox',
                                    where: {
                                        id: pageToBox.rows.filter(box => box.templateUsed === 0).map((box) => {
                                            return box.boxId
                                        })
                                    }
                                }
                            }
                        };

                        this.protocolService.sendMessage(boxesReq).toPromise();

                    }

                    // select pageToConfig
                    const pageToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToConfig',
                                count: false,
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };
                    const pageToConfig = await this.protocolService.sendMessage(pageToConfigReq).toPromise();

                    // delete pageToConfig first because of foreign key
                    const remPageToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToConfig',
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };

                    this.protocolService.sendMessage(remPageToConfigReq).toPromise();

                    if(pageToConfig) {
                        // delete config
                        const configReq: payloadInterface = {
                            channel: 'db',
                            api: 'sql',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageConfig',
                                    where: {
                                        id: pageToConfig.configId
                                    }
                                }
                            }
                        };

                        this.protocolService.sendMessage(configReq).toPromise();
                    }


                    // delete pageToConfig first because of foreign key
                    const pageToCategoryReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToCategory',
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };

                    this.protocolService.sendMessage(pageToCategoryReq).toPromise();

                    //delete page
                    const pagesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };

                    this.protocolService.sendMessage(pagesReq).toPromise();

                    subscriber.next({
                        success: "The page was removed",
                        data: params.id
                    })
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    private duplicate(params: any) {
        return new Observable(subscriber => {
            (async () => {

                try {

                    /*
                    * 1. get the source page
                    * */
                    const sourcePage = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                data: {
                                    id: params.id
                                },
                                include: [{
                                    model: 'pageBox',
                                    through: 'pageToBox',
                                    required: false
                                },{
                                    model: 'pageConfig',
                                    through: 'pageToConfig',
                                    required: false
                                }]
                            }
                        }
                    }).toPromise();

                    if (!sourcePage) return;

                    /*
                    * 2. Create the new page
                    * */

                    const newPage = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                data: omit(sourcePage.data, ['pageBoxes', 'pageConfigs'])
                            }
                        }
                    }).toPromise();

                    /*
                    * 3. copy page config
                    * */

                    const newPageConfig = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageConfig',
                                data: omit(sourcePage.pageConfigs[0], 'id')
                            }
                        }
                    }).toPromise();

                    const newPageToConfig = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToConfig',
                                data: {
                                    pageId: newPage.id,
                                    configId: newPageConfig.id
                                }
                            }
                        }
                    }).toPromise();

                    /*
                    * 3. copy categories associations
                    * */

                    const ptc = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToCategory',
                                data: {
                                    pageId: params.id
                                }
                            }
                        }
                    }).toPromise();

                    if(ptc.count) {
                        const new_ptc = await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'addBulk',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToCategory',
                                    records: ptc.rows.map(ptc_item => {
                                        return omit(ptc_item, 'id');
                                    }),
                                    fields: ['pageId', 'categoryId']
                                }
                            }
                        }).toPromise();
                    }

                    const source_p_t_b = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToBox',
                                data: {
                                    pageId: params.id
                                }
                            }
                        }
                    }).toPromise();

                    if (source_p_t_b.count) {
                        const copyAssets = await this.protocolService.sendMessage({
                            channel: 'bucket',
                            api: 'fs',
                            act: 'copy',
                            payload: {
                                channel: 'system',
                                replace: true,
                                source: `/pages/page-${params.id}`,
                                destination: `/pages/page-${newPage.id}`,
                            }
                        }).toPromise();

                        source_p_t_b.rows.map(async (sptb) => {

                            let newBox;

                            if(!sptb.templateUsed) {
                                const old_box = await this.protocolService.sendMessage({
                                    channel: 'db',
                                    api: 'sql',
                                    act: 'get',
                                    payload: {
                                        channel: 'system',
                                        what: 'pageBox',
                                        where: {
                                            id: sptb.boxId
                                        }
                                    }
                                }).toPromise();

                                newBox = await this.protocolService.sendMessage({
                                    channel: 'db',
                                    api: 'sql',
                                    act: 'add',
                                    payload: {
                                        channel: 'system',
                                        what: 'pageBox',
                                        data: omit(old_box, 'id')
                                    }
                                }).toPromise();

                                const renameBoxFolders = await this.protocolService.sendMessage({
                                    channel: 'bucket',
                                    api: 'fs',
                                    act: 'mv',
                                    payload: {
                                        channel: 'system',
                                        replace: true,
                                        source: `/pages/page-${Number(params.id)}/box-${sptb.boxId}`,
                                        destination: `/pages/page-${newPage[0].id}/box-${newBox.id}`,
                                    }
                                }).toPromise();

                            }

                            const new_p_t_b = await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'sql',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    what: 'pageToBox',
                                    data: {
                                        pageId: newPage.id,
                                        boxId: sptb.templateUsed ? sptb.boxId : newBox.id,
                                        templateUsed: sptb.templateUsed ? sptb.templateUsed : 0
                                    }
                                }
                            }).toPromise();

                            return sptb;
                        })

                    }
                } catch (err) {
                    console.log(err);
                }


            })()

        })
    }

    private async _removeFiles(params) {

        if(Array.isArray(params.where)) {
            return Promise.all(params.where.map(async (param) => {
                return this.protocolService.sendMessage({
                    channel: 'bucket',
                    api: 'fs',
                    act: 'rm',
                    payload: {
                        channel: 'system',
                        path: `/pages`,
                        selection: [`/page-${param.where.id}`]
                    }
                }).toPromise();
            }))
        } else {
            return this.protocolService.sendMessage({
                channel: 'bucket',
                api: 'fs',
                act: 'rm',
                payload: {
                    channel: 'system',
                    path: `/pages`,
                    selection: [`/page-${params.where.id}`]
                }
            }).toPromise();
        }
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.pagesService." + data.act + " not found");
        }
        return null;
    }

}