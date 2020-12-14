import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/categories.js";

import { Helmet } from "react-helmet";

import {
  DeleteForever,
  AddCircle,
  Edit,
  Check,
  Clear,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

// from material-table
import MaterialTable from "material-table";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.js";

// for the dropdown
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

//todo import modal content to add category

class Categories extends Component {
  state = {
    tableRef: React.createRef(),
    showModal: false,
    cat_list: [],
    categories: [],
    showMultipleDeleteModal: false,
    flatCategories: [],
    defaultTheme: "",
  };

  async componentDidMount() {
    const categories = JSON.parse(localStorage.getItem("categories"));

    if (categories !== null) {
      await this.setAsyncState({
        categories: categories,
      });
    }

    this.getAllCategories();
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  getCategoriesNested(id) {
    let result = "";
    let cat = this.state.categories.find((el) => el.id === id);
    result = cat.name;
    if (cat && cat.parentId) {
      result = this.getCategoriesNested(cat.parentId) + "/" + result;
    }
    return result;
  }

  getAllCategories = async () => {
    let result = [];

    if (this.state.categories.length) {
      let links = this.state.categories;
      links.map((el) => {
        let catName = el.name;
        if (el.parentId) {
          catName = this.getCategoriesNested(el.parentId) + "/" + el.name;
        }
        result.push({
          id: el.id,
          label: catName,
        });
      });

      await this.setAsyncState({
        flatCategories: result,
      });
    }
  };

  tableOptions = {
    getTheme: () => {
      /*
      error?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    info?: PaletteColorOptions;
    success?: PaletteColorOptions;
      */

      return createMuiTheme({
        palette: this.props.defaultTheme,
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
              delete newData.tableData;
              let categories = [...this.state.categories];
              newData.id = this.state.categories.length + 1;
              let newCategories = categories.concat(newData);
              await this.setAsyncState({ categories: newCategories });
              this.getAllCategories();
              localStorage.setItem("categories", JSON.stringify(newCategories));
              resolve();
            }, 100);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              delete newData.tableData;
              const dataUpdate = [...this.state.categories];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              await this.setAsyncState({ categories: dataUpdate });
              this.getAllCategories();
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
            <IconButton color="error">
              <DeleteForever />{" "}
            </IconButton>
          ),
          onClick: async (evt, data) => this.showMultipleDeleteModal(evt, data),
        },
      ],
    },
    props: {
      icons: {
        Add: () => <AddCircle className={this.props.classes.addIcon} />,
        Check: () => (
          <IconButton color="primary">
            <Check color="primary" />{" "}
          </IconButton>
        ),
        Clear: () => (
          <IconButton color="error">
            <Clear color="error" />{" "}
          </IconButton>
        ),
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
        {
          title: "Parent Id",
          field: "parentId",
          type: "numeric",
          editComponent: (columnData) => {
            let filteredCats = this.state.flatCategories.filter(
              (cat) => cat.id !== columnData.rowData.id
            );
            return (
              <Autocomplete
                options={filteredCats}
                autoHighlight
                className={this.props.classes.option}
                defaultValue={() => {
                  let foundLink = this.state.flatCategories.find(
                    (link) => link.id === columnData.rowData.parentId
                  );
                  return foundLink;
                }}
                onChange={(ev, value) => {
                  if (value && value.label) {
                    columnData.onRowDataChange({
                      ...columnData.rowData,
                      parentId: value.id,
                    });
                  }
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    className={this.props.classes.textfield}
                    {...params}
                    label="Parent category"
                    variant="outlined"
                  />
                )}
              />
            );
          },
        },
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

    return (
      <React.Fragment>
        <Helmet>
          <title>Categories</title>
        </Helmet>
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
