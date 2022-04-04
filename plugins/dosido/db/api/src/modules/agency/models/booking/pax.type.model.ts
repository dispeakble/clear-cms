import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class PaxType extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*possible values: ADT, CHD, INF*/
  /*
    "ADT" - Adult
    "CHD" - Child
    "INF" - Infant
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
