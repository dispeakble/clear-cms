import { BelongsTo, BelongsToMany, Column, ForeignKey, HasOne, Model, Sequelize, Table } from "sequelize-typescript";
import { DataTypes } from 'sequelize';
import { PackagesCache } from "../search/packages.cache.model";

@Table
export class Geography extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Geography entry’s label; e.g. “Europe”, “United Kingdom”,
or “London”*/
  @Column
  Name: string;

  /*Geography entry’s international name*/
  @Column
  IntName: string;

  /*A one-word description of the type of entities directly
subjacent; e.g. “Country” for a continent’s entry, or
“Region” for a country’s entry*/
  @Column
  ChildLabel: string;

  /*Optional, a free-text description of the current entry; this
can contain a human-readable description of the entry that
can be used in web pages*/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  Description: string;

  /*Optional, an image file, usually containing the country’s flag*/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  Image: string;

  /*A list of all child entities*/
  @Column
  ParentId: number;

  @Column({ type: DataTypes.SMALLINT })
  active: number;

  @Column({ type: DataTypes.DATE, allowNull: true })
  accessedAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')})
  createdAt: number;

  @Column({ type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')})
  updatedAt: number;

  @BelongsTo(() => PackagesCache, { foreignKey: 'Id', targetKey: 'Departure', constraints: false})
  PackagesCacheDeparture: PackagesCache

  @BelongsTo(() => PackagesCache, { foreignKey: 'Id', targetKey: 'Destination', constraints: false})
  PackagesCacheDestination: PackagesCache

}
