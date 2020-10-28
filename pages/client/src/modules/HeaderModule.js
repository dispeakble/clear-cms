import React, { Component } from "react";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "../assets/jss/pagesAdd.js";

class HeaderModule extends Component {
  state = {};
  sendModule = () => {
    return (
      <div
        key={this.props.i}
        data-grid={this.props.element}
        style={this.props.style}
        className={
          this.props.element.moduleOptions.data.isModuleSticky
            ? this.props.classes.itemWrapper
            : ""
        }
      >
        <a
          title={this.props.element.moduleOptions.data.logoTitle}
          href={this.props.element.moduleOptions.data.logoLink}
          target="_blank"
        >
          <img
            className={this.props.classes.logoImage}
            src={this.props.element.moduleOptions.data.logoImage}
            alt={this.props.element.moduleOptions.data.logoTitle}
          />
        </a>
      </div>
    );
  };
  render() {
    const classes = this.props.classes;

    return this.sendModule();
  }
}

export default withStyles(styles)(HeaderModule);
