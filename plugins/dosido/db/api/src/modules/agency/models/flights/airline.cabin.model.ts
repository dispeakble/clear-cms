import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class AirlineCabinModel extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*possible values: "Economy class", "Premium Economy class", "Business class", "First class"*/
    @Column
    Label: string;

    @Column({type: DataTypes.TEXT, allowNull: true})
    Description: string;

    @Column({type: DataTypes.DATE, allowNull: true})
    accessedAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

}