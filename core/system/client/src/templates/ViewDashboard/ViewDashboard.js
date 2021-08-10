import React, {Component} from "react";
import classNames from "classnames";
import {withStyles} from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Tooltip from "@material-ui/core/Tooltip";

import {Helmet} from "react-helmet";

import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/clear-crm/views/profilePage.js";

import {Divider} from "@material-ui/core";

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
