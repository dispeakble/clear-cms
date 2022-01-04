import {BelongsToMany, Column, ForeignKey, HasOne, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {ProductToCategory} from "../products/product.to.category.model";
import {Product} from "../products/product.model";
import {Page} from "../pages/page.model";
import {PageToCategory} from "../pages/page.to.category.model";
import {PageBox} from "../pages/page.box.model";

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

    @BelongsToMany(() => Product, () => ProductToCategory)
    products: Product[];

    @BelongsToMany(() => Page, () => PageToCategory)
    pages: Page[];


}