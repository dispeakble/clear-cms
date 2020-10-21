import React from "react";
import PropTypes from "prop-types";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

import AppMenuItemComponent from "./AppMenuItemComponent";

const AppMenuItem = (props) => {
  const { text, href, Icon, children = [] } = props;
  const classes = useStyles();
  const isExpandable = children && children.length > 0;
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = (
    <AppMenuItemComponent
      className={classes.menuItem}
      bgColor={props.bgColor}
      style={{
        color: "inherit",
        fontSize: "inherit",
        fontFamily: "inherit",
        border: "1px solid rgba(0,0,0,0.3)",
      }}
      link={!children ? href : ""}
      onClick={handleClick}
    >
      <ListItemText primary={text} />
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
    </AppMenuItemComponent>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {children.map((item, index) => (
          <AppMenuItem
            bgColor={props.bgColor}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
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

const useStyles = makeStyles((theme) =>
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

export default AppMenuItem;
