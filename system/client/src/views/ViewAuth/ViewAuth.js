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
    cardAnimaton: "cardHidden",
    buttonState: true,
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
    const authCredentials = {
      email: "abc@gmail.com",
      password: "abc",
    };

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
                        labelText="Email"
                        id="email"
                        formControlProps={{
                          fullWidth: true,
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
                        disabled={!this.state.buttonState}
                        type="submit"
                        color="primary"
                        size="lg"
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
