import React, { Component } from "react";
import PropTypes from 'prop-types';
import { DateRangePicker } from "materialui-daterange-picker";
import {TextField} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import moment from 'moment';

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
        <React.Fragment >
          <Typography style={{marginTop: 30}} id="discrete-slider" gutterBottom>
            <Tooltip title="Enable Range Calendar">
              <Switch
                  checked={this.state.withRange}
                  onChange={this.changeCalendar}
              />
            </Tooltip>
            Range Calendar
          </Typography>
      <React.Fragment >
        <Typography style={{marginTop: 30}} id="discrete-slider" gutterBottom>
          <Tooltip title="Enable Range Calendar">
            <Switch
              checked={this.state.withRange}
              onChange={this.changeCalendar}
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
          <form style={{display: 'flex', gap: 30, width: '80%'}} noValidate>
            <TextField
                style={{flex: 1}}
              id="date"
              label="Start Date"
              type="date"
              defaultValue={moment(this.props.moduleOptions.dateRange.startDate).format('YYYY-MM-DD')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
                style={{flex: 1}}
                id="date"
                label="End Date"
                type="date"
                defaultValue={moment(this.props.moduleOptions.dateRange.endDate).format('YYYY-MM-DD')}
                InputLabelProps={{
                  shrink: true,
                }}
            />
          </form>
        )}
      </React.Fragment>
          {this.state.withRange ? (
              <DateRangePicker
                  style={{ backgroundColor: "white !important" }}
                  open={this.state.open}
                  toggle={this.setOpen}
                  onChange={(range) => this.setDateRange(range)}
              />
          ) : (
              <form style={{display: 'flex', gap: 30, width: '80%'}} noValidate>
                <TextField
                    style={{flex: 1}}
                    id="date"
                    label="Start Date"
                    type="date"
                    defaultValue={moment(this.props.moduleOptions.dateRange.startDate).format('YYYY-MM-DD')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
                <TextField
                    style={{flex: 1}}
                    id="date"
                    label="End Date"
                    type="date"
                    defaultValue={moment(this.props.moduleOptions.dateRange.endDate).format('YYYY-MM-DD')}
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

CalendarModule.propTypes = {
  moduleOptions: PropTypes.object,
}

export default CalendarModule;
