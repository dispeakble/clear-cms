import {BelongsToMany, Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {PageBox} from "./page.box.model";
import {PageToBox} from "./page.to.box.model";
import {PageConfig} from "./page.config.model";
import {PageToConfig} from "./page.to.config.model";
import {PageToCategory} from "./page.to.category.model";
import {Category} from "../general/category.model";

@Table
export class Page extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Index
    @Column
    link: string;

    @Column({type: DataTypes.SMALLINT})
    isHome: number;

    @Index
    @Column({type: DataTypes.SMALLINT})
    isTemplate: number;

    @Index
    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

    @BelongsToMany(() => Category, () => PageToCategory)
    categories: Category[];

    @BelongsToMany(() => PageBox, () => PageToBox)
    pageBoxes: PageBox[];

    @BelongsToMany(() => PageConfig, () => PageToConfig)
    pageConfig: PageConfig[]
}