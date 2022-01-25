import React, { Component } from "react";

import List from "@material-ui/core/List";
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
