import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {PageBox} from "../models/pages/page.box.model";
import {PageConfig} from "../models/pages/page.config.model";
import {Page} from "../models/pages/page.model";
import {PageToBox} from "../models/pages/page.to.box.model";
import {PageToCategory} from "../models/pages/page.to.category.model";
import {PageToConfig} from "../models/pages/page.to.config.model";
import {AdminTheme} from "../models/admin/admin.theme.model";
import {DashboardBox} from "../models/admin/dashboard.box.model";
import {Setting} from "../models/admin/setting.model";
import {Category} from "../models/general/category.model";
import {PublicTheme} from "../models/general/public.theme.model";
import {Auth} from "../models/admin/auth.model";
import {User} from "../models/general/user.model";
import {QueryService} from "../../../services/query.service";

@Injectable()
export class MainService {
    constructor(

        //admin
        @InjectModel(AdminTheme, 'main') private adminThemeModel: AdminTheme,
        @InjectModel(Auth, 'main') private authModel: Auth,
        @InjectModel(DashboardBox, 'main') private dashboardBoxModel: DashboardBox,
        @InjectModel(Setting, 'main') private settingModel: Setting,

        //general
        @InjectModel(Category, 'main') private categoryModel: Category,
        @InjectModel(PublicTheme, 'main') private publicThemeModel: PublicTheme,
        @InjectModel(User, 'main') private userModel: User,

        //pages
        @InjectModel(PageBox, 'main') private pageBoxModel: PageBox,
        @InjectModel(PageConfig, 'main') private pageConfigModel: PageConfig,
        @InjectModel(Page, 'main') private pageModel: Page,
        @InjectModel(PageToBox, 'main') private pageToBoxModel: PageToBox,
        @InjectModel(PageToCategory, 'main') private pageToCategoryModel: PageToCategory,
        @InjectModel(PageToConfig, 'main') private pageToConfigModel: PageToConfig,

        //services
        @Inject('QueryService') private queryService: QueryService

    ) { }

    public getModel(modelName: string) {
        return this[`${modelName}Model`];
    }


    public perform(data: any) {
        try {
            return this.queryService[data.act]({getModel: (modelName) => this.getModel(modelName), ...data.payload});
        } catch (err) {
            return null;
        }
    }

}
