import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
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
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";

import styles from "assets/jss/clear-crm/views/viewAuth.js";

import image from "assets/img/view-auth-bg.png";

class ViewAuth extends Component {
  state = {
    authButtonDisabled: { disabled: "disabled" },
    buttonState: false,
    credentialsPassed: false,
    emailValid: false,
    passwordValid: false,
    email: "",
    password: "",
    credentialsErrorMessage: "",
    removeResetMessage: "",
  };

  componentDidMount() {
    if (this.props.location.pathname === "/logout") {
      //TODO send logout message
      setTimeout(() => {
        this.props.history.push("/view-auth");
      }, 0);
    }
  }

  handleInputChange = (event) => {
    switch (event.target.id) {
      case "email":
        let emailValid =
          event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
          event.target.value.length <= 30;

        this.setState({emailValid: emailValid, email: event.target.value,}, this.applyAuthButtonState);

        break;
      case "password":
        this.setState(
          {
            passwordValid:
              event.target.value.length >= 3 && event.target.value.length <= 30,
            password: event.target.value,
          },
          this.applyAuthButtonState
        );

        break;
    }

    this.setState({removeResetMessage: "none", credentialsErrorMessage: "",});
  };

  applyAuthButtonState = () => {
    if (
      this.props.location.pathname === "/view-auth" ||
      this.props.location.pathname === "/view-auth/recovered"
    ){
      this.setState({
        authButtonDisabled:
          this.state.emailValid && this.state.passwordValid
            ? {}
            : { disabled: "disabled" },
      });
    } else {
      this.setState({
        authButtonDisabled: this.state.emailValid
          ? {}
          : { disabled: "disabled" },
      });
    }
  };

  removeErrorMessage = () => {
    this.setState({ credentialsPassed: true });
  };

  onSubmit = (event) => {
    event.preventDefault();

    const { history } = this.props;

    if (
      this.props.location.pathname === "/view-auth" ||
      this.props.location.pathname === "/view-auth/recovered"
    ) {

      this.props.control.login({
        email:this.state.email,
        password:this.state.password
      });

      //history.push("/");

    } else {
      //this.setState({ removeResetMessage: "" });
      //history.push("/view-auth/recovered");

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

    let headerText = "";

    switch(this.props.location.pathname){
      default:
        headerText = "Admin login";
        break;
      case "/recover-password":
        headerText = "Recover password";
        break;
    }

    return (
      <div>
        <Helmet>
          <title>
            {this.props.location.pathname === "/recover-password"
              ? "Recover Password"
              : "Authentication"}
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
          {resetSuccessMessage}
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem lg={3} md={4} sm={6} xs={10} xxs={12}>
                <Card>
                  <form onSubmit={this.onSubmit} className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>{headerText}</h4>
                    </CardHeader>
                    <p className={classes.divider}>{loginText}</p>
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
                      {loginOrRetrievePasswordURL ||
                      this.props.location.pathname ===
                      "/view-auth/recovered" ? (
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
                              <p onClick={this.removeErrorMessage}>
                                I forgot my password
                              </p>
                            </Link>
                          </React.Fragment>

                      ) : (
                        <Link className={classes.recoverPassword} to="/view-auth">
                          <p onClick={this.removeErrorMessage}>
                            Back to login
                          </p>
                        </Link>
                      )}

                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        onClick={this.onSubmit}
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
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ViewAuth);
