import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class BookingOptionFlight extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*0-based index of the outbound flight to be selected*/
  @Column
  OutboundIndex: number;

  /*0-based index of the inbound flight to be selected*/
  @Column
  InboundIndex: number;

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
