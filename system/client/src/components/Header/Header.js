import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Modal from "components/Modal/Modal";
import { withRouter } from "react-router-dom";

import Menu from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";

import styles from "assets/jss/clear-crm/components/headerStyle.js";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

class Header extends Component {
  state = {
    mobileOpen: false,
    showAboutModal: false,
    showLicenseModal: false,
    user:{
      fullname:"Admin"
    },
    licenseModal: {
      name: "licenseModal",
      title: "License Agreement",
      content: "License",
      closeButton: {
        callback: () => {
          this.setState({ showLicenseModal: false });
        },
        label: "Close",
      },
      confirmButton: {
        show: true,
        callback: () => {
          this.setState({ showLicenseModal: false });
        },
        label: "Confirm",
      },
    },
    aboutModal: {
      name: "about",
      title: "About",
      content: "About",
      closeButton: {
        callback: () => {
          this.setState({ showAboutModal: false });
        },
        label: "Close",
      },
    },
  };

  componentDidMount() {
    let headerScroll = () => {
      try {
        this.headerColorChange(this);
      } catch (er) {
        console.log(er);
      }
    };
    if (this.props.changeColorOnScroll) {
      window.removeEventListener("scroll", headerScroll);
    }
    if (this.props.changeColorOnScroll) {
      window.addEventListener("scroll", headerScroll);
    }
    try {
      let admin = JSON.parse(localStorage.getItem('admin'));
      if(admin){
        this.setState({
          user: admin
        })
      }

    } catch (err){
      console.log(err);
    }
  }

  headerColorChange(self) {
    const { color, changeColorOnScroll, classes } = self.props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  }

  dropDownList = [
    {
      title: "Admin Profile",
      id: "adminProfile",
      modal: "adminProfile",
      href: '#'
    },
    {
      title: "License",
      id: "license",
      modal: "License",
      href: '#'
    },
    {
      title: "About",
      id: "about",
      modal: "About",
      href: '#'
    },
    { divider: true },
    { title: "Logout", href: "/logout", id: "logout" }
  ];

  handleRightMenuClick = (event) => {
    const modalValue = event.target.getAttribute("modal");
    if (modalValue) {
      if (modalValue === "adminProfile") {
        this.props.history.push("/admin-profile");
      } else {
        setTimeout(() => {
          //TODO populate the modal content here
          let modalState = {};
          modalState["show" + modalValue + "Modal"] = true;
          this.setState(modalState);
        }, 1000);
      }
    }
  };
  render() {
    const classes = this.props.classes;

    const { color, absolute, fixed } = this.props;

    const appBarClasses = classNames({
      [classes.appBar]: true,
      [classes[color]]: this.props.color,
      [classes.absolute]: this.props.absolute,
      [classes.fixed]: this.props.fixed,
    });

    return (
      <div>
        <AppBar className={appBarClasses}>
          <Toolbar className={classes.container}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.handleDrawerToggle}
            >
              <Menu />
            </IconButton>
            <div className={classes.flex}>
              <Button className={classes.title} href="/">
                {this.props.brand}
              </Button>
            </div>
            <div className={classes.rightDropdown}>
              <CustomDropdown
                buttonIcon={AccountCircle}
                buttonText={`Logged in as ${this.state.user.fullname}`}
                buttonProps={{
                  className: classes.navLink,
                  color: "transparent",
                }}
                onClick={this.handleRightMenuClick}
                dropdownList={this.dropDownList}
              />
            </div>
          </Toolbar>
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={this.props.mobileOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
            onClose={this.props.handleDrawerToggle}
          >
            <div className={classes.appResponsive}>{this.props.leftLinks}</div>
          </Drawer>
        </AppBar>
        <Modal //TODO CONVERT TO COMPONENT
          showModal={this.state.showLicenseModal}
          {...this.state.licenseModal}
        />
        <Modal //TODO CONVERT TO COMPONENT
          showModal={this.state.showAboutModal}
          {...this.state.aboutModal}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Header));

Header.defaultProp = {
  color: "rgba(0,0,0,.87)",
};

Header.propTypes = {
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark",
    ]).isRequired,
  }),
};
