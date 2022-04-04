import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class SpecialOffer extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Special offer unique code*/
  @Column
  Code: string;

  /*Short description*/
  @Column
  Label: string;

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
