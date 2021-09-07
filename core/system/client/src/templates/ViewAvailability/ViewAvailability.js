import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/availability.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";

class Availability extends Component {
    state = {
    };

    componentDidMount() {
        this.fetchAvailability();
    }

    async fetchAvailability() {
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Availability</title>
                </Helmet>
                <div className={classes.panel}>
                    availability
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Availability));
