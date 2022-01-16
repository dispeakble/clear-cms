import {Injectable} from '@nestjs/common';
import {Op} from "sequelize";
import {Observable} from "rxjs";
import {InjectModel} from "@nestjs/sequelize";
import {Locality} from "../models/general/locality.model";
import {PageBox} from "../models/pages/page.box.model";
import {PageConfig} from "../models/pages/page.config.model";
import {Page} from "../models/pages/page.model";
import {PageToBox} from "../models/pages/page.to.box.model";
import {PageToCategory} from "../models/pages/page.to.category.model";
import {PageToConfig} from "../models/pages/page.to.config.model";
import {ProductLabel} from "../models/products/product.label.model";
import {Product} from "../models/products/product.model";
import {ProductToCategory} from "../models/products/product.to.category.model";
import {ProductImage} from "../models/products/product.image.model";
import {ProductToLabel} from "../models/products/product.to.label.model";
import {ProductToLocality} from "../models/products/product.to.locality.model";
import {ProductPrice} from "../models/products/product.price.model";
import {ProductCurrency} from "../models/products/currency.model";
import {AdminTheme} from "../models/admin/admin.theme.model";
import {DashboardBox} from "../models/admin/dashboard.box.model";
import {Setting} from "../models/admin/setting.model";
import {Category} from "../models/general/category.model";
import {PublicTheme} from "../models/general/public.theme.model";
import {Auth} from "../models/admin/auth.model";
import {User} from "../models/general/user.model";

@Injectable()
export class SqlService {
    private methods = ["list", "get", "add", "addBulk", "set", "rem"];

    constructor(

        //admin
        @InjectModel(AdminTheme) private adminThemeModel: AdminTheme,
        @InjectModel(Auth) private authModel: Auth,
        @InjectModel(DashboardBox) private dashboardBoxModel: DashboardBox,
        @InjectModel(Setting) private settingModel: Setting,

        //general
        @InjectModel(Category) private categoryModel: Category,
        @InjectModel(Locality) private localityModel: Locality,
        @InjectModel(PublicTheme) private publicThemeModel: PublicTheme,
        @InjectModel(User) private userModel: User,

        //pages
        @InjectModel(PageBox) private pageBoxModel: PageBox,
        @InjectModel(PageConfig) private pageConfigModel: PageConfig,
        @InjectModel(Page) private pageModel: Page,
        @InjectModel(PageToBox) private pageToBoxModel: PageToBox,
        @InjectModel(PageToCategory) private pageToCategoryModel: PageToCategory,
        @InjectModel(PageToConfig) private pageToConfigModel: PageToConfig,

        //products
        @InjectModel(ProductLabel) private productLabelModel: ProductLabel,
        @InjectModel(Product) private productModel: Product,
        @InjectModel(ProductToCategory) private productToCategoryModel: ProductToCategory,
        @InjectModel(ProductImage) private productToImageModel: ProductImage,
        @InjectModel(ProductToLabel) private productToLabelModel: ProductToLabel,
        @InjectModel(ProductToLocality) private productToLocalityModel: ProductToLocality,
        @InjectModel(ProductPrice) private productToPriceModel: ProductPrice,
        @InjectModel(ProductCurrency) private productCurrency: ProductCurrency,


    ) { }

    /*convertDateToUnix(data) {
        const keys = Object.keys(data);
        keys.map(key => {

            if(data[key] instanceof Date) {
                data[key] = moment(data[key]).unix();
            }
        });

        return data;
    }*/

    private convertInclude(params: any[]) {

        const includes = params.map((incl) => {

            const result = {...incl};
            const model = this[`${incl.model}Model`];

            if(!model) {
                return null;
            }

            result.model = model;

            if(result['through']) {
                result.through = this[`${incl.through}Model`];
            }

            if(result.where) {
                result.where = this.convertWhereOp(result.where);
            }

            return result;
        });

        return includes;

    }

