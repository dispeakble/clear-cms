import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";
import ArtTrack from "@material-ui/icons/ArtTrack";
import { DropzoneArea } from "material-ui-dropzone";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Close from "@material-ui/icons/Close";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import CustomInput from "components/CustomInput/CustomInput.js";



class HeaderModule extends Component {
  state = {
    itemModuleEditId: "",
    showModuleOptionsModal: false,
    modalTitle: "Modal Background",
    isModuleSticky: false,
    logoTitle: '',
    logoLink: '',
  };
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
      },
    });
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  handleInputChange(event) {
    this.setState({
      textContent: event.target.value,
    });
  }

  handleRichInputChange(event) {
    this.setState({
      textContent: event,
    });
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
  }

  handleItemBgImage = async (event) => {
    if(event.length){
      let strings = await Promise.all(event.map(file => this.toBase64(file)));
      this.setAsyncState({
        backgroundImage:strings[0]
      });
    }
  };

  handleItemLogo = async (event) => {
    if(event.length){
      let strings = await Promise.all(event.map(file => this.toBase64(file)));
      this.setAsyncState({
        logoImage: strings[0]
      });
    }
    
  }

  handleInputChange = async (event) => {
    switch (event.target.id) {
      case "logoTitle":
        let logoTitle = [...this.state.logoTitle];
        logoTitle = event.target.value;
        this.setState({ logoTitle });
        break;
      case "logoLink":
        let logoLink = [...this.state.logoLink];
        logoLink = event.target.value;
        this.setState({ logoLink });
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
            {" "}
            <Typography id="discrete-slider" gutterBottom>
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
        Sticky Module                   
      </Typography>
      <Divider/>

        <div className={classes.column}>
      <Typography  id="discrete-slider" gutterBottom>
        Upload Background Image
            <DropzoneArea
              filesLimit={1}
              className={classes.dropzone}
              onChange={this.handleItemBgImage.bind(this)}
            />
      </Typography>
      </div>
      
      <div className={classes.column}>
      <Typography id="discrete-slider" gutterBottom>
        Upload Logo Image

            <DropzoneArea
              filesLimit={1}
              className={classes.dropzone}
              onChange={this.handleItemLogo.bind(this)}
            />
      </Typography>
      <CustomInput
                      labelText="Title"
                      id="logoTitle"
                      required="required"
                      formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                      }}
                      inputProps={{
                        value: this.state.editItemTitle,
                        type: "text",
                      }} />
                      <CustomInput
                      labelText="Link"
                      id="logoLink"
                      required="required"
                      formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                      }}
                      inputProps={{
                        value: this.state.editItemTitle,
                        type: "text",
                      }} />
      </div>
          </DialogContent>

          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.handleSave(
                  this.state.itemModuleEditId,
                  {
                    bg:this.state.backgroundImage,
                    logoImage: this.state.logoImage,
                    logoTitle: this.state.logoTitle,
                    logoLink: this.state.logoLink,
                    isModuleSticky: this.state.isModuleSticky
                  }
                );
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

export default withStyles(styles)(HeaderModule);
