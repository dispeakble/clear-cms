import React, { Component } from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
//import Email from "@material-ui/icons/Email";
//import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { Link } from "react-router-dom";

import styles from "assets/jss/clear-crm/views/viewAuth.js";

import image from "assets/img/view-auth-bg.png";

class ViewAuth extends Component {
  state = {
    authButtonDisabled: { disabled: "disabled" },
    cardAnimaton: "cardHidden",
    buttonState: true,
    areCredentialsNotOK: false,
    email: "abc@gmail.com",
    password: "abc",
    emailValid: false,
    passwordValid: false,
    inputtedEmail: "",
    inputtedPassword: "",
  };

  handleInputChange = (event) => {
    let newState = {};
    switch (event.target.id) {
      case "email":
        //TODO validate email address here
        let emailValid = event.target.value.match(
          /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
        );

        if (emailValid) {
          this.setState({ emailValid: true }, this.applyAuthButtonState);
        } else {
          this.setState({ emailValid: false }, this.applyAuthButtonState);
        }

        newState = { inputtedEmail: event.target.value };
        break;
      case "password":
        if (event.target.value.length >= 5) {
          this.setState({ passwordValid: true }, this.applyAuthButtonState);
        } else {
          this.setState({ passwordValid: false }, this.applyAuthButtonState);
        }

        newState = { inputtedPassword: event.target.value };
        break;
    }

    this.setState(newState);
    console.log(event);
  };

  applyAuthButtonState = () => {
    this.setState({
      authButtonDisabled:
        this.state.emailValid && this.state.passwordValid
          ? {}
          : { disabled: "disabled" },
    });
  };

  handleCredentials = () => {
    console.log(this.state.inputtedEmail);
    console.log(this.state.email);

    if (
      this.state.inputtedEmail !== this.state.email ||
      this.state.inputtedPassword !== this.state.password
    ) {
      this.setState({ areCredentialsNotOK: true });
      console.log(this.state.areCredentialsNotOK);
    }
  };

  render() {
    const url = this.props.location.pathname;

    let loginOrRetrievePasswordURL = url === "/view-auth";

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
      console.log(event);
      //TODO check against authCredentials
      //TODO check valid email format
      //TODO add error messages
      //TODO
    };

    // const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    // setTimeout(function () {
    //   let state1 = [...this.state.cardAnimaton];
    //   let state2 = "";
    //   this.setState((state1: state2));
    // }, 700);
    const classes = this.props.classes;
    console.log(classes);

    let areCredentialsNotOK = this.state.areCredentialsNotOK;

    let credentialsErrorMessage;
    console.log(this.state.areCredentialsNotOK);

    if (areCredentialsNotOK) {
      credentialsErrorMessage = (
        <div className={classes.errorMessage}>Credentials are not OK</div>
      );
    } else {
      credentialsErrorMessage = <div className={classes.hidden}></div>;
    }

    return (
      <div>
        {/*<Header
          absolute
          color="transparent"
          brand="Crm System Authentication"
          rightLinks={<HeaderLinks />}
          {...rest}
        />*/}
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          {credentialsErrorMessage}
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card>
                  <form
                    onSubmit={(event) => {
                      onSubmit(event);
                    }}
                    className={classes.form}
                  >
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
                          type: "username",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                account_circle
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {loginOrRetrievePasswordURL ? (
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
                        {recoverPasswordText}
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
