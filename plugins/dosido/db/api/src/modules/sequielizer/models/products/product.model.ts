import {BelongsToMany, Column, HasMany, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {Category} from "../general/category.model";
import {ProductToCategory} from "./product.to.category.model";
import {ProductLabel} from "./product.label.model";
import {ProductToLabel} from "./product.to.label.model";
import {Locality} from "../general/locality.model";
import {ProductToLocality} from "./product.to.locality.model";
import {ProductPrice} from "./product.price.model";

@Table
export class Product extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Index
    @Column
    description: string;

    @Index
    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

    @BelongsToMany(() => Category, () => ProductToCategory)
    categories: Category[];

    @BelongsToMany(() => ProductLabel, () => ProductToLabel)
    labels: ProductLabel[];

    @BelongsToMany(() => Locality, () => ProductToLocality)
    localities: Locality[];

    @HasMany(() => ProductPrice)
    prices: ProductPrice[]

}