import {Column, ForeignKey, Index, Model, Table} from "sequelize-typescript";
import {Product} from "./product.model";
import {Category} from "../general/category.model";

@Table({
    timestamps: false
})
export class ProductToCategory extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Index
    @ForeignKey(() => Category)
    @Column
    categoryId: number;
}