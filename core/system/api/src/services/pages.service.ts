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
                        fields: ["id", "title", "is_default", "publish", "cat_id"]
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
                              fields: ["*"],
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
                              fields: ["*"],
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
                              fields: ["*"],
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
                              fields: ["*"],
                              how: "OR",
                              where: {
                                  page_id: params.id
                              }
                          }
                      }
                  };
                  const pageToBoxes = await this.protocolService.sendMessage(pagesToBoxReq).toPromise()

                  const boxReq: payloadInterface = {
                      channel: 'db',
                      api: 'db',
                      act: 'get',
                      payload: {
                          channel: 'system',
                          data: {
                              what: 'page_box',
                              fields: ["*"],
                              how: "OR",
                              where: pageToBoxes.data.map(({box_id}) => {
                                  return {
                                      id: box_id,
                                  }
                              })
                          }
                      }
                  };
                  const boxes = await this.protocolService.sendMessage(boxReq).toPromise()

                  const formattedPage = {
                      id: params.id,
                      pageConfig: {
                          backgroundColor: config.bgcolor,
                          backgroundImage: config.bgimage,
                          backgroundRepeat: !!config.bgrepeat,
                          backgroundStretch: !!config.bgstretch,
                          category: page.cat_id,
                          defaultPage: !!page.is_default,
                          fontFamily: config.fontfamily,
                          fontSize: config.fontsize,
                          layoutBoxSpacing: [config.boxsizing, config.boxsizing],
                          pageLink: page.pagelink,
                          pageTitle: page.title,
                          publish: !!page.publish,
                          textColor: config.textcolor,
                      },
                      items: boxes.data.map((box) => {
                          return {
                              ...(box.bgcolor !== null && {backgroundColor: box.bgcolor}),
                              backgroundImage: box.bgimage,
                              backgroundRepeat: !!box.bgrepeat,
                              backgroundStretch: !!box.bgstretch,
                              borderColor: box.bordercolor,
                              borderRadius: box.borderradius,
                              borderStyle: box.borderstyle,
                              borderWidth: box.borderwidth,
                              h: box.height,
                              w: box.width,
                              i: box.id.toString(),
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
                                    bgimage: pageConfig.backgroundImage,
                                    fontsize: pageConfig.fontSize,
                                    fontfamily: pageConfig.fontFamily,
                                    textcolor: pageConfig.textColor,
                                    boxsizing: pageConfig.layoutBoxSpacing[0],
                                    bgrepeat: pageConfig.backgroundRepeat ? 1: 0,
                                    bgstretch: pageConfig.backgroundStretch ? 1: 0,
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
                    let boxesIds = []
                    if(items.length){
                        const pageBoxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    data: items.map((item) => {
                                        return {
                                            title: item.title,
                                            module: item.module,
                                            fontsize: item.fontSize || null,
                                            fontfamily: item.fontFamily || null,
                                            textcolor: item.textColor || null,
                                            bgcolor: item.backgroundColor || null,
                                            bgimage: item.backgroundImage || "",
                                            borderwidth: item.borderWidth || 0,
                                            bordercolor: item.borderColor || "#ffffff",
                                            borderradius: item.borderRadius || 0,
                                            bgrepeat: item.backgroundRepeat ? 1 : 0,
                                            bgstretch: item.backgroundStretch ? 1 : 0,
                                            height: item.h,
                                            width: item.w,
                                            moduleoptions: item.moduleOptions,
                                            x: item.x,
                                            y: item.y,
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
                                    data: boxes.data.map((box) => {
                                        return {
                                            page_id: page.data[0].id,
                                            box_id: box.id,
                                        }
                                    })
                                }
                            }
                        };

                        const pageBoxes =  await  this.protocolService.sendMessage(pageToBoxReq).toPromise();
                        boxesIds = boxes.data.map((box) => box.id)
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
                    const {items, pageConfig} = params
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
                                fields: ["*"],
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
                                    bgimage: pageConfig.backgroundImage,
                                    fontsize: pageConfig.fontSize,
                                    fontfamily: pageConfig.fontFamily,
                                    textcolor: pageConfig.textColor,
                                    boxsizing: pageConfig.layoutBoxSpacing[0],
                                    bgrepeat: pageConfig.backgroundRepeat ? 1: 0,
                                    bgstretch: pageConfig.backgroundStretch ? 1: 0,
                                }
                            }
                        }
                    };

                    const config =  await  this.protocolService.sendMessage(configReq).toPromise();

                   // Update multiple existing boxes
                    const updateItems = items.filter((item) => !item.toBeSave)
                    const keepItems = updateItems.map(item =>  parseInt(item.i))
                    const boxGetReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'pages_to_boxes',
                                fields: ["*"],
                                how: "OR",
                                where: {
                                    page_id: params.id
                                }
                            }
                        }
                    };
                    const allBoxes = await this.protocolService.sendMessage(boxGetReq).toPromise()
                    const allBoxIds = [...new Set(allBoxes.data.map(item => item.box_id))]
                    const deleteIds = allBoxIds.filter(el => !keepItems.includes(el))
                    if(deleteIds.length){
                        const pagesToBoxDelReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pages_to_boxes',
                                    how: 'OR',
                                    where: {
                                        box_id: deleteIds
                                    }
                                }
                            }
                        };
                        await this.protocolService.sendMessage(pagesToBoxDelReq).toPromise()

                        const boxesDelReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    how: 'OR',
                                    where: {
                                        id: deleteIds
                                    }
                                }
                            }
                        };

                        await this.protocolService.sendMessage(boxesDelReq).toPromise()
                    }


                    await Promise.all(updateItems.map(async (item) => {
                        const pageBoxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    where: {
                                        id: parseInt(item.i)
                                    },
                                    data: {
                                        title: item.title,
                                        module: item.module,
                                        fontsize: item.fontSize || null,
                                        fontfamily: item.fontFamily || null,
                                        textcolor: item.textColor || null,
                                        bgcolor: item.backgroundColor || null,
                                        bgimage: item.backgroundImage || "",
                                        borderwidth: item.borderWidth || 0,
                                        bordercolor: item.borderColor || "#ffffff",
                                        borderradius: item.borderRadius || 0,
                                        bgrepeat: item.backgroundRepeat ? 1 : 0,
                                        bgstretch: item.backgroundStretch ? 1 : 0,
                                        height: item.h,
                                        width: item.w,
                                        moduleoptions: item.moduleOptions,
                                        x: item.x,
                                        y: item.y,
                                        borderstyle: item.borderStyle || "solid",
                                        showscrollbars: item.showScrollbars? 1 : 0,
                                    }
                                }
                            }
                        };
                        await this.protocolService.sendMessage(pageBoxReq).toPromise();
                    }))


                    // create boxes which don't exist
                    const createItems = items.filter((item) => item.toBeSave)
                    let boxesData = {
                        data: []
                    }
                    if(createItems.length){
                        const pageBoxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'page_box',
                                    data: createItems.map((item) => {
                                        return {
                                            title: item.title,
                                            module: item.module,
                                            fontsize: item.fontSize || null,
                                            fontfamily: item.fontFamily || null,
                                            textcolor: item.textColor || null,
                                            bgcolor: item.backgroundColor || null,
                                            bgimage: item.backgroundImage || "",
                                            borderwidth: item.borderWidth || 0,
                                            bordercolor: item.borderColor || "#ffffff",
                                            borderradius: item.borderRadius || 0,
                                            bgrepeat: item.backgroundRepeat ? 1 : 0,
                                            bgstretch: item.backgroundStretch ? 1 : 0,
                                            height: item.h,
                                            width: item.w,
                                            moduleoptions: item.moduleOptions,
                                            x: item.x,
                                            y: item.y,
                                            borderstyle: item.borderStyle || "solid",
                                            showscrollbars: item.showScrollbars? 1 : 0,
                                        }
                                    })
                                }
                            }
                        };

                        const boxes =  await  this.protocolService.sendMessage(pageBoxReq).toPromise();
                        boxesData = {...boxes}
                        const pageToBoxReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'pages_to_boxes',
                                    data: boxes.data.map((box) => {
                                        return {
                                            page_id: params.id,
                                            box_id: box.id,
                                        }
                                    })
                                }
                            }
                        };

                        const pageBoxes =  await  this.protocolService.sendMessage(pageToBoxReq).toPromise();
                    }


                    subscriber.next({
                        success: "The page was saved",
                        data: {pageId: params.id, items: boxesData.data.map(box => box.id)}
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

                        const boxes = await this.protocolService.sendMessage(boxesReq).toPromise()
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

                    const pages = await this.protocolService.sendMessage(pagesReq).toPromise()

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

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.pagesService." + data.act + " not found");
        }
        return null;
    }

}