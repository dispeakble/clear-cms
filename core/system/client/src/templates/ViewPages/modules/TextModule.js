import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import { Editor } from "@tinymce/tinymce-react";

class TextModule extends Component {
  state = {
    itemModuleEditId: "",
    richTextContent: "",
    showModuleOptionsModal: false,
    modalTitle: "Text content"
  };

  getTheme = () => {
    return createTheme({
      palette: this.props.defaultTheme,
      overrides: {
        MuiDialogTitle: {
          root: {
            padding: "16px 24px 0",
          },
        },
        MuiFormControlLabel: {
          root: {
            margin: "0px !important"
          }
        }
      },
    });
  };

  handleClose (event, reason) {
    if (reason === "backdropClick") {
      return false;
    }

    if (reason === "escapeKeyDown") {
      return false;
    }

    this.closeModuleOptionsModal();

    return true;

  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  handleEdit = async (id) => {
    if (this.props.moduleOptions.data) {
      await this.setAsyncState({
        richTextContent: this.props.moduleOptions.data.textData,
      });
    }
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
  };

  handleInputChange(event) {
    this.setState({
      richTextContent: event,
    });
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
            disableAutoFocus={true}
            disableBackdropClick={true}
            disableRestoreFocus={true}
            disableEnforceFocus={true}
            hideBackdrop={true}
          classes={{
            root: classes.center,
            paper: classes.modal,
          }}
          open={this.state.showModuleOptionsModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={(event, reason) => this.handleClose(event, reason)}
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
              <Editor
                id="editor"
                value={this.state.richTextContent}
                init={{
                  height: 500,
                  //menubar: false,
                  /*plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],*/
                  plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',

                  menubar: 'file edit view insert format tools table tc help',
                  toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                  /*toolbar:
                      "undo redo"
                      + " | formatselect"
                      + " | bold italic forecolor backcolor"
                      + " | alignleft aligncenter alignright alignjustify"
                      +" | bullist numlist outdent indent"
                      + " | removeformat",*/
                  init_instance_callback: function (editor) {
                    var annoyingMessage = document.querySelector(
                      ".tox-notifications-container"
                    );
                    if(annoyingMessage && annoyingMessage.style){
                      annoyingMessage.style.display = "none";
                    }
                  },
                }}
                onEditorChange={(event) => this.handleInputChange(event)}
              />

          </DialogContent>
          <DialogActions className={classes.modalFooter}>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.handleSave(this.state.itemModuleEditId, {
                  textData: this.state.richTextContent,
                  isRichFormattedText: true
                });
                this.closeModuleOptionsModal();
              }}
            >
              <div>Save</div>
            </Button>
            <Button
              color="danger"
              onClick={async () => {
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
