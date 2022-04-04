import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class BookingOptionHotel extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*0-based index of the meal plan*/
  @Column
  MealPlanIndex: number;

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
