import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class PackageInfo extends Model {
  /*Identifier*/
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  Id: number;

  /*Package name*/
  @Column
  Name: string;

  /*Package is of type tour, includes multiple destinations*/
  @Column({ type: DataTypes.SMALLINT })
  IsTour: number;

  /*Package is of type bus*/
  @Column({ type: DataTypes.SMALLINT })
  IsBus: number;

  /*Package is of type flight*/
  @Column({ type: DataTypes.SMALLINT })
  IsFlight: number;

  /*3 letter code of main package currency (eg EUR)*/
  @Column
  Currency: string;

  /*Number of nights (accommodation) included in the
package*/
  @Column
  Duration: number;

  /*No of nights between departure date to checkin date*/
  @Column
  OutboundTransportDuration: number;

  /*Description of the package*/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  Description: string;

  /*Description of services included in the package price*/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  IncludedServices: string;

  /*Description of optional services not included in the
package price*/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  NotIncludedServices: string;

  /*Id of the geography entry that represents the
package destination – same as hotel geographical
location*/
  @Column
  Destination: number;

  /*String representing the source of hotels for 3rd party*/
  @Column
  HotelSource: number;

  /*Hotel Id*/
  @Column
  Hotel: number;

  /*List of allowed departure dates*/
  @Column
  DepartureDates: string;

  /*List of Geography identifiers, allowed points of
departure*/
  @Column
  DeparturePoints: string;

  /*List of available price sets*/
  @Column
  PriceSets: string;

  /*Detailed description, split into sections*/
  @Column({ type: DataTypes.TEXT, allowNull: true })
  DetailedDescriptions: string;

  /*“standard”, “special offer”, “early booking”, “last
minute” – any combination of the above*/
  @Column
  FareType: string;

  /**/
  @Column({ type: DataTypes.SMALLINT })
  active: number;

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
