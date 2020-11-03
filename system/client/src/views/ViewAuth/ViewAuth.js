import React, { Component } from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
// @material-ui/icons
//import Email from "@material-ui/icons/Email";
//import People from "@material-ui/icons/People";
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
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";

import styles from "assets/jss/clear-crm/views/viewAuth.js";

import image from "assets/img/view-auth-bg.png";

class ViewAuth extends Component {
  state = {
    authButtonDisabled: { disabled: "disabled" },
    cardAnimaton: "cardHidden",
    buttonState: true,
    credentialsPassed: true,
    email: "abc@gmail.com",
    password: "abcde",
    emailValid: false,
    passwordValid: false,
    inputtedEmail: "",
    inputtedPassword: "",
    redirectedFromRecoverPassword: false,
    credentialsErrorMessage: "",
    removeResetMessage: "",
  };

  componentDidMount() {
    if (this.props.location.pathname === "/logout") {
      setTimeout(() => {
        this.props.history.push("/view-auth");
      }, 1000);
    }
  }

  handleInputChange = (event) => {
    let newState = {};
    switch (event.target.id) {
      case "email":
        //TODO validate email address here
        let emailValid =
          event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
          event.target.value.length <= 30;

        this.setState({ emailValid: emailValid }, this.applyAuthButtonState);

        newState = {
          inputtedEmail: event.target.value,
        };
        break;
      case "password":
        this.setState(
          {
            passwordValid:
              event.target.value.length >= 5 && event.target.value.length <= 30,
          },
          this.applyAuthButtonState
        );

        newState = {
          inputtedPassword: event.target.value,
        };
        break;
    }

    this.setState(newState);

    this.setState({
      credentialsErrorMessage: "",
    });

    this.setState({ removeResetMessage: "none" });
  };

  applyAuthButtonState = () => {
    if (
      this.props.location.pathname === "/view-auth" ||
      this.props.location.pathname === "/view-auth/recovered"
    )
      this.setState({
        authButtonDisabled:
          this.state.emailValid && this.state.passwordValid
            ? {}
            : { disabled: "disabled" },
      });
    else {
      this.setState({
        authButtonDisabled: this.state.emailValid
          ? {}
          : { disabled: "disabled" },
      });
    }
  };

  handleCredentials = () => {
    if (
      this.props.location.pathname === "/view-auth" ||
      this.props.location.pathname === "/view-auth/recovered"
    ) {
      if (
        this.state.inputtedEmail !== this.state.email ||
        this.state.inputtedPassword !== this.state.password
      ) {
        this.setState({ credentialsPassed: false });
      }
    }
    if (this.props.location.pathname === "/recover-password") {
      if (this.state.inputtedEmail !== this.state.email) {
        this.setState({ credentialsPassed: false });
      }
    }
  };

  removeErrorMessage = () => {
    this.setState({ credentialsPassed: true });
  };

  render() {
    const url = this.props.location.pathname;

    const classes = this.props.classes;

    let loginOrRetrievePasswordURL = url.startsWith("/view-auth");

    const loginText = loginOrRetrievePasswordURL
      ? "Please type in your credentials"
      : "Enter your email address";

    const submitButtonText = loginOrRetrievePasswordURL
      ? "Access account"
      : "Recover Password";

    const recoverPasswordText = loginOrRetrievePasswordURL
      ? "Forgot Password ?"
      : "";

    const onSubmit = (event) => {
      event.preventDefault();

      const { history } = this.props;

      const loginState =
        this.state.inputtedEmail === this.state.email &&
        this.state.inputtedPassword === this.state.password;

      const loginStateOnRecoverPassword =
        this.state.inputtedEmail === this.state.email;

      if (
        this.props.location.pathname === "/view-auth" ||
        this.props.location.pathname === "/view-auth/recovered"
      ) {
        if (loginState) {
          history.push("/");
        }
      } else {
        if (loginStateOnRecoverPassword) {
          this.setState({ removeResetMessage: "" });
          history.push("/view-auth/recovered");
        }
      }
      let credentialsPassed = this.state.credentialsPassed;

      const errorMessageContent =
        this.props.location.pathname === "/view-auth" ||
        this.props.location.pathname === "/view-auth/recovered"
          ? "The entered credentials did not match any account."
          : "We could not find the entered email address.";

      if (!credentialsPassed) {
        this.setState({
          credentialsErrorMessage: (
            <Snackbar
              open
              place="tc"
              color="warning"
              icon={AddAlert}
              message={errorMessageContent}
            />
          ),
        });
      } else {
        this.setState({
          credentialsErrorMessage: "",
        });
      }
    };

    let resetSuccessMessage;

    if (this.props.location.pathname === "/view-auth/recovered") {
      resetSuccessMessage = (
        <div style={{ display: this.state.removeResetMessage }}>
          <Snackbar
            open
            place="tc"
            color="success"
            icon={DoneOutline}
            message="Password successfully reset. Please check your e-mail."
          />
        </div>
      );
    }

    return (
      <div>
        <Helmet>
          <title>Authentication</title>
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
          {resetSuccessMessage}
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card>
                  <form onSubmit={onSubmit} className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Crm System Authentication</h4>
                    </CardHeader>
                    <p className={classes.divider}>{loginText}</p>
                    <CardBody>
                      <CustomInput
                        name="inputtedEmail"
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
                      {loginOrRetrievePasswordURL ||
                      this.props.location.pathname ===
                        "/view-auth/recovered" ? (
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
                      ) : (
                        <React.Fragment></React.Fragment>
                      )}
                      <Link
                        className={classes.recoverPassword}
                        to="/recover-password"
                      >
                        <p onClick={this.removeErrorMessage}>
                          {recoverPasswordText}
                        </p>
                      </Link>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        onClick={this.handleCredentials}
                        type="submit"
                        color="primary"
                        size="lg"
                        {...this.state.authButtonDisabled}
                      >
                        {submitButtonText}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          {/*<Footer whiteFont />*/}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ViewAuth);