    private convertWhereOp(params: any) {
        //ex: {where: {name:{'LIKE':'%abc%'}}}
        //ex: {where: {name:{'OR':[{name: {'LIKE': '%abc%'}}, {active: 1}]}}}
        //ex: {where: {id:[1,2,3,4]} //will be 1 OR 2 OR ...
        const result = {};

        if("object" !== typeof params || Array.isArray(params)) {
            return params;
        }

        Object.keys(params).map(key => {

            if(params[key] instanceof Array) {
                params[key] = params[key].map(val => this.convertWhereOp(val));
            } else if("object" === typeof params[key]) {
                params[key] = this.convertWhereOp(params[key]);
            }

            if(Op.hasOwnProperty(key)) {
                result[Op[key]] = params[key];
            } else {
                result[key] = params[key];
            }

        })

        return result;
    }

    list(params: any) {
        return new Observable(subscriber => {
            (async () => {

                if(undefined === params.data.count) {
                    params.data.count = true;
                }

                const model = this[`${params.data.what}Model`];

                if(!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if (params.data.fields) {
                    payload.attributes = params.data.fields;
                }

                if(params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                if(params.data.order) {
                    const orderArray = [];

                    Object.keys(params.data.order).map(key => {
                        orderArray.push([key, params.data.order[key]]);
                    });

                    payload.order = orderArray;
                }

                if (params.data.limit) {
                    payload.limit = params.data.limit[1];
                    payload.offset = params.data.limit[0];
                }

                if(params.data.include) {
                    payload.include = this.convertInclude(params.data.include);
                }

                try {
                    let result = null;
                    if(params.data.count) {
                        result = await model.findAndCountAll(payload);
                    } else {
                        result = await model.findAll(payload);
                    }

                    //will receive {count: Number, rows: []}
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    console.log(payload);
                    subscriber.error(err.message);
                    subscriber.complete();
                }

            })()
        });

    }

    get(params: any) {
        return new Observable(subscriber => {
            (async () => {
                const model = this[`${params.data.what}Model`];

                if(!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if (params.data.fields) {
                    payload.attributes = params.data.fields;
                }

                if(params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                if(params.data.order) {
                    const orderArray = [];

                    Object.keys(params.data.order).map(key => {
                        orderArray.push([key, params.data.order[key]]);
                    });

                    payload.order = orderArray;
                }

                if(params.data.include){
                    payload.include = this.convertInclude(params.data.include);
                }

                try {
                    const result = await model.findOne(payload);
                    //will receive the requested fields
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    console.log(payload);
                    subscriber.error(err.message);
                    subscriber.complete();
                }

            })()
        });

    }

    add(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const model = this[`${params.data.what}Model`];

                    if(!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const result = await model.create(params.data.data);

                    subscriber.next(result.dataValues);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }
            })();
        });
    }

    addBulk(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const model = this[`${params.data.what}Model`];

                    if(!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const result = await model.bulkCreate(params.data.records, {
                        returning: params.data.returning || false,
                        validate: params.data.validate || false,
                        fields: params.data.fields,
                        ignoreDuplicates: params.data.ignoreDuplicates || false
                    });

                    subscriber.next(params.data.returning ? result.map(res => { return res.dataValues }) : true);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }
            })();
        });
    }

    set(params: any) {
        return new Observable(subscriber => {
            (async () => {
                try {
                    const model = this[`${params.data.what}Model`];

                    if(!model) {
                        subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                        subscriber.complete();
                        return;
                    }

                    const where = this.convertWhereOp(params.data.where);

                    const result = await model.update(params.data.data, {where: where});

                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }
            })();
        });
    }

    rem(params: any) {
        return new Observable(subscriber => {
            (async () => {
                const model = this[`${params.data.what}Model`];

                if(!model) {
                    subscriber.error(`Model ${params.data.what} not found. Please define it.`);
                    subscriber.complete();
                    return;
                }

                const payload: any = {};

                if(params.data.where) {
                    payload.where = this.convertWhereOp(params.data.where);
                }

                try {
                    const result = await model.destroy(payload);
                    subscriber.next(result);
                    subscriber.complete();
                } catch (err) {
                    subscriber.error(err.message);
                    subscriber.complete();
                }

            })()
        });
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload);
        } else {
            console.log("DB.sqlService." + data.act + " not found");
        }
        return null;
    }

}
