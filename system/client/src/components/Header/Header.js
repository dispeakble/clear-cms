import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
// core components
import styles from "assets/jss/clear-crm/components/headerStyle.js";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

const useStyles = makeStyles(styles);

export default function Header(props) {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    React.useEffect(() => {
        if (props.changeColorOnScroll) {
            window.addEventListener("scroll", headerColorChange);
        }
        return function cleanup() {
            if (props.changeColorOnScroll) {
                window.removeEventListener("scroll", headerColorChange);
            }
        };
    });
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const headerColorChange = () => {
        const {color, changeColorOnScroll} = props;
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
    };
    const {color, leftLinks, brand, fixed, absolute} = props;
    const appBarClasses = classNames({
        [classes.appBar]: true,
        [classes[color]]: color,
        [classes.absolute]: absolute,
        [classes.fixed]: fixed
    });

    const dropDownList = [
        {title:"License", href:"/license"},
        {title:"About", href:"/about"},
        {divider: true},
        {title:"Logout", href:"/logout"}
    ];

    const handleRightMenuClick = (href) => {
        console.log(href)
    }
    return (
        <AppBar className={appBarClasses}>
            <Toolbar className={classes.container}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                >
                    <Menu/>
                </IconButton>
                <div className={classes.flex}>
                    <Button className={classes.title} href="/">{brand}</Button>
                </div>
                <div className={classes.rightDropdown}>
                    <CustomDropdown
                        buttonIcon={AccountCircle}
                        buttonText="Logged in as Admin"
                        dropdownHeader="Full Name"
                        buttonProps={{
                            className: classes.navLink,
                            color: "transparent"
                        }}
                        onClick={handleRightMenuClick}
                        dropdownList={dropDownList}
                    />
                </div>
            </Toolbar>
            <Drawer
                variant="temporary"
                anchor={"left"}
                open={mobileOpen}
                classes={{
                    paper: classes.drawerPaper
                }}
                onClose={handleDrawerToggle}
            >
                <div className={classes.appResponsive}>
                    {leftLinks}

                </div>
            </Drawer>
        </AppBar>
    );
}

Header.defaultProp = {
    color: "rgba(0,0,0,.87)"
};

Header.propTypes = {
    color: "rgba(0,0,0,.87)",
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
            "dark"
        ]).isRequired
    })
};
