import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/locality.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";

class Locality extends Component {
    state = {
    };

    componentDidMount() {
        this.fetchLocality();
    }

    async fetchLocality() {
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Locality</title>
                </Helmet>
                <div className={classes.panel}>
                    locality
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Locality));
