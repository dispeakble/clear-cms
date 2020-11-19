import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pages.js";

import { Helmet } from "react-helmet";

import IconButton from "@material-ui/core/IconButton";

import { withRouter } from "react-router-dom";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.js";

import { Edit, DeleteForever, Visibility } from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";

import MaterialTable from "material-table";

class Pages extends Component {
  state = {
    showModal: false,
    cat_list: [],
    pages: [],
    currentPage: 1,
    currentEditId: "",
    showDeleteModal: "",
    pageToDeleteId: "",
    deleteQty: "",
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
          icon: "add_circle",
          tooltip: "Add Page",
          isFreeAction: true,
          iconProps: {
            style: { color: "darkcyan" },
          },
          onClick: (event) => {
            this.props.history.push(`/pagesAdd`);
          },
        },
        {
          tooltip: "Remove All Selected Pages",

          icon: () => (
            <IconButton>
              <DeleteForever color="error" />
            </IconButton>
          ),
          onClick: async (evt, data) => this.showDeleteModal(evt, data),
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
            window.open(`/pagePreview/${Number(rowData.tableData.id) + 1}`);
            console.log(rowData);
          },
        },
        {
          position: "row",
          tooltip: "Edit",
          icon: () => (
            <IconButton color="primary" size="medium">
              <Edit className={this.props.classes.editItemIcon} />
            </IconButton>
          ),
          onClick: (event, rowData) => {
            this.props.history.push(
              `/pageEdit/${Number(rowData.tableData.id) + 1}`
            );
          },
        },
        {
          position: "row",
          icon: () => (
            <IconButton color="primary" size="medium">
              <DeleteForever color="error" />
            </IconButton>
          ),
          tooltip: "Delete",
          onClick: async (evt, data) => this.showDeleteModal(evt, data, 1),
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

  showDeleteModal = (evt, data, deleteQty) => {
    this.setState({
      deleteData: data,
      showDeleteModal: true,
      pageToDeleteId: data.tableData.id,
      deleteQty: deleteQty,
    });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteQty: "" });
  };

  deleteCallback = async () => {
    if (this.state.deleteQty === 1) {
      const pages = [...this.state.pages];
      const index = this.state.pageToDeleteId;
      pages.splice(index, 1);

      let pagesInStorage = JSON.parse(localStorage.getItem("pages"));
      let newPagesInStorage = [...pagesInStorage];
      newPagesInStorage.splice(index, 1);

      await localStorage.setItem("pages", JSON.stringify(newPagesInStorage));

      await this.setAsyncState({ pages, deleteQty: "" });
      this.closeDeleteModal();
    } else {
      let pages = [...JSON.parse(localStorage.getItem("pages"))];
      let pagesIds = [];
      let deleteData = this.state.deleteData;
      deleteData.map((page) => pagesIds.push(page.id));
      pages = pages.filter((page) => {
        return !pagesIds.includes(page.id);
      });
      console.log(pages);

      let pagesToSet = [];

      pages.map((page) => {
        pagesToSet.push({
          id: page.id,
          title: page.pageConfig.pageTitle,
          publish: <Checkbox disabled checked={page.pageConfig.publish} />,
          defaultPage: (
            <Checkbox disabled checked={page.pageConfig.defaultPage} />
          ),
          category: page.pageConfig.category,
        });
      });

      await this.setAsyncState({ pages: pagesToSet });
      localStorage.setItem("pages", JSON.stringify(pages));
      this.closeDeleteModal();
    }
  };

  render() {
    const classes = this.props.classes;
    console.log(this.state.pages);
    return (
      <React.Fragment>
        <Helmet>
          <title>Pages</title>
        </Helmet>
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
                data={this.state.pages} // if u use getData() it won't work
                options={this.tableOptions.props.options}
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
          open={this.state.showDeleteModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeDeleteModal()}
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
              onClick={() => this.deleteCallback()}
            >
              <div>Proceed</div>
            </Button>
            <Button
              color="danger"
              simple
              onClick={() => {
                this.closeDeleteModal();
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

export default withRouter(withStyles(styles)(Pages));
