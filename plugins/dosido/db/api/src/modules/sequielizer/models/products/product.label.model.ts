import {Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class ProductLabel extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Index
    @Column
    value: string;

    @Column
    description: string;

    @Column({type: DataTypes.SMALLINT})
    type: number;

    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;
}