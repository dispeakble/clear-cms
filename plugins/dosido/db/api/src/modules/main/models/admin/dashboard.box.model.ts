import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
    timestamps: false
})
export class DashboardBox extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Column
    title: string;

    @Column
    module: string;

    @Column({type: DataTypes.SMALLINT})
    fontSize: number;

    @Column
    fontFamily: string;

    @Column
    textColor: string;

    @Column({type: DataTypes.SMALLINT})
    borderWidth: number;

    @Column
    borderColor: string;

    @Column({type: DataTypes.SMALLINT})
    borderRadius: number;

    @Column
    bgColor: string;

    @Column({type: DataTypes.SMALLINT})
    width: number;

    @Column({type: DataTypes.SMALLINT})
    height: number;

    @Column({type: DataTypes.TEXT})
    moduleOptions: number;

    @Column({type: DataTypes.SMALLINT})
    x: number;

    @Column({type: DataTypes.SMALLINT})
    y: number;

    @Column({type: DataTypes.SMALLINT})
    scrollbars: number;

}