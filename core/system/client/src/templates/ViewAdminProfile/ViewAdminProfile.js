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
        fname: "",
        lname: "",
        email: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
        saveDisabled: false,
        newPasswordsCoincide: false,
        validation: {
            fname: {valid: false, empty: true},
            lname: {valid: false, empty: true},
            email: {valid: false, empty: true},
            password: {valid: false, empty: true},
            newPassword: {valid: false, empty: true},
            confirmPassword: {valid: false, empty: true}
        },
        newPassStrength: -1,
        confirmPassStrength: -1,
        errors: "",
        messages: "",
        notification: ""
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        
            const profileData = await this.props.control.get();
            if (profileData && profileData.email && profileData.fname && profileData.lname) {
                let validation = this.state.validation;
                validation.fname = {
                    valid: true,
                    empty: false
                };
                validation.lname = {
                    valid: true,
                    empty: false
                };
                validation.email = {
                    valid: true,
                    empty: false
                };
                this.setState({
                    validation: validation,
                    fname: profileData.fname,
                    lname: profileData.lname,
                    email: profileData.email
                })
            }
     

    }

    checkPasswordStrength = (passwordStrengthId, value) => {
        const hasNumber = (value) => {
            return new RegExp(/[0-9]/).test(value);
        };

        const hasMixed = (value) => {
            return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
        };

        const hasSpecial = (value) => {
            return new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
        };

        if (value.length >= 7 && hasNumber(value) && hasMixed(value) && hasSpecial(value)) {
            this.setState({[passwordStrengthId]: 3});
        } else if (
            (value.length >= 6 && hasNumber(value) && hasMixed(value)) ||
            (value.length >= 6 && hasNumber(value) && hasSpecial(value)) ||
            (value.length >= 6 && hasMixed(value) && hasSpecial(value))
        ) {
            this.setState({[passwordStrengthId]: 2});
        } else if (
            (value.length >= 5 && hasNumber(value)) ||
            (value.length >= 5 && hasMixed(value)) ||
            (value.length >= 5 && hasSpecial(value))
        ) {
            this.setState({[passwordStrengthId]: 1});
        } else if (value.length >= 5) {
            this.setState({[passwordStrengthId]: 0});
        } else {
            this.setState({[passwordStrengthId]: -1});
        }
    };

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
        let currentValue = event.target.value;
        let newState = {};
        let currentEventId = "";
        let validation = this.state.validation;
        let saveDisabled = false;
        newState[event.target.id] = event.target.value;
        validation[event.target.id].valid = this.help.between({value: event.target.value.length, min: 3, max: 30});
        validation[event.target.id].empty = event.target.value.length === 0;
        switch (event.target.id) {
            case "email":
                validation["email"].valid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
                    event.target.value.length <= 30;
                break;
            case "newPassword":
                currentEventId = "newPassStrength";
                break;
            case "confirmPassword":
                currentEventId = "confirmPassStrength";
                break;
            default:
                break;
        }

        if (!validation['password'].empty && (validation['newPassword'].empty || validation['confirmPassword'].empty)) {
            saveDisabled = true;
        }

        if (validation['fname'].empty || validation['lname'].empty || validation['email'].empty) {
            saveDisabled = true;
        }

        newState.validation = validation;

        await this.setAsyncState(newState);

        this.checkPasswordStrength(currentEventId, currentValue);

        this.setState({
            saveDisabled: saveDisabled
        });
    };

    validateForm = async (event) => {
        event.preventDefault();
        let newPasswordsCoincide = this.state.newPassword === this.state.confirmPassword;

        let errors = [];

        if (!this.state.validation.fname.valid || this.state.validation.fname.empty) {
            errors.push('First name is not valid or not filled in')
        }

        if (!this.state.validation.lname.valid || this.state.validation.lname.empty) {
            errors.push('Last name is not valid or not filled in')
        }

        if (!this.state.validation.email.valid || this.state.validation.email.empty) {
            errors.push('Email is not valid or not filled in')
        }

        if (!this.state.validation.password.empty) {

            let passConfirmError = "";

            if (!newPasswordsCoincide) {
                passConfirmError = 'Please confirm the exact password';
            }

            if (!this.state.validation.newPassword.valid || this.state.validation.newPassword.empty) {
                passConfirmError = 'The New password is not valid. Please fill in a password between 3 and 30 characters';
            }

            if(passConfirmError.length) {
                errors.push(passConfirmError);
            }
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
            fname: this.state.fname,
            lname: this.state.lname,
            email: this.state.email,
            password: this.state.password,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        });
        if (result) {
            if (result.hasOwnProperty('success')) {
                this.openNotification({
                    open: true,
                    color: "success",
                    message: result.success
                });
            } else if (result.hasOwnProperty('error')) {
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

        const classes = this.props.classes;

        let strengthColors = ["red", "orange", "yellow", "darkgreen"];
        let strengthTitle = ["weak", "medium", "strong", "very-strong"];

        let newPasswordStrengthTitle = "";
        let confirmPasswordStrengthTitle = "";

        let newPasswordStrength = strengthColors.map((i) => {
            return "transparent";
        });

        if (this.state.newPassStrength > -1) {
            newPasswordStrengthTitle = "";
            for (var i = 0; i <= this.state.newPassStrength; i++) {
                newPasswordStrength[i] = strengthColors[i];
                newPasswordStrengthTitle = strengthTitle[i].replace('-', ' ') + ' password';
            }
        }

        let confirmPasswordStrength = strengthColors.map((index) => {
            return "transparent";
        });

        if (this.state.confirmPassStrength > -1) {
            newPasswordStrengthTitle = "";
            for (var x = 0; x <= this.state.confirmPassStrength; x++) {
                confirmPasswordStrength[x] = strengthColors[x];
                confirmPasswordStrengthTitle = strengthTitle[x].replace('-', ' ') + ' password';
            }
        }

        return (
            <div>
                <Helmet>
                    <title>Profile Page</title>
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
                            }}>Admin profile<Divider /></h4>

                            <div className={classes.container}>

                                <div className={classes.profile}>
                                    <div className={classes.name}>
                                        <form onSubmit={this.validateForm} autocomplete={"off"}>
                                            <div style={{display: "flex"}}>
                                                <CustomInput
                                                    className={classes.column} labelText="First Name" id="fname" required="required"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    value: this.state.fname,
                                                    type: "text",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}> account_circle </Icon>
                                                        </InputAdornment>
                                                    )
                                                }}/>

                                                <p style={{width: "15px"}}></p>

                                                <CustomInput
                                                    className={classes.column} labelText="Last Name" id="lname" required="required"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                    value: this.state.lname,
                                                    type: "text",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}> account_circle </Icon>
                                                        </InputAdornment>
                                                    )
                                                }}/>

                                                <p style={{width: "15px"}}></p>

                                                <CustomInput
                                                    className={classes.column} labelText="Email" id="email"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: this.handleInputChange
                                                    }} inputProps={{
                                                        required:"required",
                                                    value: this.state.email,
                                                    type: "email",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}> email </Icon>
                                                        </InputAdornment>
                                                    )
                                                }}/>
                                            </div>
                                            <CustomInput
                                                labelText="Current password" id="password"
                                                formControlProps={{
                                                    autoComplete: "off",
                                                    fullWidth: true,
                                                    onChange: this.handleInputChange
                                                }} inputProps={{
                                                type: "password",
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Icon className={classes.inputIconsColor}> lock_outline </Icon>
                                                    </InputAdornment>
                                                ),
                                                autoComplete: "off"
                                            }}/>

                                            <CustomInput labelText="New password" id="newPassword" formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                                type: "password",
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip placement={"top"} arrow={true} open={true} title={newPasswordStrengthTitle}>
                                                            <div className={classes.passwordStrength} style={{
                                                                background: `conic-gradient(${newPasswordStrength.join(', ')} )`
                                                            }}></div>
                                                        </Tooltip>

                                                        <Icon className={classes.inputIconsColor}> lock_outline </Icon>
                                                    </InputAdornment>
                                                ),
                                                autoComplete: "off",
                                            }}/>
                                            <CustomInput labelText="Confirm new password" id="confirmPassword" formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                                type: "password",
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip placement={"top"} arrow={true} open={true} title={confirmPasswordStrengthTitle}>
                                                            <div className={classes.passwordStrength} style={{
                                                                background: `conic-gradient(${confirmPasswordStrength.join(', ')} )`
                                                            }}></div>
                                                        </Tooltip>
                                                        <Icon className={classes.inputIconsColor}> lock_outline </Icon>
                                                    </InputAdornment>
                                                ),
                                                autoComplete: "off",
                                            }}/>
                                            <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit" color="primary" size="lg" className={classes.button}>Save Profile</Button>
                                            <p style={{height: "15px", margin: 0}}>&nbsp;</p>
                                        </form>
                                    </div>
                                    {/*<div className={classes.syncToAccountWrapper}>
                                        <Tooltip title={"Link Twitter Account"} placement={"top"} arrow={true}>
                                            <Button link>
                                                <i className={"fab fa-twitter"}/>
                                                <div className={classes.syncAccountText}>Twitter</div>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title={"Link Facebook Account"} placement={"top"} arrow={true}>
                                            <Button link>
                                                <i className={"fab fa-facebook"}/>
                                                <div className={classes.syncAccountText}>Facebook</div>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title={"Link Google Account"} placement={"top"} arrow={true}>
                                            <Button link>
                                                <i className={"fab fa-google"}/>
                                                <div className={classes.syncAccountText}>Google</div>
                                            </Button>
                                        </Tooltip>
                                    </div>*/}
                                </div>

                            </div>
                        </div>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(ViewAdminProfile);
