import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class BookingModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Booking reference number*/
    @Column
    Reference: number;

    /*Booking creation date and time*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    Created: string;

    /*Starting date for the itinerary*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    StartDate: string;

    /*End date for the itinerary*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    EndDate: string;

    /*Balance due date*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    BalanceDueDate: string;

    /*Invoice currency*/
    @Column
    InvoiceCurrency: string;

    /*Total booking price*/
    @Column
    Price: string;

    /*List of individual items in the booking*/
    @Column
    Items: string;

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