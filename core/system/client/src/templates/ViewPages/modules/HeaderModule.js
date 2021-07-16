import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";
import ArtTrack from "@material-ui/icons/ArtTrack";
import { DropzoneArea } from "material-ui-dropzone";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";
import {DeleteForever} from "@material-ui/icons";

class HeaderModule extends Component {
  state = {
    itemModuleEditId: "",
    showModuleOptionsModal: false,
    modalTitle: "Header Module Options",
    isModuleSticky: false,
    logoTitle: "",
    logoLink: "",
    backgroundRepeat: false,
    backgroundStretch: false,
  };
  getTheme = () => {
    return createMuiTheme({
      palette: this.props.defaultTheme,
      overrides: {
        MuiDialogTitle: {
          root: {
            padding: "16px 24px 0",
          },
        },
      },
    });
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  componentDidMount() {
    if (this.props.moduleOptions.data) {
      let moduleOptions = this.props.moduleOptions.data;
      this.setState({
        isModuleSticky: moduleOptions.isModuleSticky,
        backgroundRepeat: moduleOptions.backgroundRepeat,
        backgroundStretch: moduleOptions.backgroundStretch,
        logoTitle: moduleOptions.logoTitle,
        logoLink: moduleOptions.logoLink,
        backgroundImage: moduleOptions.bg,
        backgroundImageFile: moduleOptions.file,
        logoImage: moduleOptions.logoImage,
        logoImageFile: moduleOptions.logoImageFile,
      });
    }
  }

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleItemBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));
      this.setAsyncState({
        backgroundImage: strings[0],
        backgroundImageFile: event[0]
      });
    }
  };

  handleItemLogo = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));
      this.setAsyncState({
        logoImage: strings[0],
        logoImageFile: event[0]
      });
    }
  };

  handleInputChange = async (event) => {
    switch (event.target.id) {
      case "logoTitle":
        let logoTitle = [this.state.logoTitle];
        logoTitle = event.target.value;
        this.setState({ logoTitle });
        break;
      case "logoLink":
        let logoLink = [this.state.logoLink];
        logoLink = event.target.value;
        this.setState({ logoLink });
        break;
      default:
        break;
    }
  };

  render() {
    const classes = this.props.classes;

    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={() => this.handleEdit(this.props.boxId)}
          color="primary"
          size="medium"
        >
          <ArtTrack />
        </IconButton>

        <Dialog
          onBackdropClick="false"
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={this.state.showModuleOptionsModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeModuleOptionsModal()}
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
            <Typography
              style={{
                flex: '0 1 ~ "calc(33% - 15px)"',
              }}
              id="discrete-slider"
              gutterBottom
            >
              <Tooltip title="Make the header permanently visible">
                <Switch
                  checked={this.state.isModuleSticky}
                  onChange={() => {
                    this.setState({
                      isModuleSticky: !this.state.isModuleSticky,
                    });
                  }}
                  value={this.state.isModuleSticky}
                />
              </Tooltip>
              Sticky Header
            </Typography>

            <Typography id="discrete-slider" gutterBottom>
              <Tooltip title="Background Repeat">
                <Switch
                  checked={this.state.backgroundRepeat}
                  onChange={() => {
                    this.setState({
                      backgroundRepeat: !this.state.backgroundRepeat,
                    });
                  }}
                  value={this.state.backgroundRepeat}
                />
              </Tooltip>
              Background Repeat
            </Typography>

            <Typography id="discrete-slider" gutterBottom>
              <Tooltip title="Background Stretch">
                <Switch
                  checked={this.state.backgroundStretch}
                  onChange={() => {
                    this.setState({
                      backgroundStretch: !this.state.backgroundStretch,
                    });
                  }}
                  value={this.state.backgroundStretch}
                />
              </Tooltip>
              Background Stretch
            </Typography>

            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  margin: "0 20px",
                  width: "calc(50% - 10px)",
                }}
              >
                <CustomInput
                  labelText="Logo Title"
                  id="logoTitle"
                  required="required"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) => this.handleInputChange(event),
                  }}
                  inputProps={{
                    value: this.state.logoTitle,
                    type: "text",
                  }}
                />
              </div>
              <div
                style={{
                  margin: "0 20px",
                  width: "calc(50% - 10px)",
                }}
              >
                <CustomInput
                  labelText="Logo Link"
                  id="logoLink"
                  required="required"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) => this.handleInputChange(event),
                  }}
                  inputProps={{
                    value: this.state.logoLink,
                    type: "text",
                  }}
                />
              </div>
            </div>
            <div className={classes.dropzoneColumn}>
              <Typography id="discrete-slider" gutterBottom>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <div>Upload Background Image</div>
                  {this.state.backgroundImage && <DeleteForever onClick={() => this.setState({
                    backgroundImage: "",
                    backgroundImageFile: ""
                  })} style={{color: this.props.defaultTheme.secondary.main}}/>}
                </div>
                <DropzoneArea
                  filesLimit={1}
                  className={classes.dropzone}
                  onChange={this.handleItemBgImage.bind(this)}
                />
              </Typography>
            </div>
            <div className={classes.dropzoneColumn}>
              <Typography id="discrete-slider" gutterBottom>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <div>Upload Logo Image</div>
                  {this.state.logoImage && <DeleteForever onClick={() => this.setState({
                    backgroundImage: "",
                    logoImageFile: ""
                  })} style={{color: this.props.defaultTheme.secondary.main}}/>}
                </div>
                <DropzoneArea
                  filesLimit={1}
                  className={classes.dropzone}
                  onChange={this.handleItemLogo.bind(this)}
                />
              </Typography>
            </div>
          </DialogContent>

          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.handleSave(this.state.itemModuleEditId, {
                  bg: this.state.backgroundImage,
                  file: this.state.backgroundImageFile,
                  logoImage: this.state.logoImage,
                  logoImageFile: this.state.logoImageFile,
                  logoTitle: this.state.logoTitle,
                  logoLink: this.state.logoLink,
                  isModuleSticky: this.state.isModuleSticky,
                  backgroundRepeat: this.state.backgroundRepeat,
                  backgroundStretch: this.state.backgroundStretch,
                });
                this.closeModuleOptionsModal();
              }}
            >
              <div>Save</div>
            </Button>
            <Button
              color="danger"
              onClick={() => {
                this.setState({
                  logoTitle: this.props.moduleOptions.data.logoTitle,
                  logoLink: this.props.moduleOptions.data.logoLink,
                });
                this.closeModuleOptionsModal();
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

export default withStyles(styles)(HeaderModule);
