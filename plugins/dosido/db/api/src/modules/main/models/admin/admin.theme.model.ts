import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class AdminTheme extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  title: string;

  @Column({ type: DataTypes.SMALLINT })
  isDefault: number;

  @Column({ type: DataTypes.TEXT })
  data: string;

  @Column({ type: DataTypes.TEXT })
  thumbnail: string;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;
}
