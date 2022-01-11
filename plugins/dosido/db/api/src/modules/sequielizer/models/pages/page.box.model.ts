import {Column, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
    timestamps: false
})
export class PageBox extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Column
    title: string;

    @Column
    module: string;

    @Column({type: DataTypes.TEXT})
    data: string;

    @Column({type: DataTypes.TEXT})
    moduleOptions: string;

}