import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class Room extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Number of adults assigned to this room*/
  @Column
  Adults: number;

  /*List of ages for all children assigned to this room*/
  @Column
  ChildAges: string;

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
