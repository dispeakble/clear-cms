import {Column, ForeignKey, Index, Model, Table} from "sequelize-typescript";
import {Category} from "../general/category.model";
import {Page} from "./page.model";

@Table({
    timestamps: false
})
export class PageToCategory extends Model {
    @Column({primaryKey: true, autoIncrement: true, autoIncrementIdentity: true})
    id: number;

    @ForeignKey(() => Page)
    @Index
    @Column
    pageId: number;

    @ForeignKey(() => Category)
    @Index
    @Column
    categoryId: number;
}