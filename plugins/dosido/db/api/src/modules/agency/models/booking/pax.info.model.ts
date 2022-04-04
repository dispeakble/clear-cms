import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class PaxInfo extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Title*/
  @Column
  Title: string;

  /*First name*/
  @Column
  FirstName: string;

  /*Last name*/
  @Column
  LastName: string;

  /*Passenger type, adult/child*/
  @Column
  Type: string;

  /*Birthdate*/
  @Column({ type: DataTypes.DATE })
  BirthDate: string;

  /**/
  @Column
  Gender: string;

  /**/
  @Column({ type: DataTypes.DATE, allowNull: true })
  accessedAt: number;

  /**/
  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  /**/
  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;
}
