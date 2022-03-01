import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class LegModule extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Departure airport code*/
    @Column
    From: string;

    /*Destination airport code*/
    @Column
    To: string;

    /*Departure date & time, local to the departure airport*/
    @Column({type: DataTypes.DATE, allowNull: true})
    Departure: number;

    /*Arrival date & time, local to the destination airport*/
    @Column({type: DataTypes.DATE, allowNull: true})
    Arrival: number;

    /*Airline code as shown on the ticket*/
    @Column
    Airline: string;

    /*Flight number*/
    @Column
    FlightNo: string;

    /*Airline booking class for the flight, one-letter code*/
    @Column
    Class: string;

    /*Departure terminal, if available*/
    @Column
    DepTerminal: string;

    /*Arrival terminal, if available*/
    @Column
    ArrTerminal: string;

    /*Departure gate, if available*/
    @Column
    DepGate: string;

    /*Arrival gate, if available*/
    @Column
    ArrGate: string;

    /*Text representation of the total flight time of the leg, in the
format hh:mm (hours, minutes)
*/
    @Column
    FlightTime: string;

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