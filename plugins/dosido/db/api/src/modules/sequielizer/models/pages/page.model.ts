import {Column, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table
export class Page extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    title: string;

    @Index
    @Column
    link: string;

    @Index
    @Column({type: DataTypes.SMALLINT})
    isHome: number;

    @Index
    @Column({type: DataTypes.SMALLINT})
    isTemplate: number;

    @Index
    @Column
    templateId: number;

    @Index
    @Column({type: DataTypes.SMALLINT})
    active: number;

    @Index
    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    createdAt: number;

    @Index
    @Column({type: DataTypes.DATE, defaultValue: DataTypes.NOW})
    updatedAt: number;
}