import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";
import { withRouter } from "react-router-dom";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CustomInput from "components/CustomInput/CustomInput.js";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { Editor } from "@tinymce/tinymce-react";

// for the material-table within the edit modal options modal
import MaterialTable from "material-table";
import {
  DeleteForever,
  AddCircle,
  Edit,
  ArtTrack,
  Close,
} from "@material-ui/icons";
import * as Icons from "@material-ui/icons";

// for the dropdown
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Menu, MenuItem } from "@material-ui/core";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

// for Font Awesome
import Icon from "@material-ui/core/Icon";
import parse from "html-react-parser";

class MenuModule extends Component {
  state = {
    menuOptions: [],
    itemModuleEditId: "",
    showModuleOptionsModal: false,
    modalTitle: "Menu Items",
    richFormattedText: false,
    itemModuleEditId: "",
    showMultipleDeleteModal: false,
    tableRef: React.createRef(),
    isMenuVertical: false,
    showAsAccordion: false,
    flatLinks: [],
    stretchToFit: false,
    displayBgColorPicker: false,
    bgColor: "",
    icons: [],
    icon: "",
  };

  async componentDidMount() {
    if (this.props.moduleOptions.data) {
      await this.setAsyncState({
        menuOptions: this.props.moduleOptions.data.links,
        isMenuVertical: this.props.moduleOptions.data.isVertical,
        stretchToFit: this.props.moduleOptions.data.stretchToFit,
        bgColor: this.props.moduleOptions.data.backgroundColor,
      });
      if (this.props.moduleOptions.data.showAsAccordion) {
        await this.setAsyncState({
          showAsAccordion: this.props.moduleOptions.data.showAsAccordion,
        });
      }
      this.getAllLinks();
      console.log(this.props.moduleOptions.data);
    }

    let icons = Object.keys(Icons).filter((key) => {
      let show = true;
      if (key.includes("Outlined")) {
        show = false;
      } else if (key.includes("Rounded")) {
        show = false;
      } else if (key.includes("Sharp")) {
        show = false;
      } else if (key.includes("New")) {
        show = false;
      } else if (key.includes("TwoTone")) {
        show = false;
      }

      return show;
    });

    icons = icons.map((key) => {
      return {
        text: key.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
        label: key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(),
      };
    });

    this.setState({ icons });
  }

