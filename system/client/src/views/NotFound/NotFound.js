import React, { Component } from "react";
import CardBody from "../../components/Card/CardBody.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import { withStyles } from "@material-ui/core/styles";

import styles from "../../assets/jss/clear-crm/views/notFound.js";

class NotFound extends Component {
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

export default withStyles(styles)(NotFound);
