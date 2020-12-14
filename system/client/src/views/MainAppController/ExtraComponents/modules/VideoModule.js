import React, { Component } from "react";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.js";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

class VideoModule extends Component {
  state = {
    url: "",
    urlTypes: [{ label: "Exact URL" }, { label: "Query String Variable" }],
    mute: false,
    controls: false,
    loop: false,
    editUrlType: 0,
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

  getIndex(name) {
    return Number(
      this.state.urlTypes.findIndex((type) => {
        return type.label === name;
      })
    );
  }

  handleUrlType = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
    await this.setAsyncState({
      editUrlType: this.getIndex(newValue.label),
    });
  };

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
    await this.setAsyncState({
      editGalleryType: this.state.editGalleryType,
    });
  };

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "url":
        let url = this.state.url;
        url = event.target.value;
        this.setState({ url });
        break;

      case "folderPath":
        let folderPath = this.state.folderPath;
        folderPath = event.target.value;
        this.setState({ folderPath });
        break;

      case "fileExtension":
        let fileExtension = this.state.fileExtension;
        fileExtension = event.target.value;
        this.setState({ fileExtension });
        break;
    }
  };

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  render() {
    return (
      <div>
        <Tooltip title="Video Module">
          <IconButton
            onClick={() => this.handleEdit(this.props.boxId)}
            color="primary"
            size="medium"
          >
            <ArtTrack />
          </IconButton>
        </Tooltip>

        <Dialog
          fullWidth={true}
          style={{ width: "40%", margin: "0 auto" }}
          maxWidth={"md"}
          onBackdropClick={() => "false"}
          classes={{
            root: this.props.classes.center,
            paper: this.props.classes.modal,
          }}
          open={this.state.showModuleOptionsModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeModuleOptionsModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            style={{
              textAlign: "center",
            }}
            id="classic-modal-slide-title"
            disableTypography
            className={this.props.classes.modalHeader}
          >
            <h4 className={this.props.classes.modalTitle}>
              Video Player Settings
            </h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={this.props.classes.modalBody}
          >
            <Autocomplete
              id="moduleDropdown"
              onChange={this.handleUrlType}
              className={this.props.classes.option}
              autoHighlight
              getOptionLabel={(option) => option.label}
              defaultValue={this.state.urlTypes[this.state.editUrlType]}
              options={this.state.urlTypes}
              renderInput={(params) => (
                <TextField
                  className={this.props.classes.textfield}
                  {...params}
                  label="URL Type"
                  variant="outlined"
                />
              )}
            />
            <div style={{ display: "flex" }}>
              <div style={{ width: "33%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Mute Video">
                    <Switch
                      checked={this.state.mute}
                      onChange={() => {
                        this.setState({
                          mute: !this.state.mute,
                          open: true,
                        });
                      }}
                    />
                  </Tooltip>
                  Muted
                </Typography>
              </div>
              <div style={{ width: "33%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable COntrols">
                    <Switch
                      checked={this.state.controls}
                      onChange={() => {
                        this.setState({
                          controls: !this.state.controls,
                          open: true,
                        });
                      }}
                    />
                  </Tooltip>
                  Controls{" "}
                </Typography>
              </div>
              <div style={{ width: "33%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Allow looping through video">
                    <Switch
                      checked={this.state.loop}
                      onChange={() => {
                        this.setState({
                          loop: !this.state.loop,
                          open: true,
                        });
                      }}
                    />
                  </Tooltip>
                  Loop
                </Typography>
              </div>
            </div>
            {this.state.editUrlType === 0 ? (
              <CustomInput
                labelText="URL"
                id="url"
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
            ) : (
              <React.Fragment>
                <CustomInput
                  labelText="Value"
                  id="url"
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
                <CustomInput
                  labelText="Folder Path"
                  id="folderPath"
                  required="required"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) => this.handleInputChange(event),
                  }}
                  inputProps={{
                    value: this.state.folderPath,
                    type: "text",
                  }}
                />
                <CustomInput
                  labelText="File Extension"
                  id="fileExtension"
                  required="required"
                  formControlProps={{
                    fullWidth: true,
                    onChange: (event) => this.handleInputChange(event),
                  }}
                  inputProps={{
                    value: this.state.fileExtension,
                    type: "text",
                  }}
                />
              </React.Fragment>
            )}
          </DialogContent>
          <DialogActions className={this.props.classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.handleSave(this.state.itemModuleEditId);
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
                this.props.onEndEditingModule();
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

export default withStyles(styles)(VideoModule);
