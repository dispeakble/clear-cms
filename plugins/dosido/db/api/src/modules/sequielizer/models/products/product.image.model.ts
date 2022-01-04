import {Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
    timestamps: false
})
export class ProductImage extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    productId: number;

    @Column
    imageId: number;

    @Column
    title: string;

    @Column
    extension: string;

    @Index
    @Column({type: DataTypes.SMALLINT})
    position: number;

    @Column({type: DataTypes.SMALLINT})
    active: number;
}