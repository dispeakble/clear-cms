import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class BookingOptionPackageModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*List of extra components to be booked with the package*/
    @Column
    ExtraComponents: string;

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