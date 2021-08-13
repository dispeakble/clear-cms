import React, {Component} from "react";
import classNames from "classnames";
import {withStyles} from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import {Helmet} from "react-helmet";

import CustomInput from "components/CustomInput/CustomInput.js";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/clear-crm/views/generalSettings";

import {Divider, TextField} from "@material-ui/core";
import moment from "moment-timezone";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";

class ViewGeneralSettings extends Component {
    state = {
        websiteName: "",
        websiteDomain: "",
        websiteOwner: "",
        websiteAdminEmail: "",
        applicationVersion: "",
        websiteTimezone: "",
        validation: {
            websiteName: {valid: false, empty: true},
            websiteDomain: {valid: false, empty: true},
            websiteOwner: {valid: false, empty: true},
            websiteAdminEmail: {valid: false, empty: true},
            applicationVersion: {valid: false, empty: true},
            websiteTimezone: {valid: false, empty: true}
        },
        errors: "",
        messages: "",
        notification: "",
        timezones: moment.tz.names()
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {

        const generalSettingsData = await this.props.control.get();

        if(generalSettingsData) {
            let validation = this.state.validation;
            validation.websiteName = {
                valid: true,
                empty: false
            };
            validation.websiteDomain = {
                valid: true,
                empty: false
            };
            validation.websiteOwner = {
                valid: true,
                empty: false
            };
            validation.websiteAdminEmail = {
                valid: true,
                empty: false
            };
            validation.applicationVersion = {
                valid: true,
                empty: false
            };
            validation.websiteTimezone = {
                valid: true,
                empty: false
            };
            this.setState({
                websiteName: generalSettingsData.websiteName,
                websiteDomain: generalSettingsData.websiteDomain,
                websiteOwner: generalSettingsData.websiteOwner,
                websiteAdminEmail: generalSettingsData.websiteAdminEmail,
                applicationVersion: generalSettingsData.applicationVersion,
                websiteTimezone: generalSettingsData.websiteTimezone
            })
        }
    }

    help = {
        between: (params) => {
            return params.value > params.min && params.value < params.max;
        }
    };

    handleInputChange = async (event) => {
        let errors = this.state.errors;
        if (errors) {
            this.setState({
                errors: ""
            })
        }
        let newState = {};
        let validation = this.state.validation;
        let saveDisabled = false;
        newState[event.target.id] = event.target.value;
        validation[event.target.id].valid = this.help.between({value: event.target.value.length, min: 3, max: 30});
        validation[event.target.id].empty = event.target.value.length === 0;
        switch (event.target.id) {
            case "websiteAdminEmail":
                validation["websiteAdminEmail"].valid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
                    event.target.value.length <= 30;
                break;
            default:
                break;
        }

        newState.validation = validation;

        await this.setAsyncState(newState);

        this.setState({
            saveDisabled: saveDisabled
        });
    };

    validateForm = async (event) => {
        event.preventDefault();

        let errors = [];

        if (!this.state.validation.websiteAdminEmail.valid || this.state.validation.websiteAdminEmail.empty) {
            errors.push('Email is not valid or not filled in')
        }

        if (errors.length) {
            this.setState({
                errors: errors.join('. ')
            });
        } else {
            this.setData();
        }
    };

    openNotification(params) {
        this.setState({
            notification: <Snackbar
                open={params.open}
                place={params.place || "tc"}
                color={params.color}
                icon={params.icon || DoneOutline}
                message={params.message}
            />
        });

        setTimeout(() => {
            this.setState({
                notification: ""
            })
        }, 5000)
    }

    async setData() {
        const result = await this.props.control.set({
        data: {
            websiteName: this.state.websiteName,
            websiteDomain: this.state.websiteDomain,
            websiteOwner: this.state.websiteOwner,
            websiteAdminEmail: this.state.websiteAdminEmail,
            applicationVersion: this.state.applicationVersion,
            websiteTimezone: this.state.websiteTimezone
        }});
        if (result) {
            if (result.success) {
                this.openNotification({
                    open: true,
                    color: "success",
                    message: result.success
                });
            } else if (result.error) {
                this.openNotification({
                    open: true,
                    color: "error",
                    message: result.error
                });
            }

        } else {
            this.openNotification({
                color: "warning",
                message: "Something went wrong"
            });
        }
    }

    render() {

        console.log("state", this.state)

        const classes = this.props.classes;

        return (
            <div>
                <Helmet>
                    <title>General Settings</title>
                </Helmet>
                <GridContainer className={classes.grid} justify="center">
                    <GridItem lg={6} md={8} sm={10} xs={12} className={classes.gridItem}>
                        <div className={classNames(classes.main, classes.mainRaised)}>
                            {this.state.notification}
                            {this.state.errors.length ? <Snackbar closeNotification={() => {
                                this.setState({errors: ""})
                            }} open place="tc" color="warning" icon={AddAlert} message={this.state.errors}/> : ''}
                            <h4 style={{
                                lineHeight: "3.0em",
                                paddingLeft: "15px",
                                paddingRight: "15px",
                                textAlign: "center"
                            }}>General Settings<Divider /></h4>

                            <div className={classes.container}>

                                <div className={classes.profile}>
                                    <div className={classes.name}>
                                        <form onSubmit={this.validateForm} autoComplete={"off"}>
                                            <div>
                                                <CustomInput
                                                    className={classes.column} labelText="Website Name" id="websiteName" required="required"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    value: this.state.websiteName,
                                                    type: "text"
                                                }}/>

                                                <p style={{width: "15px"}}></p>

                                                <CustomInput
                                                    className={classes.column} labelText="Website Domain" id="websiteDomain" required="required"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    value: this.state.websiteDomain,
                                                    type: "text",
                                                }}/>

                                                <p style={{width: "15px"}}></p>

                                                <CustomInput
                                                    className={classes.column} labelText="Website Owner" id="websiteOwner" required="required"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    value: this.state.websiteOwner,
                                                    type: "text",
                                                }}/>

                                                <p style={{width: "15px"}}></p>

                                                <CustomInput
                                                    className={classes.column} labelText="Website Admin Email" id="websiteAdminEmail"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    required:"required",
                                                    value: this.state.websiteAdminEmail,
                                                    type: "email",
                                                    // endAdornment: (
                                                    //     <InputAdornment position="end">
                                                    //         <Icon className={classes.inputIconsColor}> email </Icon>
                                                    //     </InputAdornment>
                                                    // )
                                                }}/>

                                                <CustomInput
                                                    className={classes.column} labelText="Application Version" id="applicationVersion" required="required"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    value: this.state.applicationVersion,
                                                    type: "text",
                                                }}/>

                                                <p style={{width: "15px"}}></p>

                                                <Autocomplete
                                                    options={this.state.timezones}
                                                    autoHighlight
                                                    className={this.props.classes.option}
                                                    defaultValue={this.state.timezones[this.state.timezones.indexOf("America/Indiana/Winamac")]}
                                                    onChange={(ev, value) => {
                                                        if (value) {
                                                            this.setState(
                                                                {
                                                                    websiteTimezone: value,
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    getOptionLabel={(option) => option + " (" + moment.tz(option).format("Z z") + ")"}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            className={this.props.classes.textfield}{...params}
                                                            label="Select Timezone"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />

                                                <p style={{width: "15px"}}></p>

                                            </div>
                                            <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit" color="primary" size="lg" className={classes.button}>Save Settings</Button>
                                            <p style={{height: "15px", margin: 0}}>&nbsp;</p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(ViewGeneralSettings);

ViewGeneralSettings.propTypes = {
    control: PropTypes.object,
    classes: PropTypes.object,
};
