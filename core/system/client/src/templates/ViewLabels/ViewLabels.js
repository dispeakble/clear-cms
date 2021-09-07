import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/labels.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";

class Labels extends Component {
    state = {
    };

    componentDidMount() {
        this.fetchLabels();
    }

    async fetchLabels() {
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Labels</title>
                </Helmet>
                <div className={classes.panel}>
                    labels
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Labels));
