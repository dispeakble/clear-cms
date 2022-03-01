import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class PriceInfoModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Gross price of the result*/
    @Column({type: DataTypes.FLOAT})
    Gross: number;

    /*Commission reserved for the agent*/
    @Column({type: DataTypes.FLOAT})
    Commission: number;

    /*Value Added Tax amount*/
    @Column({type: DataTypes.FLOAT})
    VAT: number;

    /*Non-commissionable tax*/
    @Column({type: DataTypes.FLOAT})
    Tax: number;

    /**/
    @Column({type: DataTypes.DATE, allowNull: true})
    accessedAt: number;

    /**/
    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    /**/
    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

}