import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {QueryService} from "../../services/query.service";
import {MainService} from "./services/main.service";

import {AdminTheme} from "./models/admin/admin.theme.model";
import {Auth} from "./models/admin/auth.model";
import {DashboardBox} from "./models/admin/dashboard.box.model";
import {Setting} from "./models/admin/setting.model";
import {Category} from "./models/general/category.model";
import {PublicTheme} from "./models/general/public.theme.model";
import {User} from "./models/general/user.model";
import {PageBox} from "./models/pages/page.box.model";
import {PageConfig} from "./models/pages/page.config.model";
import {Page} from "./models/pages/page.model";
import {PageToBox} from "./models/pages/page.to.box.model";
import {PageToCategory} from "./models/pages/page.to.category.model";
import {PageToConfig} from "./models/pages/page.to.config.model";
import {Token} from "./models/general/token.model";

@Module({
    imports: [
        SequelizeModule.forFeature([

            //admin
            AdminTheme,
            Auth,
            DashboardBox,
            Setting,

            //general
            Category,
            PublicTheme,
            Token,
            User,

            //pages
            PageBox,
            PageConfig,
            Page,
            PageToBox,
            PageToCategory,
            PageToConfig,
        ], `main`),
    ],
    providers: [MainService, QueryService],
    exports: [MainService]
})
export class MainModule {
}