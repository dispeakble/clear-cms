import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/clear-crm/views/notFound.js";

class ViewNotFound extends Component {
  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.notFoundWrapper}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
      </div>
    );
  }
}

export default withStyles(styles)(ViewNotFound);
