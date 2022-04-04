import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { PageToBox } from './page.to.box.model';
import { Page } from './page.model';

@Table({
  timestamps: false,
})
export class PageBox extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  title: string;

  @Column
  module: string;

  @Column({ type: DataTypes.TEXT })
  data: string;

  @Column({ type: DataTypes.TEXT })
  moduleOptions: string;

  @BelongsToMany(() => Page, () => PageToBox)
  pages: Page[];
}
