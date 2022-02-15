import React, {Component} from "react";
import MaterialTable from "material-table";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import _ from "lodash";

class TableModule extends Component {
    state = {
        columns: this.props.moduleOptions.columns || this.props.moduleOptions.columns || [],
        previewData: this.props.moduleOptions.previewData || [],
        remoteData: this.props.moduleOptions.remoteData || false,
        dataUrl: this.props.moduleOptions.dataUrl || "",
        editable: this.props.moduleOptions.editable || false,
        search: this.props.moduleOptions.search || false,
        sortable: this.props.moduleOptions.sortable || false,
        columnDrag: this.props.moduleOptions.columnDrag || false,
        export: this.props.moduleOptions.export || false,
        filter: this.props.moduleOptions.filter || false,
        leftNumber: this.props.moduleOptions.leftNumber || 0,
        rightNumber: this.props.moduleOptions.rightNumber || 0,
        rowsOnPage: this.props.moduleOptions.rowsOnPage || 0,
        pagination: this.props.moduleOptions.pagination || false,
    };
    dataTableOptions = {
        actions: {
            getColumns: () => {
                let tableCols = [];
                this.state.columns.map((col) => {
                    if (col.dataType === "image") {
                        tableCols.push({
                            title: col.columnTitle,
                            field: col.fieldName,
                            render: (rowData) => (
                                <img
                                    alt={col.columnTitle}
                                    style={{
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                    }}
                                    src={rowData[col.fieldName]}
                                />
                            ),
                        });
                    } else if (col.dataType === "icon") {
                        tableCols.push({
                            title: col.columnTitle,
                            field: col.fieldName,
                            render: (rowData) => <Icon>{rowData[col.fieldName]}</Icon>,
                        });
                    } else if (col.dataType === "link") {
                        tableCols.push({
                            title: col.columnTitle,
                            field: col.fieldName,
                            render: (rowData) => (
                                <a href={rowData[col.fieldName].href} target="_blank" rel="noopener noreferrer">
                                    {rowData[col.fieldName].name}
                                </a>
                            ),
                        });
                    } else {
                        tableCols.push({
                            title: col.columnTitle,
                            field: col.fieldName,
                            type: col.dataType,
                        });
                    }
                    return col;
                });
                return tableCols;
            },
            getPreviewData: () => {
                return new Promise((resolve) => {
                    //TODO ADD NEW STATE FOR TABLE DATA/VALUES
                    setTimeout(() => {
                        let payload = {
                            totalCount: 100,
                            page: 1,
                            data: this.state.previewData,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: this.state.editable
                ? {
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(async () => {
                                delete newData.tableData;
                                let previewData = [...this.state.previewData];
                                newData.id = this.state.previewData.length + 1;
                                let newPreviewData = previewData.concat(newData);
                                await this.setAsyncState({previewData: newPreviewData});
                                // localStorage.setItem(
                                //   "previewData",
                                //   JSON.stringify(newPreviewData)
                                // );
                                resolve();
                            }, 100);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(async () => {
                                delete newData.tableData;
                                const dataUpdate = [...this.state.previewData];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                await this.setAsyncState({previewData: dataUpdate});
                                resolve();
                            }, 100);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                const dataDelete = [...this.state.previewData];
                                const index = oldData.tableData.id;
                                dataDelete.splice(index, 1);
                                this.setState({previewData: dataDelete});
                                // // localStorage.setItem(
                                // //   "previewData",
                                // //   JSON.stringify(dataDelete)
                                // // );
                                resolve();
                            }, 100);
                        }),
                }
                : {},
        },
        props: {
            options: {
                overflowY: "auto",
                search: this.props.moduleOptions.search,
                sorting: this.props.moduleOptions.sortable,
                draggable: this.props.moduleOptions.columnDrag,
                exportButton: this.props.moduleOptions.export,
                filtering: this.props.moduleOptions.filter,
                fixedColumns: {
                    left: this.props.moduleOptions.leftNumber,
                    right: this.props.moduleOptions.rightNumber,
                },
                paging: this.props.moduleOptions.pagination,
                pageSize: this.props.moduleOptions.rowsOnPage,
                pageSizeOptions: [...Array(10)].map((n, index) => (index+1)),
                selection: this.props.moduleOptions.editable,
                actionsColumnIndex: -1,
                actionsCellStyle: {
                    width: "auto",
                },
            },
        },
    };

    async getData(query) {
        if(this.state.remoteData) {
            return this.getRemoteData(query);
        } else {
            return this.getLocalData(query)
        }
    }

    getRemoteData(query) {
        return new Promise(_.throttle(async (resolve) => {
            if (query.orderBy) {
                const orderBy = {};

                orderBy[query.orderBy.field] = query.orderDirection;
            }

            const urlQuery = new URLSearchParams({
                page: query.page + 1,
                per_page: query.pageSize,
                "search": query.search
            });

            try {
                const response = await fetch('https://reqres.in/api/users?' + urlQuery.toString());

                const result = await response.json();

                if (result && result.data.length) {
                    resolve({
                        data: result.data,
                        page: query.page,
                        totalCount: result.total,
                    })
                }
            } catch (err) {
            }
        }, 1000, {
            trailing: true
        }));
    }

    getLocalData(query) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    data: this.state.previewData.filter(data => {
                        if(!query.search.length) {
                            return data;
                        }

                        return Object.keys(data).some(key => {
                            return String(data[key]).indexOf(query.search) > -1;
                        })
                    }),
                    page: query.page,
                    totalCount: this.state.previewData.length,
                })
            }, 0)
        })
    }

    render() {
        return (
            <div style={{display: "grid", width: "100%", height: "100%", overflow: "auto"}}>
                <MaterialTable
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gridTemplateRows: "auto 1fr auto",
                        height: "100%"
                    }}
                    title="Table data"
                    columns={this.dataTableOptions.actions.getColumns()}
                    data={this.getData.bind(this)}
                    options={this.dataTableOptions.props.options}
                    icons={this.dataTableOptions.props.icons}
                    editable={this.dataTableOptions.actions.editable}
                />
            </div>
        );
    }
}

export default TableModule;

TableModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object
}