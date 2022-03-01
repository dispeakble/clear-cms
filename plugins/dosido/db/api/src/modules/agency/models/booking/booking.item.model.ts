import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class BookingItemModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Type of the booking item*/
    @Column
    Type: number;

    /*Status of the booking item*/
    @Column
    Status: number;

    /*Short description*/
    @Column
    Label: number;

    /*Full description*/
    @Column
    Description: number;

    /**/
    @Column({type: DataTypes.TEXT, allowNull: true})
    StartDate: string;

    /**/
    @Column({type: DataTypes.TEXT, allowNull: true})
    EndDate: string;

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