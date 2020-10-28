import React, { Component } from "react";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

class HeaderModule extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div
        key={this.props.i}
        data-grid={this.props.element}
        className={
          this.props.element.moduleOptions.data.isModuleSticky
            ? classes.itemWrapper
            : ""
        }
      >
        <a
          title={this.props.element.moduleOptions.data.logoTitle}
          href={this.props.element.moduleOptions.data.logoLink}
          target="_blank"
        >
          <img
            style={{ width: "20%" }}
            className={classes.logoImage}
            src={this.props.element.moduleOptions.data.logoImage}
            alt={this.props.element.moduleOptions.data.logoTitle}
          />
        </a>
      </div>
    );
  }
}

export default withStyles(styles)(HeaderModule);
