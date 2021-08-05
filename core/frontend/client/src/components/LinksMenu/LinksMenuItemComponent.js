import React, { forwardRef } from "react";
import ListItem from "@material-ui/core/ListItem";
// import { NavLink } from "react-router-dom";
import Link from 'next/link'

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
        onClick={onClick}
      >{children}</ListItem>
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
      component={forwardRef((props, ref) => (
        <Link exact {...props} innerRef={ref} />
      ))}
      to={link}
    >
        {children}
    </ListItem>
  );
};

export default LinksMenuItemComponent;
