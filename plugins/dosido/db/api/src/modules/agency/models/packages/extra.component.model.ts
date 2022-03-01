import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class ExtraComponentModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Name of the extra service*/
    @Column
    Label: string;

    /*Short description*/
    @Column({type: DataTypes.TEXT, allowNull: true})
    Description: string;

    /*Price to be paid for the additional services */
    @Column({type: DataTypes.FLOAT})
    Price: number;

    /*True if the service is not already included in the package price,
false otherwise*/
    @Column({type: DataTypes.SMALLINT})
    IsOptional: number;
    
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