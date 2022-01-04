import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
    timestamps: false
})
export class PageConfig extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Column({type: DataTypes.TEXT})
    data: string;

}