import React, { forwardRef } from "react";
import ListItem from "@material-ui/core/ListItem";
import { NavLink, NavLinkProps } from "react-router-dom";
import Icon from "@material-ui/core/Icon";

const LinksMenuItemComponent = (props) => {
  const { className, onClick, link, children } = props;

  let icon = props.menuLinksData[0].icon
    ? props.menuLinksData[0].icon.replace(" ", "_").toLowerCase()
    : "";

  // If link is not set return the orinary ListItem
  if (!link || typeof link !== "string") {
    return (
      <React.Fragment>
        <Icon style={{ color: "inherit" }}>{icon}</Icon>

        <ListItem
          style={{
            backgroundColor: props.bgColor,
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
            border: "1px solid rgba(0,0,0,0.3)",
          }}
          button
          className={className}
          children={children}
          onClick={onClick}
        />
      </React.Fragment>
    );
  }

  // Return a LitItem with a link component
  return (
    <ListItem
      button
      style={{
        backgroundColor: props.bgColor,
        color: "inherit",
        fontSize: "inherit",
        fontFamily: "inherit",
        border: "1px solid rgba(0,0,0,0.3)",
      }}
      className={className}
      children={children}
      component={forwardRef((props, ref) => (
        <NavLink exact {...props} innerRef={ref} />
      ))}
      to={link}
    />
  );
};

export default LinksMenuItemComponent;
