import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {SqlService} from "./services/sql.service";
import {AdminTheme} from "./models/admin/admin.theme.model";
import {Auth} from "./models/admin/auth.model";
import {DashboardBox} from "./models/admin/dashboard.box.model";
import {Setting} from "./models/admin/setting.model";
import {Category} from "./models/general/category.model";
import {Locality} from "./models/general/locality.model";
import {PublicTheme} from "./models/general/public.theme.model";
import {User} from "./models/general/user.model";
import {PageBox} from "./models/pages/page.box.model";
import {PageConfig} from "./models/pages/page.config.model";
import {Page} from "./models/pages/page.model";
import {PageToBox} from "./models/pages/page.to.box.model";
import {PageToCategory} from "./models/pages/page.to.category.model";
import {PageToConfig} from "./models/pages/page.to.config.model";
import {ProductLabel} from "./models/products/product.label.model";
import {Product} from "./models/products/product.model";
import {ProductToCategory} from "./models/products/product.to.category.model";
import {ProductImage} from "./models/products/product.image.model";
import {ProductToLabel} from "./models/products/product.to.label.model";
import {ProductToLocality} from "./models/products/product.to.locality.model";
import {ProductPrice} from "./models/products/product.price.model";
import {ProductCurrency} from "./models/products/currency.model";

@Module({
    imports: [SequelizeModule.forFeature([

        //admin
        AdminTheme,
        Auth,
        DashboardBox,
        Setting,

        //general
        Category,
        Locality,
        PublicTheme,
        User,

        //pages
        PageBox,
        PageConfig,
        Page,
        PageToBox,
        PageToCategory,
        PageToConfig,

        //products
        ProductLabel,
        Product,
        ProductToCategory,
        ProductImage,
        ProductToLabel,
        ProductToLocality,
        ProductPrice,
        ProductCurrency,

    ])],
    providers: [SqlService],
    exports: [SqlService]
})
export class SqlModule {
}