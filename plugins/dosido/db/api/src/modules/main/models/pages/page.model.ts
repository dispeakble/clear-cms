import {
  BelongsToMany,
  Column,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { PageToBox } from './page.to.box.model';
import { PageBox } from './page.box.model';
import { Category } from '../general/category.model';
import { PageToCategory } from './page.to.category.model';
import { PageConfig } from './page.config.model';
import { PageToConfig } from './page.to.config.model';

@Table
export class Page extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Index
  @Column
  title: string;

  @Index
  @Column
  link: string;

  @Index
  @Column({ type: DataTypes.SMALLINT })
  isHome: number;

  @Index
  @Column({ type: DataTypes.SMALLINT })
  isTemplate: number;

  @Index
  @Column
  templateId: number;

  @Index
  @Column({ type: DataTypes.SMALLINT })
  active: number;

  @Index
  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  createdAt: number;

  @Index
  @Column({ type: DataTypes.DATE, defaultValue: DataTypes.NOW })
  updatedAt: number;

  @BelongsToMany(() => PageBox, () => PageToBox)
  boxes: PageBox[];

  @BelongsToMany(() => Category, () => PageToCategory)
  categories: Category[];

  @BelongsToMany(() => PageConfig, () => PageToConfig)
  pageConfig: PageConfig[];
}
