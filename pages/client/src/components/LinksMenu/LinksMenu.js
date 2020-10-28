import React, { Component } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";

import IconDashboard from "@material-ui/icons/Dashboard";
import IconShoppingCart from "@material-ui/icons/ShoppingCart";
import IconPeople from "@material-ui/icons/People";
import IconBarChart from "@material-ui/icons/BarChart";
import IconLibraryBooks from "@material-ui/icons/LibraryBooks";

import LinksMenuItem from "./LinksMenuItem";

class LinksMenu extends Component {
  render() {
    return (
      <List component="nav" disablePadding>
        {this.props.menuLinksData.map((item, index) => (
          <LinksMenuItem
            menuLinksData={this.props.menuLinksData}
            accordionStyle={this.props.accordionStyle}
            style={{
              color: this.props.accordionStyle.color,
              fontSize: this.props.accordionStyle.fontSize,
              fontFamily: this.props.accordionStyle.fontFamily,
              border: "1px solid rgba(0,0,0,0.3)",
            }}
            {...item}
            key={index}
          />
        ))}
      </List>
    );
  }
}

export default LinksMenu;
