import {BelongsToMany, Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {Product} from "../products/product.model";
import {ProductToLocality} from "../products/product.to.locality.model";

@Table
export class Locality extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Index
    @Column
    country: number;

    @Index
    @Column
    gps: string;

    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

    @BelongsToMany(() => Product, () => ProductToLocality)
    products: Product[];

}