  getTheme = () => {
    /*
    error?: PaletteColorOptions;
  warning?: PaletteColorOptions;
  info?: PaletteColorOptions;
  success?: PaletteColorOptions;
    */
    return createMuiTheme({
      palette: {
        primary: "008b8b",
      },
      overrides: {
        MuiDialogTitle: {
          root: {
            padding: "16px 24px 0",
          },
        },
        MuiDialog: {
          paperWidthSm: {
            maxWidth: "100%",
            backgroundColor: "#FFDF00",
          },
        },
        MuiDialog: {
          paper: {
            width: "100%",
            backgroundColor: "#FFDF00",
          },
        },
      },
    });
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  sendStyles = (targetedColor) => {
    return reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: targetedColor,
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
          zIndex: 99999,
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });
  };

  showMultipleDeleteModal = (evt, data) => {
    this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
  };

  closeMultipleDeleteModal = () => {
    this.setState({ showMultipleDeleteModal: false });
  };

  multipleDeleteCallback = async () => {
    let menuOptions = [...this.state.menuOptions];
    let menuIds = [];
    let multipleDeleteData = this.state.multipleDeleteData;
    multipleDeleteData.map((option) => menuIds.push(option.id));
    menuOptions = menuOptions.filter((option) => {
      return !menuIds.includes(option.id);
    });
    await this.setAsyncState({ menuOptions });
    this.state.tableRef.current && this.state.tableRef.current.onQueryChange();

    this.closeMultipleDeleteModal();
  };

  // getAllLinks = async (data, parentName) => {
  //   let result = this.state.flatLinks;
  //   if (this.state.menuOptions.length) {
  //     let links = data || this.state.menuOptions;
  //     links.map((el) => {
  //       el.concatText = el.text;
  //       if (parentName) {
  //         el.concatText = parentName + "/" + el.concatText;
  //       }
  //       result.push({
  //         id: el.id,
  //         label: el.concatText,
  //       });
  //       if (
  //         el.tableData &&
  //         el.tableData.childRows &&
  //         el.tableData.childRows.length
  //       ) {
  //         this.getAllLinks(el.tableData.childRows, el.text);
  //       }
  //     });

  //     await this.setAsyncState({
  //       flatLinks: result,
  //     });
  //   }
  // };

  getLinksNested(id) {
    let result = "";
    let link = this.state.menuOptions.find((el) => el.id === id);
    result = link.text;
    if (link && link.parentId) {
      result = this.getLinksNested(link.parentId) + "/" + result;
    }
    return result;
  }

  getAllLinks = async () => {
    let result = [];

    if (this.state.menuOptions.length) {
      let links = this.state.menuOptions;
      links.map((el) => {
        let linkName = el.text;
        if (el.parentId) {
          linkName = this.getLinksNested(el.parentId) + "/" + el.text;
        }
        result.push({
          id: el.id,
          label: linkName,
        });
      });

      await this.setAsyncState({
        flatLinks: result,
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
              data: this.state.menuOptions,
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
              let menuOptions = [...this.state.menuOptions];
              newData.id = this.state.menuOptions.length + 1;
              let newMenuOptions = menuOptions.concat(newData);

              await this.setAsyncState({ menuOptions: newMenuOptions });
              this.getAllLinks();
              resolve();
            }, 100);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              delete newData.tableData;
              const dataUpdate = [...this.state.menuOptions];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              await this.setAsyncState({ menuOptions: dataUpdate });
              this.getAllLinks();
              resolve();
            }, 100);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...this.state.menuOptions];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              this.setState({ menuOptions: dataDelete });
              resolve();
            }, 100);
          }),
      },
      customActions: [
        {
          tooltip: "Remove All Selected Menu Links",
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
        { title: "Text", field: "text" },
        {
          title: "Title",
          field: "title",
        },
        {
          title: "Link",
          field: "link",
        },
        {
          title: "Target",
          field: "targetLink",
          width: "100px",
          lookup: { _self: "In Page", _blank: "New Tab" },
        },
        {
          title: "Icon",
          field: "icon",
          editComponent: (columnData) => {
            return (
              <Autocomplete
                className={this.props.classes.option}
                options={this.state.icons}
                autoHighlight
                getOptionLabel={(option) => option.text}
                value={this.state.icons.find(
                  (icon) => icon.text === columnData.rowData.icon
                )}
                onChange={(ev, value) => {
                  if (value && value.text) {
                    columnData.onRowDataChange({
                      ...columnData.rowData,
                      icon: value.text,
                    });
                  }
                }}
                renderOption={(option) => {
                  return (
                    <React.Fragment>
                      <Icon>{option.label}</Icon> {option.text}
                    </React.Fragment>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    className={this.props.classes.textfield}
                    {...params}
                    label="Icon"
                    variant="outlined"
                  />
                )}
              />
            );
          },
        },
        {
          title: "Parent Id",
          field: "parentId",
          type: "numeric",
          editComponent: (columnData) => {
            let filteredLinks = this.state.flatLinks.filter(
              (link) => link.id !== columnData.rowData.id
            );
            return (
              <Autocomplete
                options={filteredLinks}
                autoHighlight
                className={this.props.classes.option}
                value={this.state.flatLinks.find(
                  (link) => link.id === columnData.rowData.parentId
                )}
                onChange={(ev, value) => {
                  columnData.onRowDataChange({
                    ...columnData.rowData,
                    parentId: value.id,
                  });
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    className={this.props.classes.textfield}
                    {...params}
                    label="Parent link"
                    variant="outlined"
                  />
                )}
              />
            );
          },
        },
        // { title: "Parent Id", field: "parentId", type: "numeric" },
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

  handleClick = () => {
    this.setState({ displayBgColorPicker: !this.state.displayBgColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayBgColorPicker: false });
  };

  closeModuleOptionsModal() {
    console.log("will close modal ");
    this.setState({ showModuleOptionsModal: false });
  }

  handleEdit = async (id) => {
    this.props.onStartEditingModule();
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  render() {
    const classes = this.props.classes;
    const bgColorStyles = this.sendStyles(this.state.bgColor);

    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Tooltip title="Edit Menu Module">
          <IconButton
            onClick={() => this.handleEdit(this.props.boxId)}
            color="primary"
            size="medium"
          >
            <ArtTrack />
          </IconButton>
        </Tooltip>

        <Dialog
          onBackdropClick="false"
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={this.state.showModuleOptionsModal}
          onBackdropClick="false"
          TransitionComponent={this.transition}
          keepMounted
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
            <Typography gutterBottom>
              <div>
                <div
                  style={bgColorStyles.swatch}
                  onClick={() => this.handleClick("displayBgColorPicker")}
                >
                  <div style={bgColorStyles.color} />
                </div>
                {this.state.displayBgColorPicker ? (
                  <div style={bgColorStyles.popover}>
                    <div
                      style={bgColorStyles.cover}
                      onClick={() =>
                        this.handleColorPickerClose("displayBgColorPicker")
                      }
                    />
                    <SketchPicker
                      color={this.state.bgColor}
                      onChangeComplete={async (color) => {
                        await this.setAsyncState({
                          bgColor: color.hex,
                        });
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <span style={{ display: "inline" }}>Background Color</span>
            </Typography>

            <Typography id="discrete-slider" gutterBottom>
              <Tooltip title="Show the menu links in vertical order">
                <Switch
                  checked={this.state.showAsAccordion}
                  onChange={() => {
                    this.setState({
                      showAsAccordion: !this.state.showAsAccordion,
                    });
                  }}
                  value={this.state.showAsAccordion}
                />
              </Tooltip>
              Show as Accordion{" "}
            </Typography>
            <Typography id="discrete-slider" gutterBottom>
              <Tooltip title="Show the menu links in vertical order">
                <Switch
                  checked={this.state.isMenuVertical}
                  onChange={() => {
                    this.setState({
                      isMenuVertical: !this.state.isMenuVertical,
                    });
                  }}
                  value={this.state.isMenuVertical}
                />
              </Tooltip>
              Vertical Menu
            </Typography>
            <Typography id="discrete-slider" gutterBottom>
              <Tooltip title="Stretch the menu links so as to cover all the width of the box">
                <Switch
                  checked={this.state.stretchToFit}
                  onChange={() => {
                    this.setState({
                      stretchToFit: !this.state.stretchToFit,
                    });
                  }}
                  value={this.state.stretchToFit}
                />
              </Tooltip>
              Stretch to Fit
            </Typography>
            <MaterialTable
              title="Menu Links"
              tableRef={this.state.tableRef}
              columns={this.tableOptions.props.columns}
              parentChildData={this.tableOptions.props.parentChildData}
              data={() => this.tableOptions.actions.getData()}
              icons={this.tableOptions.props.icons}
              options={this.tableOptions.props.options}
              editable={this.tableOptions.actions.editable}
              actions={this.tableOptions.actions.customActions}
            />
          </DialogContent>

          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.onEndEditingModule();
                this.props.handleSave(this.state.itemModuleEditId, {
                  links: this.state.menuOptions,
                  isVertical: this.state.isMenuVertical,
                  showAsAccordion: this.state.showAsAccordion,
                  stretchToFit: this.state.stretchToFit,
                  backgroundColor: this.state.bgColor,
                });
                this.closeModuleOptionsModal();
              }}
            >
              <div>Save</div>
            </Button>
            <Button
              color="danger"
              onClick={() => {
                this.props.onEndEditingModule();
                this.closeModuleOptionsModal();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(MenuModule));
