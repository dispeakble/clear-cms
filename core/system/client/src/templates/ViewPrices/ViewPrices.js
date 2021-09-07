import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/prices.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";

class Prices extends Component {
    state = {
    };

    componentDidMount() {
        this.fetchPrices();
    }

    async fetchPrices() {
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Prices</title>
                </Helmet>
                <div className={classes.panel}>
                    prices
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Prices));
