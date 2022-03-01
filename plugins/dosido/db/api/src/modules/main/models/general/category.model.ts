import {BelongsToMany, Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {Page} from "../pages/page.model";
import {PageToCategory} from "../pages/page.to.category.model";

@Table
export class Category extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Column({type: DataTypes.TEXT})
    description: string;

    @Column
    backgroundImage: string;

    @Column
    parentId: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

    @BelongsToMany(() => Page, () => PageToCategory)
    pages: Page[];


}