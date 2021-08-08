import React from "react";
import { SketchPicker } from "react-color";
import { withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";

import ColorSquare from "./color-square";
import {IconButton} from "@material-ui/core";

const styles = () => ({
  avatar: {
    height: 25,
    width: 25,
  },
});

const anchorOrigin = {
  vertical: "bottom",
  horizontal: "left",
};

class ColorEditionSquare extends React.Component {
  state = {
    anchor: null,
  };

  handleClick = (event) => {
    this.setState({ anchor: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchor: null });
  };

  handleChange = (color) => {
    this.props.onChange(this.props.name, color);
  };

  render() {
    const { classes, rootClassName } = this.props;
    return (
      <React.Fragment>
        <IconButton button="true" className={rootClassName} onClick={this.handleClick}>
          <ColorSquare
            {...this.props}
            color={this.props.value}
          />
        </IconButton>
        <Popover
          anchorEl={this.state.anchor}
          anchorOrigin={anchorOrigin}
          onClose={this.handleClose}
          open={Boolean(this.state.anchor)}
        >
          <SketchPicker
            color={this.props.value}
            onChange={this.handleChange}
            onChange={this.handleChange}
          />
        </Popover>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ColorEditionSquare);
