import { Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable} from "rxjs";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class ProductsService {

    private methods = ["list", "add", "remove", "edit", "get"];


    constructor(@Inject('ProtocolService') private protocolService) {
    }

    public list (params: any){
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products',
                                fields: ["*"]
                            }
                        }
                    };

                    const response = await this.protocolService.sendMessage(payload).toPromise();


                    const products_to_categoriesReq: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products_to_categories',
                                fields: ["*"]
                            }
                        }
                    };

                    const products_to_categories = await this.protocolService.sendMessage(products_to_categoriesReq).toPromise();

                    let productList = []

                    if(response.data.length > 0) {
                        productList = response.data.map((product) => ({
                            ...product,
                            categoryId: this.findCategoryId(product.id, products_to_categories)
                        }))
                    }

                    subscriber.next({type: "product_list", data: productList});
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    private findCategoryId(productId: number, productsToCategories: any) {
        if(productsToCategories.data.length > 0) {
            const item = productsToCategories.data.find((item) => item.product_id === productId);
            if(item) {
                return item.category_id
            }
        }
        return 0
    }

    public add(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products',
                                data: {
                                    title: params.title,
                                    description: params.description,
                                    active: params.active ? 1 : 0,
                                    added: +new Date(),
                                    last_edited: +new Date(),
                                    ...(params.availability[0] && params.availability[1]  && {availability: `[${params.availability[0]},${params.availability[1]})`}),
                                    ...(params.unavailability[0] && params.unavailability[1] && {unavailability: `[${params.unavailability[0]},${params.unavailability[1]})`})
                                }
                            }
                        }
                    };
                    const product = await this.protocolService.sendMessage(payload).toPromise();

                    if(params.categoryId) {
                        const payload: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'products_to_categories',
                                    data: {
                                        product_id: product.data[0].id,
                                        category_id: params.categoryId,
                                    }
                                }
                            }
                        };
                        await this.protocolService.sendMessage(payload).toPromise();
                    }

                    const localityToProductPayload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'add',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'locality_to_products',
                                data: {
                                    product_id: product.data[0].id,
                                    locality_id: params.localityId ? params.localityId : 0,
                                }
                            }
                        }
                    };
                    await this.protocolService.sendMessage(localityToProductPayload).toPromise();

                    subscriber.next({
                        success: "The product was added",
                        data: {productId: product.data[0].id}
                    });
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public edit(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products',
                                where: {
                                  id: params.id
                                },
                                data: {
                                    title: params.title,
                                    description: params.description,
                                    active: params.active ? 1 : 0,
                                    last_edited: +new Date(),
                                    ...(params.availability[0] && params.availability[1]  && {availability:`[${params.availability[0]}, ${params.availability[1]})`}),
                                    ...(params.unavailability[0] && params.unavailability[1] && {unavailability:`[${params.unavailability[0]}, ${params.unavailability[1]})`})
                                }
                            }
                        }
                    };

                    const product = await this.protocolService.sendMessage(payload).toPromise();

                    // Fetch previous categoryId

                    const category = await this.getCategoryByProductId(params.id);

                    if (category.data[0] && params.categoryId) {
                        const payload: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'set',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'products_to_categories',
                                    where: {
                                      product_id: params.id
                                    },
                                    data: {
                                        category_id: params.categoryId,
                                    }
                                }
                            }
                        };
                        await this.protocolService.sendMessage(payload).toPromise();
                    } else if(category.data[0] && !params.categoryId) {
                        const payload: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'rem',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'products_to_categories',
                                    where: {
                                        product_id: params.id
                                    },
                                }
                            }
                        };
                        await this.protocolService.sendMessage(payload).toPromise();
                    } else if(params.categoryId) {
                        const payload: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'products_to_categories',
                                    data: {
                                        product_id: params.id,
                                        category_id: params.categoryId,
                                    }
                                }
                            }
                        };
                        await this.protocolService.sendMessage(payload).toPromise();
                    }

                    const localityToProductPayload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'set',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'locality_to_products',
                                where: {
                                    product_id: params.id
                                },
                                data: {
                                    locality_id: params.localityId ? params.localityId : 0,
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(localityToProductPayload).toPromise();

                    subscriber.next({
                        success: "The product was edited",
                        data: {productId: params.id}
                    });
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public get(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };
                    let product = await this.protocolService.sendMessage(payload).toPromise();

                    product = product.data[0];

                    if(product.availability) {
                        product = {
                            ...product,
                            availability: this.convertDateRange(product.availability)
                        }
                    }

                    if(product.unavailability) {
                        product = {
                            ...product,
                            unavailability: this.convertDateRange(product.unavailability)
                        }
                    }

                    //Fetch categories for product

                    const category = await this.getCategoryByProductId(params.id);

                    //Fetch Locality based on product

                    const locality = await this.getLocalityByProductId(params.id);

                    subscriber.next({
                        success: "The product fetched successfully",
                        data: {
                            ...product,
                            ...(category.data[0] && {categoryId: category.data[0].category_id}),
                            ...(locality.data[0] && {localityId: locality.data[0].locality_id})}
                    });
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public remove(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const payload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products',
                                how: 'OR',
                                where: {
                                    id: params.id
                                }
                            }
                        }
                    };

                    await this.protocolService.sendMessage(payload).toPromise();

                    const productsToCategoriesPayload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'products_to_categories',
                                how: 'OR',
                                where: {
                                    product_id: params.id,
                                }
                            }
                        }
                    }

                    await this.protocolService.sendMessage(productsToCategoriesPayload).toPromise();

                    subscriber.next({
                        success: "The product/s deleted",
                        data: {}
                    });
                } catch (err) {
                    subscriber.error(err);
                } finally {
                    subscriber.complete();
                }
            })()
        })
    }

    public async getCategoryByProductId(productId: number) {
        //Fetch categories for product if it has
        const productsToCategoryPayload: payloadInterface = {
            channel: 'db',
            api: 'db',
            act: 'get',
            payload: {
                channel: 'system',
                data: {
                    what: 'products_to_categories',
                    fields: ["category_id"],
                    where: {
                        product_id: productId
                    }
                }
            }
        }

        const category = await this.protocolService.sendMessage(productsToCategoryPayload).toPromise();

        return category;
    }

    public async getLocalityByProductId(productId: number) {
        //Fetch categories for product if it has
        const localityToProductsPayload: payloadInterface = {
            channel: 'db',
            api: 'db',
            act: 'get',
            payload: {
                channel: 'system',
                data: {
                    what: 'locality_to_products',
                    fields: ["locality_id"],
                    where: {
                        product_id: productId
                    }
                }
            }
        }

        const locality = await this.protocolService.sendMessage(localityToProductsPayload).toPromise();

        return locality;
    }

    private convertDateRange(dateRange) {
        return dateRange.slice(1, dateRange.length - 1).split(",")
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.productsService." + data.act + " not found");
        }
        return null;
    }

}