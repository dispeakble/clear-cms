import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class BookingItemStatus extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*possible values: "not requested", "requested', "confirmed", "not confirmed", "cancelled"*/
  /*
    "not requested" - Supplier confirmation not yet requested, an operator will send
    a manual request email to the supplier before this changes
    "requested" - Supplier confirmation has been requested but a response has
    not yet been received
    "confirmed" - Supplier confirmation received
    not confirmed Supplier rejected the confirmation request
    "cancelled" - Item has been cancelled, supplier has been informed
    * */
  @Column
  Label: string;

  @Column({ type: DataTypes.DATE, allowNull: true })
  accessedAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;
}
