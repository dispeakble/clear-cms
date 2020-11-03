import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/themes.js";
import Button from "components/CustomButtons/Button.js";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/Icon";
import { DeleteForever, Edit, Add as AddIcon } from "@material-ui/icons";

import { Helmet } from "react-helmet";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// for 'new thumbnail' modal
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import { Divider } from "@material-ui/core";

class Themes extends Component {
  state = {
    showAdminThumbnailsPage: false,
    thumbnails: [
      { title: "thumb1" },
      { title: "thumb2" },
      { title: "thumb3" },
      { title: "thumb4" },
      { title: "thumb5" },
    ],
    showNewThumbnailModal: false,
    defaultTheme: false,
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  getTheme = () => {
    /*
        error?: PaletteColorOptions;
      warning?: PaletteColorOptions;
      info?: PaletteColorOptions;
      success?: PaletteColorOptions;
        */
    return createMuiTheme({
      palette: {
        primary: { main: "#008B8B" },
        secondary: { main: "#F44336" },
      },
      overrides: {
        MuiFab: {
          root: {
            boxShadow: "",
          },
        },
      },
    });
  };

  async showAdminThumbnailsPage() {
    await this.setAsyncState({ showAdminThumbnailsPage: true });
  }

  createAdminThumbnailsPage = () => {
    const createThumbnail = (tbn) => {
      return (
        <React.Fragment>
          <div className={this.props.classes.thumbnailWrapper}>
            {tbn.title}
            <img src={tbn.imgSrc} />{" "}
            <Tooltip title="Edit Thumbnail">
              <IconButton
                style={{ cursor: "pointer" }}
                color="primary"
                size="medium"
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove Thumbnail">
              <IconButton
                style={{ cursor: "pointer" }}
                color="secondary"
                size="medium"
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <Fab color="primary" aria-label="add">
              <AddIcon onClick={() => this.showNewThumbnailModal()} />
            </Fab>
          </div>
        </React.Fragment>
      );
    };

    let thumbnails = this.state.thumbnails;

    return (
      <div className={this.props.classes.outerWrapper}>
        <div className={this.props.classes.thumbnailsWrapper}>
          {thumbnails.map((tbn) => createThumbnail(tbn))}
        </div>
      </div>
    );
  };

  showNewThumbnailModal = async () => {
    await this.setAsyncState({ showNewThumbnailModal: true });
  };

  // createNewThumbnail = () => {
  //   <Dialog
  //     onBackdropClick="false"
  //     classes={{
  //       root: this.props.classes.center,
  //       paper: this.props.classes.modal,
  //     }}
  //     open={this.state.showModuleOptionsModal}
  //     TransitionComponent={this.transition}
  //     keepMounted
  //     onClose={() => this.closeModuleOptionsModal()}
  //     aria-labelledby="classic-modal-slide-title"
  //     aria-describedby="classic-modal-slide-description"
  //   >
  //     <DialogTitle
  //       id="classic-modal-slide-title"
  //       disableTypography
  //       className={this.props.classes.modalHeader}
  //     >
  //       <h4 className={this.props.classes.modalTitle}>
  //         {this.state.modalTitle}
  //       </h4>
  //     </DialogTitle>
  //     <DialogContent
  //       id="classic-modal-slide-description"
  //       className={this.props.classes.modalBody}
  //     ></DialogContent>

  //     <Typography gutterBottom>
  //       <Tooltip title="Set as theme for all pages">
  //         <Switch
  //           checked={this.state.defaultTheme}
  //           onChange={() => {
  //             this.setState({
  //               defaultTheme: !this.state.defaultTheme,
  //             });
  //           }}
  //         />
  //       </Tooltip>
  //       Default Theme
  //     </Typography>

  //     <DialogActions className={this.props.classes.modalFooter}>
  //       <Button
  //         disabled={this.state.isBtnDisabled}
  //         color="primary"
  //         onClick={() => {
  //           this.props.onEndEditingModule();
  //           this.props.handleSave(this.state.itemModuleEditId, {
  //             textData: this.state.richFormattedText
  //               ? this.state.richTextContent
  //               : this.state.textContent,
  //             isRichFormattedText: this.state.richFormattedText,
  //           });
  //           this.closeModuleOptionsModal();
  //         }}
  //       >
  //         <div>Save</div>
  //       </Button>
  //       <Button
  //         color="danger"
  //         onClick={async () => {
  //           this.props.onEndEditingModule();
  //           this.closeModuleOptionsModal();
  //         }}
  //       >
  //         Cancel
  //       </Button>
  //     </DialogActions>
  //   </Dialog>;
  // };

  render() {
    const classes = this.props.classes;

    return (
      <MuiThemeProvider theme={this.getTheme()}>
        <React.Fragment>
          <Helmet>
            <title>Themes</title>
          </Helmet>
          <div className={classes.buttonsWrapper}>
            <Button
              onClick={() => this.showAdminThumbnailsPage()}
              color="primary"
            >
              Public
            </Button>
            <Button
              onClick={() => this.showAdminThumbnailsPage()}
              color="primary"
            >
              Admin
            </Button>
          </div>
          <div>
            {this.state.showAdminThumbnailsPage
              ? this.createAdminThumbnailsPage()
              : ""}
          </div>
          {/* {this.state.showNewThumbnailModal
            ? () => this.createNewThumbnail()
            : ""} */}
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Themes);
