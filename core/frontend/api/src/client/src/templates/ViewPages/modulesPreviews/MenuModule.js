import React, { Component } from "react";
import LinksMenu from "components/LinksMenu/LinksMenu";
import styles from "assets/jss/clear-crm/views/menuModule.js";
import { withStyles } from "@material-ui/core/styles";

// for accordion menu
import List from "@material-ui/core/List";
import Icon from "@material-ui/core/Icon";

class MenuModule extends Component {
  createMenu(params, options) {
    const createLink = (elm) => {
      return (
        <li key={`menu-item-${elm.id}`} style={options.style}>
          <a
            // onClick={() => this.props.updateCurrentPath()}
            style={options.style}
            href={elm.href}
            title={elm.title}
            target={elm.target}
          >
            <Icon
              style={{
                color: options.style.color,
                fontSize: options.style.fontSize,
                verticalAlign: "middle",
              }}
            >
              {elm.icon ? elm.icon.replace(" ", "_").toLowerCase() : ""}
            </Icon>
            {elm.text}
          </a>

          {elm.children && elm.children.length
            ? this.createMenu(elm.children, { ...options, isTopLevel: false })
            : ""}
        </li>
      );
    };

    let style = {
      display:
        options.stretchToFit && options.isTopLevel && !options.isVertical
          ? "flex"
          : "",
      backgroundColor: "",
      color: options.style.color,
      fontSize: options.style.fontSize,
      fontFamily: options.style.fontFamily,
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)",
    };

    let accordionStyle = {
      backgroundColor: "",
      color: options.style.color,
      fontSize: options.style.fontSize,
      fontFamily: options.style.fontFamily,
      border: "1px solid rgba(0,0,0,0.3)",
    };

    if (options.showAsAccordion) {
      if (options.stretchToFit && options.isTopLevel) {
        accordionStyle.width = "100%";
      }
      return (
        <List component="nav" disablePadding>
          <LinksMenu
            style={accordionStyle}
            accordionStyle={accordionStyle}
            menuLinksData={params}
          />
        </List>
      );
    } else {
      if (options.isVertical && options.stretchToFit && options.isTopLevel) {
        style.width = "100%";
      }
      return <ul style={style}>{params.map((elm) => createLink(elm))}</ul>;
    }
  }

  populateChildrenLinks = (childRows) => {
    let childrenRows = childRows
      ? childRows.map((childLink) => ({
          id: childLink.id,
          title: childLink.title,
          text: childLink.text,
          href: childLink.link,
          target: childLink.targetLink,
          icon: childLink.icon,
          children: this.populateChildrenLinks(childLink.tableData.childRows),
        }))
      : "";

    return childrenRows;
  };

  render() {
    const classes = this.props.classes;
    const style = {
      color: this.props.style.color || "inherit",
      backgroundColor: this.props.element.moduleOptions.data.backgroundColor || "inherit",
      fontSize: this.props.style.fontSize || "inherit",
      fontFamily: this.props.style.fontFamily || "inherit",
    };

    let linksList = this.props.element.moduleOptions.data.links.filter(
      (link) => !link.parentId
    );
    let isVertical = this.props.element.moduleOptions.data.isVertical;
    let showAsAccordion = this.props.element.moduleOptions.data.showAsAccordion;
    let stretchToFit = this.props.element.moduleOptions.data.stretchToFit;

    let menuData = linksList.map((link) => ({
      moduleOptions: this.props.element.moduleOptions,
      id: link.id,
      title: link.title,
      text: link.text,
      href: link.link,
      target: link.targetLink,
      icon: link.icon,
      children: this.populateChildrenLinks(link.tableData.childRows),
    }));

    return (
      <div
        className={
          isVertical ? classes.verticalLinksMenu : classes.horizontalLinksMenu
        }
        key={this.props.i}
        data-grid={this.props.element}
        style={{
          width: isVertical || stretchToFit ? "100%" : "",
        }}
      >
        {(() => {
          return this.createMenu(menuData, {
            showAsAccordion,
            stretchToFit,
            style,
            isTopLevel: true,
            isVertical,
          });
        })()}
      </div>
    );
  }
}

export default withStyles(styles)(MenuModule);
