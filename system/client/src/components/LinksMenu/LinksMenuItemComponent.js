import React, { forwardRef } from "react";
import ListItem from "@material-ui/core/ListItem";
import { NavLink, NavLinkProps } from "react-router-dom";
import Icon from "@material-ui/core/Icon";

const LinksMenuItemComponent = (props) => {
  const { className, onClick, link, children } = props;

  // If link is not set return the orinary ListItem
  if (!link || typeof link !== "string") {
    return (
      <ListItem
        style={{
          backgroundColor: props.accordionStyle.backgroundColor,
          color: props.accordionStyle.color,
          fontSize: props.accordionStyle.fontSize,
          fontFamily: props.accordionStyle.fontFamily,
        }}
        button
        className={className}
        children={children}
        onClick={onClick}
      />
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
