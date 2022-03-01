import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class MealPlanModel extends Model {
    /**/
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    Id: number;

    /*Meal plan label
*/
    @Column
    Label: string;

    /*Price details for this component*/
    @Column
    Price: string;
    
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