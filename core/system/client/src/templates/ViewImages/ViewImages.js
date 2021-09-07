import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/images.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";

class Images extends Component {
    state = {
    };

    componentDidMount() {
        this.fetchImages();
    }

    async fetchImages() {
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Images</title>
                </Helmet>
                <div className={classes.panel}>
                    images
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Images));
