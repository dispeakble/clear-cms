import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {Page} from "./page.model";
import {PageToConfig} from "./page.to.config.model";

@Table({
    timestamps: false
})
export class PageConfig extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Column({type: DataTypes.TEXT})
    data: string;

    @BelongsToMany(() => Page, () => PageToConfig)
    pages: Page[];

}