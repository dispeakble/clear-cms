import {BelongsTo, Column, ForeignKey, HasMany, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {Product} from "./product.model";
import {ProductCurrency} from "./currency.model";

@Table
export class ProductPrice extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Index
    @ForeignKey(() => ProductCurrency)
    @Column
    currency: number;

    @Column
    value: number;

    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

    @BelongsTo(() => Product)
    product: Product

}