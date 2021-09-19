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

                    let images = null;

                    if(params.imageSources && params.imageSources.length) {
                        const imagesToProductReq: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'add',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'images_to_products',
                                    data: params.imageSources.map((image, index) => ({
                                        product_id: product.data[0].id,
                                        extension: image.extension,
                                        ordernumber: image.orderNumber,
                                        date_added: +new Date(),
                                        active: image.active ? 1 : 0
                                    }))
                                }
                            }
                        };
                        images = await this.protocolService.sendMessage(imagesToProductReq).toPromise();
                        images = images.data;
                    }

                    subscriber.next({
                        success: "The product was added",
                        data: {...product.data[0], imageSources: images}
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

                    //update images
                    const deletedImages = [];
                    const updatedImages = [];
                    let newImages = [];
                    if(params.imageSources && params.imageSources) {
                    //    fetch existing images
                        const imagesToProducts: payloadInterface = {
                            channel: 'db',
                            api: 'db',
                            act: 'get',
                            payload: {
                                channel: 'system',
                                data: {
                                    what: 'images_to_products',
                                    where: {
                                        product_id: params.id
                                    }
                                }
                            }
                        };

                        let existingImages = await this.protocolService.sendMessage(imagesToProducts).toPromise();
                        existingImages = existingImages.data;

                        const updatedImagesFromClient = params.imageSources.filter(image => image.image_id).map(image => image.image_id);

                        existingImages.map((image) => {
                            if(updatedImagesFromClient.indexOf(image.image_id) === -1) {
                                deletedImages.push(image);
                            } else {
                                const updatedImage = params.imageSources.find(item => item.image_id === image.image_id);
                                updatedImages.push(updatedImage);
                            }
                        })

                        //    delete Image record from the images_to_products
                        if(deletedImages && deletedImages.length) {
                            const imagesToProductsRemPayload: payloadInterface = {
                                channel: 'db',
                                api: 'db',
                                act: 'rem',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'images_to_products',
                                        how: 'OR',
                                        where: {
                                            image_id: deletedImages.map(image => image.image_id)
                                        }
                                    }
                                }
                            };
                            await this.protocolService.sendMessage(imagesToProductsRemPayload).toPromise()
                        }

                        //    delete Image record from the images_to_products
                        if(updatedImages && updatedImages.length) {
                            await Promise.all(updatedImages.map(async image => {
                                await this.protocolService.sendMessage({
                                    channel: 'db',
                                    api: 'db',
                                    act: 'set',
                                    payload: {
                                        channel: 'system',
                                        data: {
                                            what: 'images_to_products',
                                            data: {
                                                ordernumber: image.orderNumber,
                                                active: image.active ? 1 : 0
                                            },
                                            where: {
                                                image_id: image.image_id,
                                                product_id: params.id
                                            }
                                        }
                                    }
                                }).toPromise();
                            }));
                        }

                    //    add new Images if any
                        newImages = params.imageSources.filter(image => !image.image_id);
                        if(newImages && newImages.length) {
                            const imageList = await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'db',
                                act: 'add',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'images_to_products',
                                        data: newImages.map((image) => ({
                                            product_id: params.id,
                                            extension: image.extension,
                                            ordernumber: image.orderNumber,
                                            date_added: +new Date(),
                                            active: image.active ? 1 : 0
                                        }))
                                    }
                                }
                            }).toPromise();
                            newImages = imageList.data;
                        }
                    }

                    if(params.priceList && params.priceList.length) {
                        await Promise.all(params.priceList.map(async price => {
                            await this.protocolService.sendMessage({
                                channel: 'db',
                                api: 'db',
                                act: 'set',
                                payload: {
                                    channel: 'system',
                                    data: {
                                        what: 'prices_to_products',
                                        data: {
                                            active: price.active ? 1 : 0
                                        },
                                        where: {
                                            id: price.id,
                                            product_id: params.id
                                        }
                                    }
                                }
                            }).toPromise();
                        }));
                    }

                    subscriber.next({
                        success: "The product was edited",
                        data: {productId: params.id, deletedImages, updatedImages, newImages}
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

                    const imagesToProductsPayload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'images_to_products',
                                where: {
                                    product_id: params.id
                                }
                            }
                        }
                    };
                    let imageSources = await this.protocolService.sendMessage(imagesToProductsPayload).toPromise();

                    if(imageSources.data) {
                        imageSources = imageSources.data.sort((a,b) => a.ordernumber - b.ordernumber);
                    }

                    const pricesToProductsPayload = {
                        channel: 'db',
                        api: 'db',
                        act: 'get',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'prices_to_products',
                                where: {
                                    product_id: params.id
                                }
                            }
                        }
                    }

                    let priceList = await this.protocolService.sendMessage(pricesToProductsPayload).toPromise();
                    priceList = priceList.data;

                    subscriber.next({
                        success: "The product fetched successfully",
                        data: {
                            ...product,
                            imageSources: imageSources,
                            ...(priceList.length && {priceList}),
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

                    const imagesToProductsPayload: payloadInterface = {
                        channel: 'db',
                        api: 'db',
                        act: 'rem',
                        payload: {
                            channel: 'system',
                            data: {
                                what: 'images_to_products',
                                how: 'OR',
                                where: {
                                    product_id: params.id,
                                }
                            }
                        }
                    }

                    const deletedImages = await this.protocolService.sendMessage(imagesToProductsPayload).toPromise();

                    subscriber.next({
                        success: "The product/s deleted",
                        data: { deletedImages }
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