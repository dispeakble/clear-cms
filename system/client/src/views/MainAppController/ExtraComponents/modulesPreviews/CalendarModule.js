import React, { Component } from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import TextField from "@material-ui/core/textfield";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

class CalendarModule extends Component {
  state = {
    withRange: false,
    open: true,
    dateRange: {},
  };

  setOpen = () => {
    this.setState({ open: !this.state.open });
  };

  setDateRange = (range) => {
    this.setState({ dateRange: range });
  };

  changeCalendar = () => {
    this.setState({ withRange: !this.state.withRange });
  };

  render() {
    return (
      <React.Fragment>
        <Typography id="discrete-slider" gutterBottom>
          <Tooltip title="Enable Range Calendar">
            <Switch
              checked={this.state.withRange}
              onChange={() => {
                this.setState({
                  withRange: !this.state.withRange,
                  open: true,
                });
              }}
            />
          </Tooltip>
          Range Calendar
        </Typography>

        {this.state.withRange ? (
          <DateRangePicker
            style={{ backgroundColor: "white !important" }}
            open={this.state.open}
            toggle={this.setOpen}
            onChange={(range) => this.setDateRange(range)}
          />
        ) : (
          <form noValidate>
            <TextField
              id="date"
              label="Birthday"
              type="date"
              defaultValue="2017-05-24"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        )}
      </React.Fragment>
    );
  }
}

export default CalendarModule;
