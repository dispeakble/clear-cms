import React, { Component } from "react";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { DropzoneArea } from "material-ui-dropzone";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "components/CustomButtons/Button.js";

class BannerModule extends Component {
  state = {
    bannerTitle: "",
    bannerSizes: [
      { label: "250 x 250" },
      { label: "200 x 200" },
      { label: "468 x 60" },
      { label: "728 x 90" },
      { label: "300 x 250" },
      { label: "336 x 280" },
      { label: "120 x 600" },
      { label: "160 x 600" },
      { label: "300 x 600" },
      { label: "970 x 90" },
    ],
    bannerSize: "",

    linkNav: 0,
    linkNavs: [{ label: "On Page" }, { label: "New Tab" }],
    bgImage: "",
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

  createDefaultTheme = () => {
    return createMuiTheme({
      palette: this.props.defaultTheme,

      overrides: {
        MuiDropzoneArea: {
          root: {
            height: "145px",
            minHeight: "145px",
          },
          text: {
            fontSize: "1rem",
          },
        },
      },
    });
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "bannerTitle":
        let bannerTitle = this.state.bannerTitle;
        bannerTitle = event.target.value + "";
        console.log(event.target.value);
        this.setState({ bannerTitle });
        break;
      case "bannerLink":
        let bannerLink = this.state.bannerLink;
        bannerLink = event.target.value + "";
        console.log(event.target.value);
        this.setState({ bannerLink });
        break;
    }
  };

  getBannerSizeIndex(name) {
    return Number(
      this.state.bannerSizes.findIndex((type) => {
        return type.label === name;
      })
    );
  }

  handleBannerSize = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
    await this.setAsyncState({
      bannerSize: this.getBannerSizeIndex(newValue.label),
    });
  };

  getLinkNavIndex(name) {
    return Number(
      this.state.linkNavs.findIndex((type) => {
        return type.label === name;
      })
    );
  }

  handleLinkNav = async (event, newValue) => {
    if (!newValue || !newValue.label) {
      return;
    }
    await this.setAsyncState({
      linkNav: this.getLinkNavIndex(newValue.label),
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

  handleBgImage = async (event) => {
    if (event.length) {
      let strings = await Promise.all(event.map((file) => this.toBase64(file)));

      this.setAsyncState({
        bgImage: strings[0],
      });
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={this.createDefaultTheme}>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Tooltip title="Banner Module">
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
                Edit Banner Module
              </h4>
            </DialogTitle>
            <DialogContent
              id="classic-modal-slide-description"
              className={this.props.classes.modalBody}
            >
              <CustomInput
                labelText="Title"
                id="bannerTitle"
                required="required"
                formControlProps={{
                  fullWidth: true,
                  onChange: (event) => this.handleInputChange(event),
                }}
                inputProps={{
                  value: this.state.bannerTitle,
                  type: "text",
                }}
              />
              <Autocomplete
                style={{ margin: "5% 0" }}
                id="moduleDropdown"
                onChange={this.handleBannerSize}
                className={this.props.classes.option}
                autoHighlight
                getOptionLabel={(option) => option.label}
                defaultValue={this.state.bannerSizes[this.state.bannerSize]}
                options={this.state.bannerSizes}
                renderInput={(params) => (
                  <TextField
                    className={this.props.classes.textfield}
                    {...params}
                    label="Size"
                    variant="outlined"
                  />
                )}
              />{" "}
              <CustomInput
                labelText="Link"
                id="bannerLink"
                required="required"
                formControlProps={{
                  fullWidth: true,
                  onChange: (event) => this.handleInputChange(event),
                }}
                inputProps={{
                  value: this.state.bannerLink,
                  type: "text",
                }}
              />
              <Autocomplete
                style={{ margin: "5% 0" }}
                id="moduleDropdown"
                onChange={this.handleLinkNav}
                className={this.props.classes.option}
                autoHighlight
                getOptionLabel={(option) => option.label}
                defaultValue={this.state.linkNavs[this.state.linkNav]}
                options={this.state.linkNavs}
                renderInput={(params) => (
                  <TextField
                    className={this.props.classes.textfield}
                    {...params}
                    label="Link Navigation"
                    variant="outlined"
                  />
                )}
              />{" "}
              <Typography id="discrete-slider" gutterBottom>
                Image
                <DropzoneArea
                  clearOnUnmount={true}
                  filesLimit={1}
                  className={this.props.classes.dropzone}
                  onChange={this.handleBgImage.bind(this)}
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
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(BannerModule);
