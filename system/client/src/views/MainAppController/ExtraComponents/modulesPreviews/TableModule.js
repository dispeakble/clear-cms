import React, { Component } from "react";
import MaterialTable from "material-table";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import Icon from "@material-ui/core/Icon";

class TableModule extends Component {
  state = {
    columns: [],
    data: [
      {
        id: 1,
        email: "george.bluth@reqres.in",
        first_name: "George",
        last_name: "Bluth",
        avatar: "https://reqres.in/img/faces/1-image.jpg",
      },
      {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg",
      },
      {
        id: 3,
        email: "emma.wong@reqres.in",
        first_name: "Emma",
        last_name: "Wong",
        avatar: "https://reqres.in/img/faces/3-image.jpg",
      },
      {
        id: 4,
        email: "eve.holt@reqres.in",
        first_name: "Eve",
        last_name: "Holt",
        avatar: "https://reqres.in/img/faces/4-image.jpg",
      },
      {
        id: 5,
        email: "charles.morris@reqres.in",
        first_name: "Charles",
        last_name: "Morris",
        avatar: "https://reqres.in/img/faces/5-image.jpg",
      },
      {
        id: 6,
        email: "tracey.ramos@reqres.in",
        first_name: "Tracey",
        last_name: "Ramos",
        avatar: "https://reqres.in/img/faces/6-image.jpg",
      },
    ],
    tableConfig: {},
  };

  componentDidMount() {
    if (this.props.element.moduleOptions.data) {
      this.setState({
        columns: this.props.element.moduleOptions.data.columns,
        tableConfig: this.props.element.moduleOptions.data.tableConfig,
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
                <a href={rowData[col.fieldName].href} target="_blank">
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
        });
        return tableCols;
      },
      getPreviewData: () => {
        console.log(this.state.previewData);
        console.log(this.state.data);
        return new Promise((resolve) => {
          //TODO ADD NEW STATE FOR TABLE DATA/VALUES
          setTimeout(() => {
            let payload = {
              totalCount: 100,
              page: 1,
              data: this.state.data ? this.state.data : this.state.previewData,
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
