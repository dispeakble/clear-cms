import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {SqlService} from "./services/sql.service";
import {User} from "./models/user.model";

@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [SqlService],
    exports: [SqlService]
})
export class SqlModule {
}