import {Column, ForeignKey, Index, Model, Table} from "sequelize-typescript";
import {Product} from "./product.model";
import {ProductLabel} from "./product.label.model";

@Table({
    timestamps: false
})
export class ProductToLabel extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Index
    @ForeignKey(() => ProductLabel)
    @Column
    labelId: number;
}