import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pages.js";
import AddCircle from "@material-ui/icons/AddCircle";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";

// from material-table
import MaterialTable from "material-table";

//todo import modal content to add category

const shortid = require("shortid");

class Pages extends Component {
  state = {
    showModal: false,
    cat_list: [],
    categories: [
      {
        title: "Title1",
        category: "Categ4",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title2",
        category: "Categ5",
        id: shortid.generate(),
        primary: <Checkbox disabled />,
      },
      {
        title: "Title3",
        category: "Categ3",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title4",
        category: "Categ1",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title5",
        category: "Categ2",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title6",
        category: "Categ6",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title7",
        category: "Categ7",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title8",
        category: "Categ8",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title9",
        category: "Categ9",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
      {
        title: "Title10",
        category: "Categ10",
        id: shortid.generate(),
        primary: <Checkbox />,
      },
    ],
  };

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
          iconProps: { style: { color: "#DE4343" } },
          icon: "delete",
          onClick: (evt, data) =>
            alert("You want to delete " + data.length + " rows"),
        },
      ],
    },
    props: {
      icons: {
        Edit: () => <Edit style={{ color: "darkcyan" }} />,
        Delete: () => <Delete style={{ color: "#DE4343" }} />,
      },
      columns: [
        { title: "Title", field: "title" },
        {
          title: "Category",
          field: "category",
        },
        {
          title: "Primary",
          field: "primary",
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
        <Link to="/pagesAdd">
          <AddCircle className={classes.addIcon} />
        </Link>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Pages);
