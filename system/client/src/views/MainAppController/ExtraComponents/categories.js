import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/categories.js";

import { DeleteForever, AddCircle, Edit } from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";

// from material-table
import MaterialTable from "material-table";

//todo import modal content to add category

const shortid = require("shortid");

class Categories extends Component {
  state = {
    showModal: false,
    cat_list: [],
    categories: [],
  };

  componentDidMount() {
    const categories = JSON.parse(localStorage.getItem("categories"));

    if (categories !== null) {
      this.setState({
        categories: categories,
      });
    }
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  tableOptions = {
    getTheme: () => {
      /*
      error?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    info?: PaletteColorOptions;
    success?: PaletteColorOptions;
      */
      return createMuiTheme({
        palette: {
          text: {
            //primary: "#F00",
            //secondary: "#0F0",
            disabled: "#00F",
            hint: "#333",
          },
          error: {
            main: "#FF0000",
          },
          warning: {
            main: "#FF0000",
          },
          info: {
            main: "#FF0000",
          },
          success: {
            main: "#FF0000",
          },
          primary: {
            main: "#008B8B",
          },
          secondary: {
            main: "#008B8B",
          },
        },
        overrides: {
          MuiTableCell: {
            head: {
              "&:last-child": {
                width: "1px !important",
                whiteSpace: "nowrap",
              },
            },
          },
          MuiTypography: {
            h6: {
              textTransform: "capitalize",
            },
          },
          MuiIconButton: {
            root: {
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
          },
          MuiIconButton: {
            root: {
              padding: "3px",
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
          },
        },
      });
    },
    actions: {
      getData: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            let payload = {
              totalCount: 100,
              page: 1,
              data: this.state.categories,
            };
            resolve(payload);
          }, 300);
        });
      },
      editable: {
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              let categories = [...this.state.categories];
              newData.id = this.state.categories.length + 1;
              let newCategories = categories.concat(newData);
              await this.setState({ categories: newCategories });
              await localStorage.setItem(
                "categories",
                JSON.stringify(newCategories)
              );
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...this.state.categories];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              this.setState({ categories: dataUpdate });
              resolve();
            }, 100);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...this.state.categories];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              this.setState({ categories: dataDelete });
              resolve();
            }, 100);
          }),
      },
      customActions: [
        {
          tooltip: "Remove All Selected Users",
          icon: () => (
            <IconButton color="primary">
              <DeleteForever color="error" />{" "}
            </IconButton>
          ),
          onClick: (evt, data) =>
            alert("You want to delete " + data.length + " rows"),
        },
      ],
    },
    props: {
      icons: {
        Add: () => <AddCircle className={this.props.classes.addIcon} />,
        Edit: () => (
          <IconButton color="primary">
            <Edit color="primary" />{" "}
          </IconButton>
        ),
        Delete: () => (
          <IconButton color="primary">
            <DeleteForever color="error" />{" "}
          </IconButton>
        ),
      },
      columns: [
        { title: "Title", field: "name" },
        {
          title: "Description",
          field: "description",
        },
      ],
      options: {
        selection: true,
        selectionStyle: styles.selection,
        actionsColumnIndex: -1,
        actionsCellStyle: styles.tableActions,
        cellStyle: styles.tableCells,
        headerStyle: styles.tableHeader,
      },
    },
  };

  render() {
    const classes = this.props.classes;
    const shortid = require("shortid");

    return (
      <React.Fragment>
        <div className={classes.categoriesPanel}>
          <div className={classes.categoriesWrapper}>
            <MuiThemeProvider theme={this.tableOptions.getTheme()}>
              <MaterialTable
                title="Categories"
                columns={this.tableOptions.props.columns}
                data={this.tableOptions.actions.getData}
                icons={this.tableOptions.props.icons}
                options={this.tableOptions.props.options}
                editable={this.tableOptions.actions.editable}
                actions={this.tableOptions.actions.customActions}
              />
            </MuiThemeProvider>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Categories);
