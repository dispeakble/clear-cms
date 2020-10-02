import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pages.js";

import {
  Edit,
  DeleteForever,
  Visibility,
  Add as AddIcon,
  CheckBox,
} from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { forwardRef } from "react";

// from material-table
import MaterialTable from "material-table";

const shortid = require("shortid");

class Pages extends Component {
  state = {
    showModal: false,
    cat_list: [],
    pages: [],
    currentPage: 1,
    currentEditId: "",
  };

  componentDidMount() {
    let pages = [];
    let pagesFromStorage = JSON.parse(localStorage.getItem("pages"));
    if (pagesFromStorage) {
      pagesFromStorage.map((page) => {
        pages.push({
          id: page.id,
          title: page.pageConfig.pageTitle,
          publish: <Checkbox disabled checked={page.pageConfig.publish} />,
          defaultPage: (
            <Checkbox disabled checked={page.pageConfig.defaultPage} />
          ),

          category: page.pageConfig.category,
        });
      });
      this.setState({ pages });
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
          secondary: {
            main: "#008B8B",
          },
          primary: {
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
      getData: (query) => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            await this.setAsyncState({
              currentPage: query.page + 1,
            });

            //TODO SORT SERVER SIDE!!!!!!!!!!
            let truncatedData = this.state.pages.slice(
              query.page,
              query.pageSize
            );
            let payload = {
              totalCount: this.state.pages.length,
              page: query.page,
              data: truncatedData,
            };
            resolve(payload);
          }, 300);
        });
      },
      customActions: [
        {
          tooltip: "Remove All Selected Users",

          icon: () => (
            <IconButton>
              <DeleteForever color="error" />
            </IconButton>
          ),
          onClick: (evt, data) =>
            alert("You want to delete " + data.length + " rows"),
        },
        {
          position: "row",
          icon: () => (
            <IconButton color="primary">
              <Visibility />
            </IconButton>
          ),
          tooltip: "Page Preview",
          onClick: (event, rowData) => {
            // go to page preview
          },
        },
        {
          onClick: (event, rowData) => {
            window.open(`/pageEdit/${rowData.id}`);
          },
          position: "row",
          tooltip: "Page Preview",
          icon: () => (
            <IconButton color="primary" size="medium">
              <Edit className={this.props.classes.editItemIcon} />
            </IconButton>
          ),
        },
        {
          position: "row",
          icon: () => (
            <IconButton color="primary" size="medium">
              <DeleteForever color="error" />
            </IconButton>
          ),
          tooltip: "Page Preview",
          onClick: (event, rowData) => {
            // go to page preview
          },
        },
      ],
    },
    props: {
      columns: [
        { title: "Title", field: "title" },
        {
          title: "Category",
          field: "category",
        },
        {
          title: "Publish",
          headerStyle: {
            width: "300px",
          },
          field: "publish",
        },
        {
          title: "Default Page",
          headerStyle: {
            width: "300px",
          },
          field: "defaultPage",
        },
        { title: "Id", field: "id", hidden: true },
      ],
      options: {
        selection: true,
        selectionStyle: styles.selection,
        actionsColumnIndex: -1,
        actionsCellStyle: {
          width: "auto",
        },
        cellStyle: styles.tableCells,
        headerStyle: styles.tableHeader,
      },
    },
  };

  render() {
    const classes = this.props.classes;
    console.log(this.state.pages);
    return (
      <React.Fragment>
        <div className={classes.pagesPanel}>
          <div className={classes.pagesWrapper}>
            <MuiThemeProvider theme={this.tableOptions.getTheme()}>
              <MaterialTable
                classes={{
                  actions: {
                    width: "auto",
                  },
                }}
                title="Pages List"
                columns={this.tableOptions.props.columns}
                data={this.tableOptions.actions.getData}
                options={this.tableOptions.props.options}
                actions={this.tableOptions.actions.customActions}
              />
              <Link
                to="/pagesAdd"
                style={{
                  position: "fixed",
                  right: this.tableOptions.getTheme().spacing(2),
                  bottom: this.tableOptions.getTheme().spacing(2),
                }}
              >
                <Fab color="primary" aria-label="add">
                  <AddIcon />
                </Fab>
              </Link>
            </MuiThemeProvider>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Pages);
