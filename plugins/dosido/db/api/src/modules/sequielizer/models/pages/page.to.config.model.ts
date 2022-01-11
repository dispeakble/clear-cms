import {Column, ForeignKey, Index, Model, Table} from "sequelize-typescript";
import {Page} from "./page.model";
import {PageConfig} from "./page.config.model";


@Table({
    timestamps: false
})
export class PageToConfig extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @Index
    @Column
    pageId: number;

    @Column
    configId: number;
}