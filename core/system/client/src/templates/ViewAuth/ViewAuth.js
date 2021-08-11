import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import {Link} from "react-router-dom";

import {Helmet} from "react-helmet";

import styles from "assets/jss/clear-crm/views/viewAuth.js";

import image from "assets/img/view-auth-bg.jpg";
import PropTypes from "prop-types";

class ViewAuth extends Component {
    state = {
        authButtonDisabled: {disabled: true},
        buttonState: false,
        emailValid: false,
        passwordValid: false,
        email: "",
        password: "",
        credentialsErrorMessage: "",
        removeResetMessage: "",
        resetSuccessMessage: null,
        loginText: "",
        loginButton: "",
        loginTitle: "",
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        if (this.props.location.pathname === "/logout") {
            setTimeout(async () => {
                await this.props.control.logout();
                localStorage.removeItem("admin");
                this.props.history.push("/view-auth");
                this.changeTexts();
            }, 0);
        } else if (this.props.location.pathname === "/view-auth/recovered") {
            this.setState({
                resetSuccessMessage: (
                    <div style={{display: this.state.removeResetMessage}}>
                        <Snackbar
                            open
                            place="tc"
                            color="success"
                            icon={DoneOutline}
                            message="Password successfully reset. Please check your e-mail."
                        />
                    </div>
                )
            });
        }
        else if (this.props.location.pathname === "/view-auth" && localStorage.getItem("admin")) {
            this.props.history.push("/");
        }

        this.changeTexts();

    }

    changeTexts(){
        const url = this.props.location.pathname;

        if (url.startsWith("/view-auth") || url.startsWith("/logout")) {
            this.setState({
                loginText: "Please type in your credentials",
                loginButton: "Access account",
                loginTitle: "Access your admin account"
            });
        } else if(url.startsWith("/recover-password")) {
            this.setState({
                loginText: "Enter your email address",
                loginButton: "Recover Password",
                loginTitle: "Recover your admin password"
            });
        }
    }

    handleInputChange = (event) => {
        switch (event.target.id) {
            case "email":
                const emailValid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                this.setState({emailValid: emailValid, email: event.target.value}, this.applyAuthButtonState);
                break;
            case "password":
                this.setState(
                    {
                        passwordValid: event.target.value.length >= 3 && event.target.value.length <= 30,
                        password: event.target.value
                    },
                    this.applyAuthButtonState
                );

                break;
            default:
                break;
        }

        this.setState({removeResetMessage: "none", credentialsErrorMessage: ""});
    };

    applyAuthButtonState = () => {
        if(this.props.location.pathname === "/view-auth" || this.props.location.pathname === "/view-auth/recovered") {
            this.setState({
                authButtonDisabled: this.state.emailValid && this.state.passwordValid ? {} : {disabled: true}
            });
        } else {
            this.setState({
                authButtonDisabled: this.state.emailValid ? {} : {disabled: true}
            });
        }
    };

    removeErrorMessage = () => {
        this.setState({credentialsErrorMessage: ""});
    };

    onSubmit = async (event) => {
        event.preventDefault();

        const {history} = this.props;
        let errorMessage = "";
        let credentialsPassed = true;
        const normalViews = ["/view-auth", "/view-auth/recovered", "logout"];

        if (normalViews.includes(this.props.location.pathname)) {

            const response = await this.props.control.login({
                email: this.state.email,
                password: this.state.password
            });

            if (response && response.email === this.state.email) {
                history.push("/");
                this.changeTexts();
            } else {
                credentialsPassed = false;
                errorMessage = "The entered credentials did not match any account.";
            }

        } else if (this.props.location.pathname === "/recover-password") {
            const response = this.props.control.recover({
                email: this.state.email
            });

            if (response && response.email === this.state.email) {
                history.push("/view-auth/recovered");
                this.changeTexts();
            } else {
                credentialsPassed = false;
                errorMessage = "Email not found. Please check the typed email and try again.";
            }
        }

        if (!credentialsPassed) {
            this.setState({
                credentialsErrorMessage: (
                    <Snackbar
                        open
                        place="tc"
                        color="warning"
                        icon={AddAlert}
                        message={errorMessage}
                    />
                ),
            });
        } else {
            this.setState({
                credentialsErrorMessage: "",
            });
        }
    };

    render() {
        const url = this.props.location.pathname;

        const classes = this.props.classes;

        let loginOrRetrievePasswordURL = url.startsWith("/view-auth");

        return (
            <div>
                <Helmet>
                    <title>
                        {this.state.loginTitle}
                    </title>
                </Helmet>
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: "url(" + image + ")",
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                    }}
                >
                    {this.state.credentialsErrorMessage}
                    {this.state.resetSuccessMessage}
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem lg={3} md={4} sm={6} xs={10} xxs={12}>
                                <Card>
                                    <form onSubmit={this.onSubmit} className={classes.form}>
                                        <CardHeader color="primary" className={classes.cardHeader}>
                                            <h4>{this.state.loginTitle}</h4>
                                        </CardHeader>
                                        <p className={classes.divider}>{this.state.loginText}</p>
                                        <CardBody>
                                            <CustomInput
                                                name="email"
                                                labelText="Email"
                                                id="email"
                                                formControlProps={{
                                                    fullWidth: true,
                                                    onChange: (event) => this.handleInputChange(event),
                                                }}
                                                inputProps={{
                                                    type: "email",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                account_circle
                                                            </Icon>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {loginOrRetrievePasswordURL || this.props.location.pathname === "/view-auth/recovered" ? (
                                                <React.Fragment>
                                                    <CustomInput
                                                        labelText="Password"
                                                        id="password"
                                                        formControlProps={{
                                                            fullWidth: true,
                                                            onChange: (event) => this.handleInputChange(event),
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Icon className={classes.inputIconsColor}>
                                                                        lock_outline
                                                                    </Icon>
                                                                </InputAdornment>
                                                            ),
                                                            autoComplete: "off",
                                                        }}
                                                    />
                                                    <Link className={classes.recoverPassword} to="/recover-password">
                                                        <p onClick={() => setTimeout(() => this.changeTexts(), 30)}>
                                                            I forgot my password
                                                        </p>
                                                    </Link>
                                                </React.Fragment>
                                            ) : (
                                                <Link className={classes.recoverPassword} to="/view-auth">
                                                    <p onClick={() => setTimeout(() => this.changeTexts(), 30)}>
                                                        Back to login
                                                    </p>
                                                </Link>
                                            )}
                                        </CardBody>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button onClick={this.onSubmit} type="submit" color="primary" size="lg"
                                                {...this.state.authButtonDisabled}>
                                                {this.state.loginButton}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ViewAuth);

ViewAuth.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    control: PropTypes.object
};