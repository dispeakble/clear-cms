import {Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
    timestamps: false
})
export class ProductCurrency extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Index
    @Column
    label: string;

    @Index
    @Column
    symbol: string;

    @Column({type: DataTypes.SMALLINT})
    active: number;
}