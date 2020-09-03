import React, { Component } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";

import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
import CardFooter from "components/Card/CardFooter.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/clear-crm/views/profilePage.js";

class ProfilePage extends Component {
  state = {
    name: "Jon Snow",
    nameValid: true,
    email: "abc@gmail.com",
    emailValid: true,
    password: "abcde",
    currentPassword: "",
    currentPasswordValid: "",
    currentPasswordNotEmpty: "",
    newPassword: "",
    newPasswordValid: false,
    newPasswordNotEmpty: "",
    newPasswordAgain: "",
    newPasswordAgainValid: false,
    newPasswordAgainNotEmpty: "",
    newPasswordsCoincide: false,
    credentialsErrorMessage: "",
    credentialsSuccessMessage: "",
    isButtonDisabled: true,
    removeErrorMessage: "none",
    removeSuccessMessage: "none",
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  handleInputChange = (event) => {
    let newState = {};
    switch (event.target.id) {
      case "name":
        let nameValid =
          event.target.value.length >= 3 && event.target.value.length <= 30;

        this.setState({ nameValid });

        newState = {
          name: event.target.value,
        };
        break;
      case "email":
        let emailValid =
          event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
          event.target.value.length <= 30;

        this.setState({ emailValid });

        newState = {
          email: event.target.value,
        };
        break;
      case "currentPassword":
        let currentPasswordValid =
          event.target.value.length >= 5 &&
          event.target.value.length <= 30 &&
          event.target.value === this.state.password;

        this.setState({ currentPasswordValid });

        newState = {
          currentPassword: event.target.value,
          currentPasswordNotEmpty: event.target.value.length > 0 ? true : "",
        };
        break;
      case "newPassword":
        let newPasswordValid =
          event.target.value.length >= 5 && event.target.value.length <= 30;

        this.setState({ newPasswordValid });
        newState = {
          newPassword: event.target.value,
          newPasswordNotEmpty: event.target.value.length > 0 ? true : "",
        };
        break;
      case "newPasswordAgain":
        let newPasswordAgainValid =
          event.target.value.length >= 5 && event.target.value.length <= 30;

        this.setState({ newPasswordAgainValid });
        newState = {
          newPasswordAgain: event.target.value,
          newPasswordAgainNotEmpty: event.target.value.length > 0 ? true : "",
        };
        break;
    }

    this.setState(newState);

    this.setState({
      removeErrorMessage: "none",
      removeSuccessMessage: "none",
      isButtonDisabled: "",
    });
  };

  handleCredentials = async (event) => {
    event.preventDefault();

    let newPasswordsCoincide =
      this.state.newPassword === this.state.newPasswordAgain;

    await this.setAsyncState({ newPasswordsCoincide });

    console.log(newPasswordsCoincide);

    if (this.state.nameValid === true) {
      if (this.state.emailValid) {
        if (
          this.state.currentPasswordNotEmpty &&
          this.state.newPasswordNotEmpty &&
          this.state.newPasswordAgainNotEmpty
        ) {
          if (this.state.currentPasswordValid) {
            if (
              this.state.newPasswordValid === true &&
              this.state.newPasswordAgainValid === true
            ) {
              if (this.state.newPasswordsCoincide) {
                this.setState({
                  removeErrorMessage: "none",
                  removeSuccessMessage: "",
                  credentialsSuccessMessage:
                    "Credentials successfully changed !",
                });
              } else {
                this.setState({
                  removeSuccessMessage: "none",
                  removeErrorMessage: "",
                  credentialsErrorMessage:
                    "Re-entered password doesn't match with the entered password",
                });
              }
            } else {
              this.setState({
                removeSuccessMessage: "none",
                removeErrorMessage: "",
                credentialsErrorMessage:
                  "The newly assigned password must be between 5 and 30 characters ! Both fields have to be filled in !",
              });
            }
          } else {
            this.setState({
              removeSuccessMessage: "none",
              removeErrorMessage: "",
              credentialsErrorMessage: "Current password is incorrect",
            });
          }
        } else if (
          !this.state.currentPasswordNotEmpty &&
          !this.state.newPasswordNotEmpty &&
          !this.state.newPasswordAgainNotEmpty
        ) {
          this.setState({
            removeErrorMessage: "none",
            removeSuccessMessage: "",
            credentialsSuccessMessage: "Credentials successfully changed !",
          });
        } else {
          this.setState({
            removeSuccessMessage: "none",
            removeErrorMessage: "",
            credentialsErrorMessage: "All 3 password fields must be completed",
          });
        }
      } else {
        this.setState({
          removeSuccessMessage: "none",
          removeErrorMessage: "",
          credentialsErrorMessage: "The provided E-mail address is not valid",
        });
      }
    } else {
      this.setState({
        removeSuccessMessage: "none",
        removeErrorMessage: "",
        credentialsErrorMessage:
          "The name must be between 3 and 30 characters long",
      });
    }
  };

  render() {
    const classes = this.props.classes;

    let resetErrorMessage = (
      <div style={{ display: this.state.removeErrorMessage }}>
        <Snackbar
          open
          place="tc"
          color="warning"
          icon={AddAlert}
          message={this.state.credentialsErrorMessage}
        />
      </div>
    );

    let resetSuccessMessage = (
      <div style={{ display: this.state.removeSuccessMessage }}>
        <Snackbar
          open
          place="tc"
          color="success"
          icon={DoneOutline}
          message={this.state.credentialsSuccessMessage}
        />
      </div>
    );

    return (
      <div>
        <Header
          color="transparent"
          brand="Clear CRM"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white",
          }}
        />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            {resetErrorMessage}
            {resetSuccessMessage}
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div className={classes.name}>
                      <h3 className={classes.title}>Admin Profile Settings</h3>
                      <form>
                        <CardBody>
                          <CustomInput
                            labelText="Name"
                            id="name"
                            required="required"
                            formControlProps={{
                              fullWidth: true,
                              onChange: (event) =>
                                this.handleInputChange(event),
                            }}
                            inputProps={{
                              value: this.state.name,
                              type: "text",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputIconsColor}>
                                    account_circle
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <CustomInput
                            labelText="Please enter new email address"
                            id="email"
                            required="required"
                            formControlProps={{
                              fullWidth: true,
                              onChange: (event) =>
                                this.handleInputChange(event),
                            }}
                            inputProps={{
                              value: this.state.email,
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
                          <CustomInput
                            labelText="Enter Current Password"
                            id="currentPassword"
                            formControlProps={{
                              fullWidth: true,
                              onChange: (event) =>
                                this.handleInputChange(event),
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
                          <CustomInput
                            labelText="Enter New Password"
                            id="newPassword"
                            formControlProps={{
                              fullWidth: true,
                              onChange: (event) =>
                                this.handleInputChange(event),
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
                          <CustomInput
                            labelText="Re-Enter New Password"
                            id="newPasswordAgain"
                            formControlProps={{
                              fullWidth: true,
                              onChange: (event) =>
                                this.handleInputChange(event),
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
                          <Button
                            disabled={this.state.isButtonDisabled}
                            onClick={this.handleCredentials}
                            type="submit"
                            color="primary"
                            size="lg"
                          >
                            Save
                          </Button>

                          <h3>Link Accounts</h3>
                          <div className={classes.syncToAccountWrapper}>
                            <div className={classes.syncToAccount}>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-google"} />
                              </Button>
                              Sync with Google
                            </div>
                            <br />
                            <div className={classes.syncToAccount}>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-twitter"} />
                              </Button>
                              Sync with Twitter
                            </div>
                            <br />
                            <div className={classes.syncToAccount}>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-instagram"} />
                              </Button>
                              Sync with Instagram
                            </div>
                            <br />
                            <div className={classes.syncToAccount}>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-facebook"} />
                              </Button>
                              Sync with Facebook
                            </div>
                          </div>
                        </CardBody>
                      </form>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
