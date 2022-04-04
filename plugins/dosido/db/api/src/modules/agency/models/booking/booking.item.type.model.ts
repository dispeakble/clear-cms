import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class BookingItemType extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Manual item or unknown type*/
  @Column
  other: string;

  /*Package*/
  @Column
  package: string;

  /*Bus transport*/
  @Column
  bus: string;

  /*Flight transport*/
  @Column
  flight: string;

  /*Bus transfer*/
  @Column
  transfer: string;

  /*Hotel / Accommodation*/
  @Column
  hotel: string;

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
