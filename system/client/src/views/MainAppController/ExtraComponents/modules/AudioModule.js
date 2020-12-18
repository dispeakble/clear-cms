import React, { Component } from "react";
import ArtTrack from "@material-ui/icons/ArtTrack";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

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

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";

import Slider from "@material-ui/core/Slider";

import Typography from "@material-ui/core/Typography";

class AudioModule extends Component {
  state = {
    url: "",
    sourceTypes: [{ label: "Exact URL" }, { label: "Query String Variable" }],
    editSourceType: 0,
    editVolume: 50,
    enablePlayer: true,
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
      this.state.sourceTypes.findIndex((type) => {
        return type.label === name;
      })
    );
  }

  handleSourceType = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
    await this.setAsyncState({
      editSourceType: this.getIndex(newValue.label),
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

  handleVolume = async (event, newValue) => {
    await this.setAsyncState({
      editVolume: newValue,
      enablePlayer: false,
    });
    setTimeout(() => {
      this.setState({ enablePlayer: true });
    }, 30);
  };

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "url":
        let url = this.state.url;
        url = event.target.value;
        this.setState({ url, enablePlayer: false });
        setTimeout(() => {
          this.setState({ enablePlayer: true });
        }, 30);
        break;

      case "folderPath":
        let folderPath = this.state.folderPath;
        folderPath = event.target.value;
        this.setState({ folderPath, enablePlayer: false });
        setTimeout(() => {
          this.setState({ enablePlayer: true });
        }, 30);
        break;

      case "fileExtension":
        let fileExtension = this.state.fileExtension;
        fileExtension = event.target.value;
        this.setState({ fileExtension, enablePlayer: false });
        setTimeout(() => {
          this.setState({ enablePlayer: true });
        }, 30);
        break;
    }
  };

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  render() {
    return (
      <div>
        <Tooltip title="Audio Module">
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
              Edit Audio Player Module
            </h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={this.props.classes.modalBody}
          >
            <div
              style={{
                height: "78px",
                margin: "5% 0 10% 0",
              }}
            >
              {this.state.enablePlayer ? (
                <AudioPlayer
                  src={this.state.url}
                  volume={this.state.editVolume / 100}
                />
              ) : (
                ""
              )}
            </div>
            <Autocomplete
              id="moduleDropdown"
              onChange={this.handleSourceType}
              className={this.props.classes.option}
              autoHighlight
              getOptionLabel={(option) => option.label}
              defaultValue={this.state.sourceTypes[this.state.editSourceType]}
              options={this.state.sourceTypes}
              renderInput={(params) => (
                <TextField
                  className={this.props.classes.textfield}
                  {...params}
                  label="Source Type"
                  variant="outlined"
                />
              )}
            />{" "}
            {this.state.editSourceType === 0 ? (
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
            <Typography id="discrete-slider" gutterBottom>
              Default Volume
              <Slider
                defaultValue={Number(this.state.editVolume)}
                onChangeCommitted={this.handleVolume}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Typography>
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

export default withStyles(styles)(AudioModule);
