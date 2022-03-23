import {Column, Model,ForeignKey, Table, Index} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {User} from "./user.model";

@Table
export class Token extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @ForeignKey(() => User)
    @Index
    @Column
    userId: number

    @Column
    token: string;

    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;
}