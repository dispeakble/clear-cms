import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class PagesService {

    private methods = ["list", "add", "rem", "edit", "get", "duplicate"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list(params: any) {
        return new Observable(subscriber => {

            const whereObj = {
                'AND': {
                    isTemplate: params.isTemplate ? 1 : 0
                }
            };

            if (params.search && params.search.length > 2) {
                whereObj['AND']['OR'] = [];
                ["title", "link"].map(field => {
                    whereObj['AND']['OR'].push({[field]: {'LIKE': `%${params.search}%`}});
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
                                }
                            }
                        }
                    };

                    const page = await this.protocolService.sendMessage(pageReq).toPromise()

                    const pagesToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
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
                    const pagesToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise()

                    const configReq: payloadInterface = {
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

                    const config = await this.protocolService.sendMessage(configReq).toPromise()

                    const pagesToBoxReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToBox',
                                include: [{
                                    model: 'pageBox',
                                    as: 'pageBox',
                                    required: true
                                }],
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };
                    const boxes = await this.protocolService.sendMessage(pagesToBoxReq).toPromise()

                    const pagesToCategoriesReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'list',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToCategory',
                                fields: ["categoryId"],
                                where: {
                                    pageId: params.id
                                }
                            }
                        }
                    };

                    const pagesToCategories = await this.protocolService.sendMessage(pagesToCategoriesReq).toPromise();

                    const formattedPage = {
                        ...page,
                        pageConfig: {...JSON.parse(config.data), categories: pagesToCategories.rows.map(cat => cat.categoryId)}
                    }

                    if(boxes.data && boxes.data.length) {
                        formattedPage.items = boxes.data.map((box) => {
                            return {
                                ...box,
                                moduleOptions: JSON.parse(box.moduleoptions),
                                displayOptions: JSON.parse(box.displayoptions),
                            }
                        })
                    }
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
                    const {items, pageConfig} = params;
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page',
                                data: {
                                    title: pageConfig.title,
                                    isHome: pageConfig.isHome ? 1 : 0,
                                    active: pageConfig.active ? 1 : 0,
                                    link: String(pageConfig.link),
                                    isTemplate: pageConfig.isTemplate ? 1 : 0,
                                }
                            }
                        }
                    };
                    const page = await this.protocolService.sendMessage(pageReq).toPromise();

                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageConfig',
                                data: {
                                    data: pageConfig.data
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

                    if(Array.isArray(pageConfig.categories) && pageConfig.categories.length) {
                        const pageToCategoryReq = {
                            channel: 'db',
                            api: 'sql',
                            act: 'AddBulk',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToCategory',
                                    records: pageConfig.categories.map(cat => {
                                        return {
                                            pageId: page.id,
                                            categoryId: cat.id
                                        }
                                    }),
                                    fields: ['pageId', 'categoryId']
                                }
                            }
                        };

                        await this.protocolService.sendMessage(pageToCategoryReq).toPromise();
                    }

                    let boxesIds = []
                    const boxPositions = []
                    if (items.length) {
                        const newBoxes = items.filter(item => !item.templateUsed);
                        if (newBoxes.length) {
                            const pageBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'AddBulk',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageBox',
                                        records: newBoxes.map((item) => {
                                            boxPositions.push({x: item.x, y: item.y});
                                            return {
                                                title: item.title,
                                                module: item.module,
                                                data: item.data,
                                                moduleOptions: item.moduleOptions
                                            }
                                        }),
                                        fields: ['title', 'module', 'data', 'moduleOptions'],
                                        validate: true,
                                        returning: ['id']
                                    }
                                }
                            };

                            const boxes = await this.protocolService.sendMessage(pageBoxReq).toPromise();

                            const pageToBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'AddBulk',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        records: boxes.data.map((box, index) => {
                                            return {
                                                pageId: page.id,
                                                boxId: box.id,
                                                x: boxPositions[index].x,
                                                y: boxPositions[index].y
                                            }
                                        }),
                                        fields: ['pageId', 'boxId', 'x', 'y'],
                                        returning: ['id']
                                    }
                                }
                            };

                            await this.protocolService.sendMessage(pageToBoxReq).toPromise();
                            boxesIds = boxes.data.map((box) => box.id);
                        }

                        // Select boxes from template other than inherited
                        const newBoxesFromTemplate = items.filter(item => (item.templateUsed && pageConfig.templateUsed !== item.templateUsed))
                        if (newBoxesFromTemplate && newBoxesFromTemplate.length) {
                            const pageToBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'sql',
                                act: 'AddBulk',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        records: newBoxesFromTemplate.map((box) => {
                                            return {
                                                pageId: page.id,
                                                boxId: box.id,
                                                x: box.x,
                                                y: box.y,
                                                templateUsed: box.templateUsed
                                            }
                                        }),
                                        fields: ['pageId', 'boxId', 'x', 'y'],
                                        returning: ['id']
                                    }
                                }
                            };
                            await this.protocolService.sendMessage(pageToBoxReq).toPromise();
                        }

                        /*// add boxes to the pages which are inherited from template
                        //TODO check if we need this... 
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
                                        data: items.filter(item => item.templateUsed).map((box) => {
                                            return {
                                                pageId: page.id,
                                                boxId: box.id,
                                                templateUsed: templateId.id,
                                                x: box.x,
                                                y: box.y
                                            }
                                        })
                                    }
                                }
                            };

                            await this.protocolService.sendMessage(pageToBoxReq).toPromise();
                            boxesIds = [...boxesIds, ...items.map((box) => box.id)];
                        }*/
                    }

                    subscriber.next({
                        success: "The page was added",
                        data: {pageId: page.id, items: boxesIds}
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
                    const {items, pageConfig} = params;
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
                                    id: params.id
                                },
                                fields: {
                                    title: pageConfig.title,
                                    isHome: pageConfig.isHome ? 1 : 0,
                                    active: pageConfig.active ? 1 : 0,
                                    categoryId: pageConfig.categoryId,
                                    link: pageConfig.link || "",
                                    isTemplate: pageConfig.isTemplate ? 1 : 0,
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pageReq).toPromise();

                    const pagesToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
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
                    const pagesToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise()

                    if (!pageConfig.backgroundImage) {
                        //try to delete the existing background image
                        const oldConfigReq: payloadInterface = {
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

                                if (oldConfig.bgImage.length) {
                                    await this.protocolService.sendMessage({
                                        channel: 'bucket',
                                        api: 'fs',
                                        act: 'rm',
                                        payload: {
                                            channel: 'system',
                                            selection: [`/pages/page-${Number(params.id)}/${oldConfigData.bgImage}`]
                                        }
                                    }).toPromise();
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }

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
                                fields: {
                                    data: pageConfig.data
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(configReq).toPromise();

                    /*
                    1. get pages_to_boxes
                    */

                    const ptb_req: payloadInterface = {
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
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

                    const ptb = await this.protocolService.sendMessage(ptb_req).toPromise();
                    /*
                    2. see what boxes are missing to delete them and theirs files
                    */
                    if (ptb.data && ptb.data.length) {

                        let missing_boxIds = ptb.data.map(item => item['boxId']);
                        const template_boxIds = ptb.data.filter(item => item.templateUsed !== 0).map((item) => item['boxId']);
                        missing_boxIds = missing_boxIds.filter(boxId => {
                            let found = false;
                            items.forEach(item => {
                                found = found || (item.id === boxId);
                            })
                            return !found;
                        });

                        if (missing_boxIds.length) {
                            await Promise.all(missing_boxIds.map(async boxId => {
                                this.protocolService.sendMessage({
                                    channel: 'db',
                                    api: 'sql',
                                    act: 'rem',
                                    payload: {
                                        channel: 'system',
                                        data: {
                                            what: 'pageToBox',
                                            where: {
                                                boxId: boxId,
                                                pageId: params.id
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
                                            selection: [`/pages/page-${Number(params.id)}/box-${boxId}`]
                                        }
                                    }).toPromise();
                                }
                            }))
                        }
                    }

                    /*
                    3. add new boxes and pages_to_boxes
                    */

                    const newBoxes = items.filter(item => !item.hasOwnProperty('id'));

                    if (newBoxes.length) {
                        await Promise.all(newBoxes.map(async newBox => {
                            const newBoxDetail = await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'sql',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageBox',
                                        data: {
                                            title: newBox.title,
                                            module: newBox.module,
                                            data: newBox.data,
                                            moduleOptions: newBox.moduleOptions,
                                        }
                                    }
                                }
                            }).toPromise();

                            await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'sql',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pageToBox',
                                        data: {
                                            pageId: params.id,
                                            boxId: newBoxDetail.id,
                                            x: newBox.x,
                                            y: newBox.y
                                        }
                                    }
                                }
                            }).toPromise();

                            newBoxDetail.ref = newBox.i; //for reference number. seamless update

                            newBoxesDetails.push(newBoxDetail);
                        }))
                    }

                    /*
                    4. update existing boxes and relations no matter what. could be a resize
                    */

                    const existingBoxes = items.filter(item => item.hasOwnProperty('id') && !item.templateUsed);

                    await Promise.all(existingBoxes.map(async box => {
                        await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageBox',
                                    fields: {
                                        title: box.title,
                                        module: box.module,
                                        data: box.data,
                                        moduleOptions: box.moduleOptions
                                    },
                                    where: {
                                        id: box.id
                                    }
                                }
                            }
                        }).toPromise();

                        await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pageToBox',
                                    fields: {
                                        x: box.x,
                                        y: box.y
                                    },
                                    where: {
                                        pageId: params.id,
                                        boxId: box.id
                                    }
                                }
                            }
                        }).toPromise();

                    }));

                    /*
                    5. update existing boxes positions no matter what. (existing boxes from the template)
                   */

                    const boxesFromTemplate = items.filter(item => item.hasOwnProperty('id') && item.templateUsed);

                    let existingBoxIdsFromTemplate = [];

                    if (ptb.data && ptb.data.length) {
                        existingBoxIdsFromTemplate = ptb.data.filter((box) => box.templateUsed).map((box) => box.boxId)
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
                                        fields: {
                                            x: box.x,
                                            y: box.y
                                        },
                                        where: {
                                            pageId: params.id,
                                            boxId: box.id
                                        }
                                    }
                                }
                            }).toPromise();
                        }));
                    }

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
                                            x: box.x,
                                            y: box.y,
                                            templateUsed: box.templateUsed,
                                            pageId: params.id,
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
                            boxesIds.push({id: box.id, ref: existingBoxes.i})
                        });
                    }

                    /*
                    * 5. delete old category association and add a new one
                    * //TODO CHECK IF THE ANY CATEGORY ASSOCIATION IS DELETED AND UPDATE ONLY WHAT IS NEEDED
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
                                    pageId: params.id
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pageToCategoryDelReq).toPromise();

                    const pageToCategoryReq = {
                        channel: 'db',
                        api: 'sql',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pageToCategory',
                                data: {
                                    pageId: params.id,
                                    categoryId: params.pageConfig.categoryId,
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pageToCategoryReq).toPromise();

                    subscriber.next({
                        success: "The page was saved",
                        data: {
                            pageId: params.id,
                            items: boxesIds
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
                        act: 'list',
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
                                    id: pageToConfig.rows.map(ptc => ptc.configId)
                                }
                            }
                        }
                    };

                    this.protocolService.sendMessage(configReq).toPromise();

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
                                }
                            }
                        }
                    }).toPromise();

                    const source_p_t_b = await this.protocolService.sendMessage({
                        channel: 'db',
                        api: 'sql',
                        act: 'get',
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

                    if (sourcePage.data && sourcePage) {

                        const old_page_data = sourcePage;

                        delete old_page_data.id;

                        const newPage = await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'sql',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                what: 'page',
                                data: old_page_data
                            }
                        }).toPromise();

                        if (source_p_t_b.data.length) {
                            const copyAssets = await this.protocolService.sendMessage({
                                channel: 'bucket',
                                api: 'fs',
                                act: 'copy',
                                payload: {
                                    channel: 'system',
                                    replace: true,
                                    source: `/pages/page-${Number(params.id)}`,
                                    destination: `/pages/page-${newPage[0].id}`,
                                }
                            }).toPromise();

                            const sptb = source_p_t_b.data;

                            if (sptb && sptb.length) {
                                sptb.map(async (s) => {

                                    const old_box = await this.protocolService.sendMessage({
                                        channel: 'db',
                                        api: 'sql',
                                        act: 'get',
                                        payload: {
                                            channel: 'system',
                                            what: 'pagesBox',
                                            where: {
                                                id: s.boxId
                                            }
                                        }
                                    }).toPromise();


                                    delete old_box.id;

                                    const newBox = await this.protocolService.sendMessage({
                                        channel: 'db',
                                        api: 'sql',
                                        act: 'add',
                                        payload: {
                                            channel: 'system',
                                            what: 'pagesBox',
                                            data: old_box
                                        }
                                    }).toPromise();

                                    const new_p_t_b = await this.protocolService.sendMessage({
                                        channel: 'db',
                                        api: 'sql',
                                        act: 'add',
                                        payload: {
                                            channel: 'system',
                                            what: 'pageToBox',
                                            data: {
                                                pageId: newPage.id,
                                                boxId: newBox.id
                                            }
                                        }
                                    }).toPromise();

                                    const renameBoxFolders = await this.protocolService.sendMessage({
                                        channel: 'bucket',
                                        api: 'fs',
                                        act: 'mv',
                                        payload: {
                                            channel: 'system',
                                            replace: true,
                                            source: `/pages/page-${Number(params.id)}/box-${s.id}`,
                                            destination: `/pages/page-${newPage[0].id}/box-${newBox.id}`,
                                        }
                                    }).toPromise();

                                    return s;
                                })
                            }

                        }
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