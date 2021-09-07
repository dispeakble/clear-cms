import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/products.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";

class Products extends Component {
    state = {
    };

    componentDidMount() {
        this.fetchProducts();
    }

    async fetchProducts() {
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Products</title>
                </Helmet>
                <div className={classes.panel}>
                    products
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Products));
