import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class RoomCategoryModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Category name*/
    @Column
    Name: string;

    /*Category description, free-text*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    Description: string;

    /*Collection of image files, to be displayed on the website*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    Images: string;

    /**/
    @Column({type: DataTypes.SMALLINT})
    active: number;

    /**/
    @Column({type: DataTypes.DATE, allowNull: true})
    accessedAt: number;

    /**/
    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    /**/
    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;

}