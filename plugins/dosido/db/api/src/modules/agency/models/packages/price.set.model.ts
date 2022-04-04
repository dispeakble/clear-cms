import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class PriceSet extends Model {
  /**/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Price set label
   */
  @Column
  Label: string;

  /**/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  Description: string;

  /*First booking date the price is valid for (null
means no lower limit)*/
  @Column({ type: DataTypes.DATE })
  ValidFrom: number;

  /*Last booking date the price is valid for (null
means no upper limit)*/
  @Column({ type: DataTypes.DATE })
  ValidTo: number;

  /*First travel date the price is valid for (null
means no lower limit)
*/
  @Column({ type: DataTypes.DATE })
  TravelFrom: number;

  /*Last travel date the price is valid for (null means
no upper limit)
*/
  @Column({ type: DataTypes.DATE })
  TravelTo: number;

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
