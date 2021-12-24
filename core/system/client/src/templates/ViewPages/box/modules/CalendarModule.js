import React, { Component } from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

class CalendarModule extends Component {
  state = {
    withRange: false,
    open: true,
    dateRange: {},
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

  componentDidMount() {
    const {moduleOptions}=this.props
    this.setState({
      dateRange: moduleOptions.dateRange,

    });
  }

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
          <DateRangePicker
              style={{ backgroundColor: "white !important" }}
              open={this.state.open}
              value={this.state.dateRange}
              onChange={ async (range) => {
                await  this.setAsyncState({dateRange: range})
                this.props.onUpdate(this.state)
              }}
          />
        </div>
    );
  }
}

export default withStyles(styles)(CalendarModule);