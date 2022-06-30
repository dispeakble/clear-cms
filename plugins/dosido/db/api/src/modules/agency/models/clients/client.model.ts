import { Column, Index, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class Client extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Index
  @Column
  firstName: string;

  @Index
  @Column
  lastName: string;

  @Index
  @Column
  email: string;

  @Column
  password: string;

  @Index
  @Column
  active: number;

  @Index
  @Column
  refresh_token: string;

  @Column({ type: DataTypes.DATE, allowNull: true })
  accessedAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;
}
