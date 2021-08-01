import React, { Component } from "react";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

class CalendarModule extends Component {
  state = {
    selectedDate: [null, null],
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
      },
    });
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  render() {
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Tooltip title="Calendar Module">
          <IconButton color="primary" size="medium">
            <ArtTrack />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(CalendarModule);
