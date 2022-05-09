import { Column, HasOne, Index, Model, Sequelize, Table } from "sequelize-typescript";
import { DataTypes } from 'sequelize';
import { Geography } from "../geography/geography.model";

@Table
export class FlightsCache extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    })
    Id: number;

    /*Departure*/
    @Index
    @Column
    Departure: number;

    /*Destination*/
    @Index
    @Column
    Destination: number;

    /*Departure date*/
    @Column({ type: DataTypes.DATE })
    DepartureDate: string;

    /*Return date*/
    @Column({ type: DataTypes.DATE })
    ReturnDate: string;

    /*One Way*/
    @Column({ type: DataTypes.BOOLEAN })
    IsOneWay: boolean;

    @Column({ type: DataTypes.DATE, allowNull: true })
    accessedAt: number;

    @Column({ type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') })
    createdAt: number;

    @Column({ type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') })
    updatedAt: number;

    @HasOne(() => Geography, {sourceKey: 'Departure', foreignKey: 'Id', constraints: false})
    DeparturesGeography: Geography;

    @HasOne(() => Geography, {sourceKey: 'Destination', foreignKey: 'Id', constraints: false})
    DestinationGeography: Geography;

}
