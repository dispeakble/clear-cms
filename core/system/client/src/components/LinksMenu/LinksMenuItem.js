import React from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";

import Icon from "@material-ui/core/Icon";

import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

import LinksMenuItemComponent from "./LinksMenuItemComponent";

const LinksMenuItem = (props) => {
    const {text, href, icon, children = []} = props;
    const classes = useStyles();
    const isExpandable = children && children.length > 0;
    const [open, setOpen] = React.useState(false);

    function handleClick() {
        setOpen(!open);
    }

    const MenuItemRoot = (
        <LinksMenuItemComponent
            accordionStyle={props.accordionStyle}
            menuLinksData={props.menuLinksData}
            className={classes.menuItem}
            style={{
                color: props.accordionStyle.color,
                backgroundColor: props.accordionStyle.bgColor,
                fontSize: props.accordionStyle.fontSize,
                fontFamily: props.accordionStyle.fontFamily,
                border: "1px solid rgba(0,0,0,0.3)",
            }}
            link={!children ? href : ""}
            onClick={handleClick}
        >
            <span style={{ marginRight: `${props.accordionStyle.menuIconSpace || 0}px`}}>
                <Icon style={{color: props.accordionStyle.color}}>
                {icon ? icon.replace(" ", "_").toLowerCase() : ""}
            </Icon>
            </span>


            <ListItemText primary={text}/>
            {isExpandable && !open && <IconExpandMore/>}
            {isExpandable && open && <IconExpandLess/>}
        </LinksMenuItemComponent>
    );

    const MenuItemChildren = isExpandable ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {children.map((item, index) => (
                    <LinksMenuItem
                        accordionStyle={props.accordionStyle}
                        menuLinksData={props.menuLinksData}
                        style={{
                            backgroundColor: props.accordionStyle.bgColor,
                            color: props.accordionStyle.color,
                            fontSize: props.accordionStyle.fontSize,
                            fontFamily: props.accordionStyle.fontFamily,
                            border: "1px solid rgba(0,0,0,0.3)",
                        }}
                        {...item}
                        key={index}
                    />
                ))}
            </List>
        </Collapse>
    ) : null;

    return (
        <>
            {MenuItemRoot}
            {MenuItemChildren}
        </>
    );
};

const useStyles = makeStyles(() =>
    createStyles({
        menuItem: {
            "&.active": {
                background: "rgba(0, 0, 0, 0.08)",
                "& .MuiListItemIcon-root": {
                    color: "#fff",
                },
            },
        },
        menuItemIcon: {
            color: "#97c05c",
        },
        MuiListItemText: {
            inset: {
                padding: 0,
            },
        },
    })
);

export default LinksMenuItem;
