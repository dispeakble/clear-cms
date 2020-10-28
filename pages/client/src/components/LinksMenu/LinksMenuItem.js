import React from "react";
import PropTypes from "prop-types";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";

import Icon from "@material-ui/core/Icon";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

import LinksMenuItemComponent from "./LinksMenuItemComponent";

const LinksMenuItem = (props) => {
  const { text, href, icon, children = [] } = props;
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
        fontSize: props.accordionStyle.fontSize,
        fontFamily: props.accordionStyle.fontFamily,
        border: "1px solid rgba(0,0,0,0.3)",
      }}
      link={!children ? href : ""}
      onClick={handleClick}
    >
      <Icon style={{ color: props.accordionStyle.color }}>
        {icon ? icon.replace(" ", "_").toLowerCase() : ""}
      </Icon>

      <ListItemText primary={text} />
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
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

export default LinksMenuItem;
