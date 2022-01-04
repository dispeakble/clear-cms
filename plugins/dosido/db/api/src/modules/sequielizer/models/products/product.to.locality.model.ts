import {Column, ForeignKey, Index, Model, Table} from "sequelize-typescript";
import {Product} from "./product.model";
import {Locality} from "../general/locality.model";

@Table({
    timestamps: false
})
export class ProductToLocality extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Index
    @ForeignKey(() => Locality)
    @Column
    localityId: number;
}