import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/themes.js";

import Button from "components/CustomButtons/Button.js";
import IconButton from "@material-ui/core/Icon";
import {
  DeleteForever,
  Edit,
  AddCircle,
  Clear,
  Check,
} from "@material-ui/icons";
// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import MaterialTable from "material-table";

import { DropzoneArea } from "material-ui-dropzone";

import CustomInput from "components/CustomInput/CustomInput.js";

class Themes extends Component {
  state = {
    createModal: false,
    files: [],
    temporaryFiles: [],
    showDeleteModal: "",
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  showMultipleDeleteModal = (evt, data) => {
    this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
  };

  closeMultipleDeleteModal = () => {
    this.setState({ showMultipleDeleteModal: false });
  };

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "folder":
        let folder = event.target.value;
        this.setState({ folder });
        break;
    }
  };

  multipleDeleteCallback = async () => {
    let files = [...this.state.files];
    let filesIds = [];
    let multipleDeleteData = this.state.multipleDeleteData;
    multipleDeleteData.map((file) => filesIds.push(file.tableData.id));
    files = files.filter((file) => {
      return !filesIds.includes(file.tableData.id);
    });
    await this.setAsyncState({ files });
    // localStorage.setItem("files", JSON.stringify(files));
    this.closeMultipleDeleteModal();
  };

  tableOptions = {
    tableRef: React.createRef(),
    getTheme: () => {
      return createMuiTheme({
        palette: this.props.defaultTheme,
        overrides: {
          MuiFab: {
            root: {
              boxShadow: "",
            },
          },
          MuiDialog: {
            paper: {
              width: "50%",
            },
            paperWidthSm: {
              maxWidth: "100vw",
              maxHeight: "60vh",
            },
          },
          MuiDropzoneArea: {
            text: {
              fontSize: "1rem",
            },
          },
        },
      });
    },

    actions: {
      refreshData: () => {
        this.tableOptions.tableRef.current &&
          this.tableOptions.tableRef.current.onQueryChange();
      },
      getData: (query) => {
        return new Promise((resolve) => {
          let payload = {
            totalCount: 100,
            page: 1,
            data: this.state.files,
          };
          resolve(payload);

          setTimeout(() => {
            this.tableOptions.actions.refreshData();
          }, 300);
        });
      },
      customActions: [
        {
          icon: () => (
            <IconButton>
              <AddCircle color="primary" />
            </IconButton>
          ),
          tooltip: "Upload Files",
          isFreeAction: true,
          onClick: () => this.setState({ createModal: true }),
        },
        {
          tooltip: "Remove All Added Files",

          icon: () => (
            <IconButton>
              <DeleteForever color="error" />
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
      editable: {
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              delete newData.tableData;
              const dataUpdate = [...this.state.files];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              await this.setAsyncState({ files: dataUpdate });
              resolve();
            }, 100);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...this.state.files];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              this.setState({ files: dataDelete });
              // localStorage.setItem("files", JSON.stringify(dataDelete));
              resolve();
            }, 100);
          }),
      },
      columns: [
        { title: "Name", field: "name" },
        {
          title: "Type",
          field: "type",
          editable: "never",
        },
        {
          title: "Folder",
          field: "folder",
        },
        {
          title: "File Size",
          field: "fileSize",
          editable: "never",
        },
        {
          title: "Date",
          field: "date",
          editable: "never",
        },
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

  handleUploadedFile = async (event) => {
    let temporaryFiles = [...this.state.files];

    if (event.length) {
      temporaryFiles = temporaryFiles.concat(event);

      temporaryFiles.map((el) => {
        const milliseconds = Number(el.lastModified) * 1000;
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString();
        el.date = humanDateFormat;

        let bytes = Number(el.size);

        const dataSize = () => {
          let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
          if (bytes == 0) return "0 Byte";
          let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
          return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
        };

        el.fileSize = dataSize();

        el.folder = this.state.folder;
      });

      await this.setAsyncState({
        files: temporaryFiles,
      });

      await this.setAsyncState({
        createModal: false,
      });
    }
  };

  openEditor(reset) {
    return (
      <Dialog
        style={{ width: "100%" }}
        onBackdropClick="false"
        classes={{
          root: this.props.classes.center,
          paper: this.props.classes.modal,
        }}
        open={true}
        TransitionComponent={this.transition}
        keepMounted
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={this.props.classes.modalHeader}
        >
          <h4 style={{ textAlign: "center" }}>Upload Files</h4>
        </DialogTitle>
        <DialogContent
          style={{ overflow: "auto" }}
          id="classic-modal-slide-description"
          className={this.props.classes.modalBody}
        >
          {" "}
          <CustomInput
            labelText="Folder"
            id="folder"
            required="required"
            formControlProps={{
              fullWidth: true,
              onChange: (event) => this.handleInputChange(event),
            }}
            inputProps={{
              value: this.state.url,
              type: "text",
            }}
          />
          <DropzoneArea
            filesLimit={10}
            className={this.props.classes.dropzone}
            onChange={this.handleUploadedFile.bind(this)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            style={{ margin: "0 auto" }}
            color="danger"
            onClick={() => {
              this.setState({
                createModal: false,
              });
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <MuiThemeProvider theme={this.tableOptions.getTheme()}>
        <MaterialTable
          tableRef={this.tableOptions.tableRef}
          style={{ margin: "0 auto", marginTop: "4%", width: "80%" }}
          title="Uploaded Files"
          editable={this.tableOptions.props.editable}
          columns={this.tableOptions.props.columns}
          data={this.tableOptions.actions.getData}
          options={this.tableOptions.props.options}
          actions={this.tableOptions.actions.customActions}
          icons={this.tableOptions.props.icons}
        />

        {this.state.createModal ? this.openEditor(true) : ""}

        <Dialog
          style={{ width: "50%", margin: "0 auto", textAlign: "center" }}
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
            className={this.props.classes.modalHeader}
          >
            <h4>Are you sure you want to proceed ?</h4>{" "}
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={this.props.classes.modalBody}
          ></DialogContent>

          <DialogActions className={this.props.classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => this.multipleDeleteCallback()}
            >
              <div>Proceed</div>
            </Button>
            <Button
              color="danger"
              onClick={() => {
                this.closeMultipleDeleteModal();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Themes);
