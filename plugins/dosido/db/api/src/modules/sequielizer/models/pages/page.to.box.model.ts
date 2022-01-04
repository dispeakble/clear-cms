import {Column, ForeignKey, Index, Model, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import {Page} from "./page.model";
import {PageBox} from "./page.box.model";

@Table({
    timestamps: false
})
export class PageToBox extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @ForeignKey(() => Page)
    @Index
    @Column
    pageId: number;

    @ForeignKey(() => PageBox)
    @Index
    @Column
    boxId: number;

    @Column
    x: number;

    @Column
    y: number;

    @Column({type: DataTypes.SMALLINT})
    templateUsed: number;

}