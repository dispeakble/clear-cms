import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/categories.js";

import { DeleteForever, AddCircle, Edit } from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";

// from material-table
import MaterialTable from "material-table";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Tooltip from "@material-ui/core/Tooltip";
import Close from "@material-ui/icons/Close";
import Button from "components/CustomButtons/Button.js";

//todo import modal content to add category

const shortid = require("shortid");

class Categories extends Component {
  state = {
    tableRef: React.createRef(),
    showModal: false,
    cat_list: [],
    categories: [],
    showMultipleDeleteModal: false,
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
          MuiIconButton: {
            // for changing the color of the success and X icons on edit
            colorInherit: {
              "&:first-child": {
                color: "#008b8b",
                padding: "5px",
              },
              "&:last-child": {
                color: "#FF0000",
                padding: "5px",
              },
            },
          },
          MuiSvgIcon: {
            // for changing the color of the hamburger icon
            root: {
              color: "#000000",
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
              this.setState({ categories: newCategories });
              localStorage.setItem("categories", JSON.stringify(newCategories));
              resolve();
            }, 100);
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
              localStorage.setItem("categories", JSON.stringify(dataDelete));
              resolve();
            }, 100);
          }),
      },
      customActions: [
        {
          tooltip: "Remove All Selected Categories",
          icon: () => (
            <IconButton color="primary">
              <DeleteForever color="error" />{" "}
            </IconButton>
          ),
          onClick: async (evt, data) => this.showMultipleDeleteModal(evt, data),
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
        { title: "Parent Id", field: "parentId", type: "numeric" },
      ],
      parentChildData: (row, rows) => rows.find((a) => a.id === row.parentId),
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

  showMultipleDeleteModal = (evt, data) => {
    this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
  };

  closeMultipleDeleteModal = () => {
    this.setState({ showMultipleDeleteModal: false });
  };

  multipleDeleteCallback = async () => {
    let categories = [...this.state.categories];
    let categIds = [];
    let multipleDeleteData = this.state.multipleDeleteData;
    multipleDeleteData.map((categ) => categIds.push(categ.id));
    categories = categories.filter((categ) => {
      return !categIds.includes(categ.id);
    });
    console.log(categories);
    await this.setAsyncState({ categories });
    localStorage.setItem("categories", JSON.stringify(categories));
    this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
    this.closeMultipleDeleteModal();
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
                tableRef={this.state.tableRef}
                columns={this.tableOptions.props.columns}
                parentChildData={this.tableOptions.props.parentChildData}
                data={() => this.tableOptions.actions.getData()}
                icons={this.tableOptions.props.icons}
                options={this.tableOptions.props.options}
                editable={this.tableOptions.actions.editable}
                actions={this.tableOptions.actions.customActions}
              />
            </MuiThemeProvider>
          </div>
        </div>

        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={this.state.showMultipleDeleteModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeMultipleDeleteModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            <div>Are you sure you want to proceed ?</div>
          </DialogContent>

          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="transparent"
              simple
              onClick={() => this.multipleDeleteCallback()}
            >
              <div>Proceed</div>
            </Button>
            <Button
              color="danger"
              simple
              onClick={() => {
                this.closeMultipleDeleteModal();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Categories);
