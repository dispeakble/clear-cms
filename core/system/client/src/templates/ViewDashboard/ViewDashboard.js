import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";

import {Helmet} from "react-helmet";

import styles from "assets/jss/clear-crm/views/profilePage.js";

class ViewAdminProfile extends Component {
    state = {

    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {

    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>Dashboard</title>
                </Helmet>

            </div>
        );
    }
}

export default withStyles(styles)(ViewAdminProfile);
