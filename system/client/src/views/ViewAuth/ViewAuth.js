import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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

import styles from "assets/jss/clear-crm/views/viewAuth.js";

import image from "assets/img/view-auth-bg.png";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(styles);

export default function ViewAuth(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;
  const authCredentials = {
      email:"abc@gmail.com",
      password:"abc"
  };

  const url = props.location.pathname;

  let showPassword = (url === '/view-auth');

  const loginText = showPassword ? "Please type in your credentials" : "Enter your email address";

  const onSubmit = (event) => {
      event.preventDefault();
      console.log(event);
      //TODO check against authCredentials
      //TODO check valid email format
      //TODO add error messages
      //TODO
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
          backgroundPosition: "center center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form onSubmit={(event) => {onSubmit(event)}} className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Crm System Authentication</h4>
                  </CardHeader>
                  <p className={classes.divider}>{loginText}</p>
                  <CardBody>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "username",
                        endAdornment: (
                          <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                  account_circle
                              </Icon>
                          </InputAdornment>
                        )
                      }}
                    />
                      { showPassword ? <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
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
                        autoComplete: "off"
                      }}
                    /> : <React.Fragment></React.Fragment>}
                      <Link className={classes.recoverPassword} target="/recover-password">Forgot password?</Link>
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button type="submit" color="primary" size="lg">
                      Access account
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
