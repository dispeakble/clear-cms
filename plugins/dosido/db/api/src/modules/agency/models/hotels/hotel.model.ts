import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class HotelModel extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Identifies the source of the hotel when
retrieved from a 3rd party XML, null
otherwise*/
    @Column
    Source: string;

    /*Identifies the 3rd party id of the hotel when
retrieved from a 3rd party XML, null
otherwise*/
    @Column
    SourceId: number;

    /*Hotel code; used mainly internally by the
system*/
    @Column
    Code: string;

    /*Full name of the hotel*/
    @Column
    Name: string;

    /*Hotel rating in number of stars; currently
half-star classifications for hotels are not
supported*/
    @Column
    Class: number;

    /*Hotel description, free-text*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    Description: string;

    /*Optional, free-text description to be
displayed on the website*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    WebDescription: string;

    /*Hotel address*/
    @Column
    Address: string;

    /*ZIP code*/
    @Column
    ZIP: string;

    /*Phone number*/
    @Column
    Phone: string;

    /*Fax number*/
    @Column
    Fax: string;

    /*Hotel location, ID of the geography node
this hotel is directly tied to*/
    @Column
    Location: number;

    /*URL address for the hotel’s website, where
available*/
    @Column
    URL: string;

    /*Geographical coordinates of the hotel*/
    @Column({type: DataTypes.FLOAT})
    Latitude: number;

    /*Geographical coordinates of the hotel*/
    @Column({type: DataTypes.FLOAT})
    Longitude: number;

    /*List of room categories defied for this hotel*/
    @Column
    RoomCategories: string;

    /*Collection of image files, to be displayed on the website*/
    @Column
    Images: string;

    /*Detailed description of the hotel, split into sections*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    DetailedDescriptions: string;

    /*Hotel theme information*/
    @Column
    HotelTheme: string;

    /*Hotel amenities*/
    @Column
    HotelAmenities: string;

    /*Room amenities*/
    @Column
    RoomAmenities: string;

    /*Free-text description of the hotel class –
useful for fractional classes (4.5 stars)
where Class is not sufficient*/
    @Column
    ExtraClass: string;

    /*The hotel appears as on sale for
HotelSearch operations*/
    @Column({type: DataTypes.SMALLINT})
    UseIndividually: number;

    /*The hotel appears as on sale for
PackageSearch operations*/
    @Column({type: DataTypes.SMALLINT})
    UseOnPackages: number;

    /*Type of property (eg hotel / villa / chalet)*/
    @Column
    PropertyType: string;

    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Column({type: DataTypes.DATE, allowNull: true})
    accessedAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

}