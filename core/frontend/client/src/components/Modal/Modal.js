import React, { Component } from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
// nodejs library to set properties for components
//import PropTypes from "prop-types";
// @material-ui/core components
import styles from "assets/jss/clear-crm/views/componentsSections/javascriptStyles.js";

import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Button from "components/CustomButtons/Button.js";
//import CustomInput from "components/CustomInput/CustomInput.js";
//import InputAdornment from "@material-ui/core/InputAdornment";
//import Icon from "@material-ui/core/Icon";
import { withRouter } from "react-router-dom";

class Modal extends Component {
  callCloseCallback(data) {
    this.props.closeButton.callback(data);
  }

  callConfirmCallback(data) {
    this.props.confirmButton.callback(data);
  }
// eslint-disable-next-line react/display-name
  transition = React.forwardRef((props, ref) => {
    return <Slide direction="down" ref={ref} {...props} />;
  });

  render() {
    const classes = this.props.classes;

    return (
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal,
        }}
        open={this.props.showModal}
        TransitionComponent={this.transition}
        keepMounted
        onClose={() => this.callCloseCallback()}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <IconButton
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => this.callCloseCallback()}
          >
            <Close className={classes.modalClose} />
          </IconButton>
          <h4 className={classes.modalTitle}>{this.props.title}</h4>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        >
          {this.props.modalContent}
          {this.props.content}
        </DialogContent>
        {/* {this.props.location.pathname === "/categories" ? (
          <CustomInput
            labelText="Title"
            id="title"
            required="required"
            formControlProps={{
              fullWidth: true,
            }}
          />
        ) : (
          ""
        )} */}
        <DialogActions className={classes.modalFooter}>
          {this.props.confirmButton && (
            <Button
              color="transparent"
              simple
              onClick={() => {
                this.callConfirmCallback();
              }}
            >
              {this.props.confirmButton.label}
            </Button>
          )}
          <Button
            color="danger"
            simple
            onClick={() => {
              this.callCloseCallback();
            }}
          >
            {this.props.closeButton.label}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(withStyles(styles)(Modal));
