import { Column, Index, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Index
  @Column
  fname: string;

  @Index
  @Column
  lname: string;

  @Index
  @Column
  email: string;

  @Column
  password: string;

  /*warning: since there is a bug with alter on sync, we are going to use number instead. leaving as example: {
        allowNull: false,
        defaultValue: 'Client',
        type: DataTypes.ENUM, values: [
            'Admin',
            'Manager',
            'Moderator',
            'Client'
        ]
    }*/

  @Column({
    allowNull: false,
    defaultValue: 4,
    type: DataTypes.SMALLINT,
  })
  type: number;

  @Index
  @Column
  active: number;

  @Column({ type: DataTypes.DATE, allowNull: true })
  accessedAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;
}
