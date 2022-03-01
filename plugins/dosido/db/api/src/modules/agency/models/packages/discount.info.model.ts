import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class DiscountInfoModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Short description*/
    @Column
    Label: string;

    /*Long description*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    Text: string;

    /*Booking dates interval the discount is valid for (can be open-ended on either side)*/
    @Column({type: DataTypes.DATE})
    BookingFrom: number;

    /*Booking dates interval the discount is valid for (can be open-ended on either side)*/
    @Column({type: DataTypes.DATE})
    BookingTo: number;

    /*Travel dates interval the discount is valid for (can be open-ended on either side)*/
    @Column({type: DataTypes.DATE})
    TravelFrom: number;

    /*Travel dates interval the discount is valid for (can be open-ended on either side)*/
    @Column({type: DataTypes.DATE})
    TravelTo: number;

    /*Discount as percentage*/
    @Column({type: DataTypes.DATE})
    Percent: number;

    /*Dscount as value*/
    @Column({type: DataTypes.FLOAT})
    Value: number;
    
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