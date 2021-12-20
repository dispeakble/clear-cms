import React, { Component } from "react";
import MaterialTable from "material-table";
//import { withStyles, createTheme } from "@material-ui/core/styles";
//import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import Icon from "@material-ui/core/Icon";

class TableModule extends Component {
  state = {
    columns: [],
    previewData: [

    ],
    tableConfig: {},
  };

  componentDidMount() {
    if (this.props.element.moduleOptions.previewData) {
      this.setState({
        previewData: this.props.element.moduleOptions.previewData,
        columns: this.props.element.moduleOptions.columns,
        tableConfig: this.props.element.moduleOptions.tableConfig,
      });
    }
  }

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
      editable: this.state.tableConfig.editable
        ? {
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  delete newData.tableData;
                  let previewData = [...this.state.previewData];
                  newData.id = this.state.previewData.length + 1;
                  let newPreviewData = previewData.concat(newData);
                  await this.setAsyncState({ previewData: newPreviewData });
                  // localStorage.setItem(
                  //   "previewData",
                  //   JSON.stringify(newPreviewData)
                  // );
                  resolve();
                }, 100);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  delete newData.tableData;
                  const dataUpdate = [...this.state.previewData];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  await this.setAsyncState({ previewData: dataUpdate });
                  resolve();
                }, 100);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...this.state.previewData];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  this.setState({ previewData: dataDelete });
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
        search: this.state.tableConfig.search,
        sorting: this.state.tableConfig.sortable,
        draggable: this.state.tableConfig.columnDrag,
        exportButton: this.state.tableConfig.export,
        filtering: this.state.tableConfig.filter,
        fixedColumns: {
          left: this.state.tableConfig.leftNumber,
          right: this.state.tableConfig.rightNumber,
        },
        pageSize: this.state.tableConfig.rowsOnPage,
        paging: this.state.tableConfig.pagination,

        selection: this.state.tableConfig.editable,
        actionsColumnIndex: -1,
        actionsCellStyle: {
          width: "auto",
        },
      },
    },
  };

  render() {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <MaterialTable
          title="Table data"
          columns={this.dataTableOptions.actions.getColumns()}
          data={() => this.dataTableOptions.actions.getPreviewData()}
          options={this.dataTableOptions.props.options}
          icons={this.dataTableOptions.props.icons}
          editable={this.dataTableOptions.actions.editable}
        />
      </div>
    );
  }
}

export default TableModule;
