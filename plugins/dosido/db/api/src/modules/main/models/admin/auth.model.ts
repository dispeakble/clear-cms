import {Column, Index, Model, Table} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class Auth extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  fname: string;

  @Column
  lname: string;

  @Column
  fullname: string;

  @Column
  email: string;

  @Column
  address: string;

  @Column
  password: string;

  @Column
  active: number;

  @Column
  refresh_token: string;

  @Column({ type: DataTypes.DATE, allowNull: true })
  accessedAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;
}
