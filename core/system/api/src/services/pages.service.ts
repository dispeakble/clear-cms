import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";

@Injectable()
export class PagesService {

    private methods = ["list", "add", "remove", "edit", "get"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    private help = {
        giveBoxValues: (values) => {
            return {
                title: values.title,
                module: values.module,
                fontsize: values.fontSize || null,
                fontfamily: values.fontFamily || null,
                textcolor: values.textColor || null,
                bgcolor: values.backgroundColor || null,
                bggradientcolor: values.backgroundGradientColor || null,
                bgimage: values.backgroundImage || "",
                borderwidth: values.borderWidth || 0,
                bordercolor: values.borderColor || "#ffffff",
                borderradius: values.borderRadius || 0,
                bgrepeat: values.backgroundRepeat ? 1 : 0,
                bgstretch: values.backgroundStretch ? 1 : 0,
                bggradient: values.backgroundGradient ? 1 : 0,
                height: values.h,
                width: values.w,
                moduleoptions: values.moduleOptions,
                borderstyle: values.borderStyle || "solid",
                showscrollbars: values.showScrollbars? 1 : 0,
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
                        what: 'pages',
                        fields: ["id", "title", "is_default", "publish", "cat_id", "istemplate"],
                        ...(params.isTemplate && {how: "OR"}),
                        ...(params.isTemplate && {where: {istemplate: 1}}),
                    }
                }
            };

            this.protocolService.sendMessage(payload).subscribe(data => {
                let response = null;

                if (data && data.hasOwnProperty('data')) {
                    let pages = data.data.map((page) => {
                        return {
                            id: page.id,
                            pageConfig: {
                                pageTitle: page.title,
                                defaultPage: !!page.is_default,
                                publish: !!page.publish,
                                category: page.cat_id,
                                isTemplate: !!page.istemplate,
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

    public get (params: any){
        return new Observable(subscriber => {
            (async () => {
              try {
                  const pageReq: payloadInterface = {
                      channel: 'db',
                      api: 'db',
                      act: 'get',
                      payload: {
                          channel: 'system',
                          data: {
                              what: 'pages',
                              fields: ["*"],//it's optional. defaults to *
                              how: "OR",
                              where: {
                                  id: params.id
                              }
                          }
                      }
                  };

                  let page = await this.protocolService.sendMessage(pageReq).toPromise()
                  page = page.data[0]
                  const pagesToConfigReq: payloadInterface = {
                      channel: 'db',
                      api: 'db',
                      act: 'get',
                      payload: {
                          channel: 'system',
                          data: {
                              what: 'pages_to_config',
                              fields: ["*"],//it's optional. defaults to *
                              how: "OR",
                              where: {
                                  page_id: params.id
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
                          channel: 'system',
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
                          channel: 'system',
                          data: {
                              what: 'pages_to_boxes',
                              fields: ["*"],//it's optional. defaults to *
                              how: "OR",
                              where: {
                                  page_id: params.id
                              }
                          }
                      }
                  };
                  const pageToBoxes = await this.protocolService.sendMessage(pagesToBoxReq).toPromise()
                  let boxes = {data: []}
                  if(pageToBoxes.data?.length){
                      const boxReq: payloadInterface = {
                          channel: 'db',
                          api: 'db',
                          act: 'get',
                          payload: {
                              channel: 'system',
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
                          channel: 'system',
                          data: {
                              what: 'pages_to_categories',
                              fields: ["category_id"],
                              where: {
                                  page_id: params.id
                              }
                          }
                      }
                  };

                  const pagesToCategories = await this.protocolService.sendMessage(pagesToCategoriesReq).toPromise();
                  let categoryId = 0;
                  if(pagesToCategories.data?.length) {
                      categoryId = pagesToCategories.data[0].category_id;
                  }

                  const formattedPage = {
                      id: params.id,
                      pageConfig: {
                          backgroundColor: config.bgcolor,
                          backgroundGradientColor: config.bggradientcolor,
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
                  subscriber.next({type: 'page', data: formattedPage});
                  subscriber.complete();
              } catch(err) {
                  console.log('err', err)
                  subscriber.error(err);
                  subscriber.complete();
              }
            })()


        })
    }

    public add (params: any){
        return new Observable(subscriber => {

            (async () => {
                try {
                    const {items, pageConfig} = params
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages',
                                data: {
                                    title: pageConfig.pageTitle,
                                    is_default: pageConfig.defaultPage ? 1 : 0,
                                    publish: pageConfig.publish ? 1 : 0,
                                    cat_id: pageConfig.category,
                                    pagelink: pageConfig.pageLink || "",
                                    istemplate: pageConfig.isTemplate ? 1 : 0,
                                }
                            }
                        }
                    };
                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page_config',
                                data: {
                                    bgcolor: pageConfig.backgroundColor,
                                    bggradientcolor: pageConfig.backgroundGradientColor,
                                    bgimage: pageConfig.backgroundImage,
                                    fontsize: pageConfig.fontSize,
                                    fontfamily: pageConfig.fontFamily,
                                    textcolor: pageConfig.textColor,
                                    boxsizing: pageConfig.layoutBoxSpacing[0],
                                    bgrepeat: pageConfig.backgroundRepeat ? 1: 0,
                                    bgstretch: pageConfig.backgroundStretch ? 1: 0,
                                    bggradient: pageConfig.backgroundGradient ? 1: 0,
                                    templateused: pageConfig.templateUsed || "",
                                }
                            }
                        }
                    };
                    const page =  await  this.protocolService.sendMessage(pageReq).toPromise();
                    const config =  await  this.protocolService.sendMessage(configReq).toPromise();

                    const pageToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_config',
                                data: {
                                   page_id: page.data[0].id,
                                   config_id: config.data[0].id,
                                }
                            }
                        }
                    };

                    const pageToConfig =  await  this.protocolService.sendMessage(pageToConfigReq).toPromise();

                    const pageToCategoryReq = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_categories',
                                data: {
                                    page_id: page.data[0].id,
                                    category_id: pageConfig.categoryId,
                                }
                            }
                        }
                    };

                    const pageToCategory = await this.protocolService.sendMessage(pageToCategoryReq).toPromise();

                    let boxesIds = []
                    let boxPositions = []
                    if(items.length){
                        const pageBoxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    data: items.filter(item => !item.templateUsed).map((item) => {
                                        boxPositions.push({x: item.x, y: item.y});
                                        return {
                                            title: item.title,
                                            module: item.module,
                                            fontsize: item.fontSize || null,
                                            fontfamily: item.fontFamily || null,
                                            textcolor: item.textColor || null,
                                            bgcolor: item.backgroundColor || null,
                                            bggradientcolor: item.backgroundGradientColor || null,
                                            bgimage: item.backgroundImage || "",
                                            borderwidth: item.borderWidth || 0,
                                            bordercolor: item.borderColor || "#ffffff",
                                            borderradius: item.borderRadius || 0,
                                            bgrepeat: item.backgroundRepeat ? 1 : 0,
                                            bgstretch: item.backgroundStretch ? 1 : 0,
                                            bggradient: item.backgroundGradient ? 1 : 0,
                                            height: item.h,
                                            width: item.w,
                                            moduleoptions: item.moduleOptions,
                                            borderstyle: item.borderStyle || "solid",
                                            showscrollbars: item.showScrollbars? 1 : 0,
                                        }
                                    })
                                }
                            }
                        };

                        const boxes =  await  this.protocolService.sendMessage(pageBoxReq).toPromise();

                        const pageToBoxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pages_to_boxes',
                                    data: boxes.data.map((box, index) => {
                                        return {
                                            page_id: page.data[0].id,
                                            box_id: box.id,
                                            x: boxPositions[index].x,
                                            y: boxPositions[index].y
                                        }
                                    })
                                }
                            }
                        };

                        const pageBoxes =  await  this.protocolService.sendMessage(pageToBoxReq).toPromise();
                        boxesIds = boxes.data.map((box) => box.id);

                        // add boxes to the pages which are inherited from template
                        if(pageConfig.templateUsed) {
                            const templateIdReq: payloadInterface = {
                                channel: 'db',
                                api: 'db',
                                act: 'get',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pages',
                                        fields: ['id'],
                                        where: {
                                            title: pageConfig.templateUsed,
                                            istemplate: 1
                                        }
                                    }
                                }
                            }

                            const templateId = await this.protocolService.sendMessage(templateIdReq).toPromise();

                            const pageToBoxReq: payloadInterface = {
                                channel: 'db',
                                api: 'db',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'pages_to_boxes',
                                        data: items.filter(item => item.templateUsed).map((box) => {
                                            return {
                                                page_id: page.data[0].id,
                                                box_id: box.id,
                                                template_used: templateId.data[0].id,
                                                x: box.x,
                                                y: box.y
                                            }
                                        })
                                    }
                                }
                            };

                            const pageBoxes =  await  this.protocolService.sendMessage(pageToBoxReq).toPromise();
                            boxesIds = [...boxesIds, ...items.map((box) => box.id)];
                        }
                    }

                    subscriber.next({
                        success: "The page was added",
                        data: {pageId: page.data[0].id, items: boxesIds}
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
            (async () => {
                try {
                    const {items, pageConfig} = params;
                    const newBoxesDetails = [];
                    const pageReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages',
                                where: {
                                    id: params.id
                                },
                                data: {
                                    title: pageConfig.pageTitle,
                                    is_default: pageConfig.defaultPage ? 1 : 0,
                                    publish: pageConfig.publish ? 1 : 0,
                                    cat_id: pageConfig.category,
                                    pagelink: pageConfig.pageLink || "",
                                    istemplate: pageConfig.isTemplate ? 1 : 0,
                                }
                            }
                        }
                    };

                    const page =  await this.protocolService.sendMessage(pageReq).toPromise();

                    const pagesToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_config',
                                fields: ["*"],//it's optional. defaults to *
                                how: "OR",
                                where: {
                                    page_id: params.id
                                }
                            }
                        }
                    };
                    const pagesToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise()

                    if(!pageConfig.backgroundImage){
                        //try to delete the existing background image
                        const oldConfigReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'get',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_config',
                                    where: {
                                        id: pagesToConfig.data[0].config_id
                                    }
                                }
                            }
                        };

                        const oldConfig = await this.protocolService.sendMessage(oldConfigReq).toPromise();

                        if(oldConfig.data && oldConfig.data.length){
                            if(oldConfig.data[0].bgimage.length){
                                try {
                                    await this.protocolService.sendMessage({
                                        channel: 'bucket',
                                        api: 'fs',
                                        act: 'rm',
                                        payload: {
                                            selection: [`/pages/page-${params.id}/${oldConfig.data[0].bgimage}`]
                                        }
                                    }).toPromise();
                                } catch (err) {
                                    console.log(err);
                                }

                            }
                        }
                    }

                    const configReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'page_config',
                                where: {
                                    id: pagesToConfig.data[0].config_id
                                },
                                data: {
                                    bgcolor: pageConfig.backgroundColor,
                                    bggradientcolor: pageConfig.backgroundGradientColor,
                                    bgimage: pageConfig.backgroundImage,
                                    fontsize: pageConfig.fontSize,
                                    fontfamily: pageConfig.fontFamily,
                                    textcolor: pageConfig.textColor,
                                    boxsizing: pageConfig.layoutBoxSpacing[0],
                                    bgrepeat: pageConfig.backgroundRepeat ? 1: 0,
                                    bgstretch: pageConfig.backgroundStretch ? 1: 0,
                                    bggradient: pageConfig.backgroundGradient ? 1: 0,
                                }
                            }
                        }
                    };

                    const config = await this.protocolService.sendMessage(configReq).toPromise();

                    /*
                    1. get pages_to_boxes
                    */

                    const ptb_req: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_boxes',
                                how: "OR",
                                where: {
                                    page_id: params.id
                                }
                            }
                        }
                    };

                    const ptb = await this.protocolService.sendMessage(ptb_req).toPromise();
                    /*
                    2. see what boxes are missing and delete them and the files
                    */
                    if(ptb.data && ptb.data.length){

                        let missing_box_ids = ptb.data.map(item => item['box_id']);
                        const template_box_ids = ptb.data.filter(item => item.template_used !== 0).map((item) => item['box_id']);
                        missing_box_ids = missing_box_ids.filter(box_id => {
                            let found = false;
                            params.items.forEach(item => {
                                found = found || (!!item.id && item.id === box_id);
                            })
                            return !found;
                        });

                        if(missing_box_ids.length){
                            await Promise.all(missing_box_ids.map(async box_id => {
                                await this.protocolService.sendMessage({
                                    channel: 'db',
                                    api: 'db',
                                    act: 'rem',
                                    payload: {
                                        channel: 'system',
                                        data: {
                                            what: 'pages_to_boxes',
                                            where: {
                                                box_id: box_id,
                                                page_id: params.id
                                            }
                                        }
                                    }
                                }).toPromise();
                                if(template_box_ids.indexOf(box_id) === -1) {
                                    await this.protocolService.sendMessage({
                                        channel: 'db',
                                        api: 'db',
                                        act: 'rem',
                                        payload: {
                                            channel: 'system',
                                            data: {
                                                what: 'page_box',
                                                how: 'OR',
                                                where: {
                                                    id: box_id
                                                }
                                            }
                                        }
                                    }).toPromise();
                                    await this.protocolService.sendMessage({
                                        channel: 'bucket',
                                        api: 'fs',
                                        act: 'rm',
                                        payload: {
                                            selection: [`/pages/page-${params.id}/box-${box_id}`]
                                        }
                                    }).toPromise();
                                }
                            }))
                        }
                    }

                    /*
                    3. add new boxes and pages_to_boxes
                    */

                    const newBoxes = params.items.filter(item => !item.hasOwnProperty('id'));

                    if(newBoxes.length) {
                       await Promise.all(newBoxes.map(async newBox => {
                           const newBoxDetail = await this.protocolService.sendMessage({
                               channel: 'db',
                               api: 'db',
                               act: 'add',
                               payload: {
                                   channel: 'system',
                                   data: {
                                       what: 'page_box',
                                       data: this.help.giveBoxValues(newBox)
                                   }
                               }
                           }).toPromise();

                           await this.protocolService.sendMessage({
                               channel: 'db',
                               api: 'db',
                               act: 'add',
                               payload: {
                                   channel: 'system',
                                   data: {
                                       what: 'pages_to_boxes',
                                       data:{
                                           page_id: params.id,
                                           box_id: newBoxDetail.data[0].id,
                                           x: newBox.x,
                                           y: newBox.y
                                       }
                                   }
                               }
                           }).toPromise();

                           newBoxDetail.data[0].ref = newBox.i;//for reference number

                           newBoxesDetails.push(newBoxDetail.data[0]);
                       }))
                    }

                    /*
                    4. update existing boxes no matter what. could be a resize
                    */

                    const existingBoxes = params.items.filter(item => item.hasOwnProperty('id'));

                    await Promise.all(existingBoxes.map(async box => {
                        await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'db',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    data: this.help.giveBoxValues(box),
                                    where: {
                                        id: box.id
                                    }
                                }
                            }
                        }).toPromise();
                    }));

                    await Promise.all(existingBoxes.map(async box => {
                        await this.protocolService.sendMessage({
                            channel: 'db',
                            api: 'db',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pages_to_boxes',
                                    data: {
                                        x: box.x,
                                        y: box.y
                                    },
                                    where: {
                                        page_id: params.id,
                                        box_id: box.id
                                    }
                                }
                            }
                        }).toPromise();
                    }));

                    const boxesIds = [];

                    if(newBoxesDetails.length){
                        newBoxesDetails.map(newBox => {
                            boxesIds.push({id: newBox.id, ref: newBox.ref})
                        });
                    }

                    if(existingBoxes.length){
                        existingBoxes.map(box => {
                            boxesIds.push({id: box.id, ref: existingBoxes.i})
                        });
                    }

                    /*
                    * 5. delete old category association and add a new one
                    * */

                    const pageToCategoryDelReq = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_categories',
                                where: {
                                    page_id: params.id
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pageToCategoryDelReq).toPromise();

                    const pageToCategoryReq = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_categories',
                                data: {
                                    page_id: Number(params.id),
                                    category_id: Number(params.pageConfig.categoryId),
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
                } catch(err) {
                    subscriber.error(err);
                    subscriber.complete();
                }

            })()
        })
    }

    public remove (params: any){
        return new Observable(subscriber => {

            (async () => {
                try {
                    await this._removeFiles({
                        where: {
                            id: params.id
                        }
                    })

                    // delete page_to_boxes
                    const pagesToBoxReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_boxes',
                                how: 'OR',
                                where: {
                                    page_id: params.id || 0
                                }
                            }
                        }
                    };
                    const pageToBox = await this.protocolService.sendMessage(pagesToBoxReq).toPromise()

                    // delete boxes
                    if(pageToBox.data.length){
                        const boxesReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    how: 'OR',
                                    where: {
                                        id: pageToBox.data.map((box) => {
                                            return box.box_id
                                        })
                                    }
                                }
                            }
                        };

                        const boxes = await this.protocolService.sendMessage(boxesReq).toPromise();

                    }

                    // delete page_to_config
                    const pagesToConfigReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_config',
                                how: 'OR',
                                where: {
                                    page_id: params.id || 0
                                }
                            }
                        }
                    };
                    const pageToConfig = await this.protocolService.sendMessage(pagesToConfigReq).toPromise()

                    // delete config
                    if(pageToConfig.data.length){
                        const configReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_config',
                                    how: 'OR',
                                    where: {
                                        id: pageToConfig.data.map((config) => {
                                            return config.config_id
                                        })
                                    }
                                }
                            }
                        };

                        const config = await this.protocolService.sendMessage(configReq).toPromise()
                    }

                    //delete page
                    const pagesReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages',
                                how: 'OR',
                                where: {
                                    id: params.id || 0
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(pagesReq).toPromise();

                    subscriber.next({
                        success: "The page was removed",
                        data: params.id
                    })
                    subscriber.complete();
                } catch(err) {
                    subscriber.error(err);
                    subscriber.complete();
                }
            })()

        })
    }

    private async _removeFiles(params) {

        return this.protocolService.sendMessage({
            channel: 'bucket',
            api: 'fs',
            act: 'rm',
            payload: {
                path: `/pages`,
                selection: [`/page-${params.where.id}`]
            }
        }).toPromise();

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