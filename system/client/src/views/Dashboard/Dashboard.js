import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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
import Parallax from "components/Parallax/Parallax.js";

import styles from "assets/jss/clear-crm/views/dashboard.js";

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <div>
      <Header
        color="transparent"
        brand="Clear CRM"
        leftLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 10,
          color: "info",
        }}
        {...rest}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
            Lorem ipsum
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
