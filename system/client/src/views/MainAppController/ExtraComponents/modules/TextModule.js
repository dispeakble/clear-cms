import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Close from "@material-ui/icons/Close";
import CustomInput from "components/CustomInput/CustomInput.js";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { Editor } from "@tinymce/tinymce-react";

class TextModule extends Component {
  state = {
    textContent: "",
    itemModuleEditId: "",
    richTextContent: "",
    showModuleOptionsModal: false,
    modalTitle: "Text content",
    richFormattedText: false,
  };

  componentDidMount() {}

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
    this.props.onStartEditingModule();
    if (this.props.moduleOptions.data) {
      await this.setAsyncState({
        richFormattedText: this.props.moduleOptions.data.isRichFormattedText,
      });
      if (this.props.moduleOptions.data.isRichFormattedText) {
        await this.setAsyncState({
          textContent: "",
          richTextContent: this.props.moduleOptions.data.textData,
        });
      } else {
        await this.setAsyncState({
          richTextContent: "",
          textContent: this.props.moduleOptions.data.textData,
        });
      }
    }
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  handleInputChange(event) {
    if (event.target) {
      this.setState({
        textContent: event.target.value,
      });
    } else {
      this.setState({
        richTextContent: event,
      });
    }
  }

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
            {this.state.richFormattedText === true ? (
              <Editor
                id="editor"
                value={this.state.richTextContent}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic forecolor backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat",
                }}
                onEditorChange={(event) => this.handleInputChange(event)}
              />
            ) : (
              <CustomInput
                labelText="Enter text"
                id="moduleOptionsInput"
                required="required"
                formControlProps={{
                  fullWidth: true,
                  onChange: (event) => this.handleInputChange(event),
                }}
                inputProps={{
                  value: this.state.textContent,
                  type: "text",
                }}
              />
            )}
          </DialogContent>

          <Typography gutterBottom>
            <Tooltip title="Enable Rich Formatted Text">
              <Switch
                checked={this.state.richFormattedText}
                onChange={() => {
                  this.setState({
                    richFormattedText: !this.state.richFormattedText,
                  });
                }}
              />
            </Tooltip>
            Rich Formatted Text
          </Typography>

          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.onEndEditingModule();
                this.props.handleSave(this.state.itemModuleEditId, {
                  textData: this.state.richFormattedText
                    ? this.state.richTextContent
                    : this.state.textContent,
                  isRichFormattedText: this.state.richFormattedText,
                });
                this.closeModuleOptionsModal();
                console.log(this.state.textContent);
              }}
            >
              <div>Save</div>
            </Button>
            <Button
              color="danger"
              onClick={async () => {
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

export default withStyles(styles)(TextModule);
