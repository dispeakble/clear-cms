import React, { Component } from "react";
import LinksMenu from "components/LinksMenu/LinksMenu";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

// for accordion menu
import List from "@material-ui/core/List";
import Icon from "@material-ui/core/Icon";

class MenuModule extends Component {
  createMenu(params, options) {
    const createLink = (elm) => {
      return (
        <li
          style={{
            backgroundColor: options.backgroundColor,
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
            display: "inline-block",
          }}
        >
          {elm.target === "_blank" ? (
            <a
              style={{
                display: "block",
                verticalAlign: "text-top",
                whiteSpace: "nowrap",
                color: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
                // overflow: "hidden",
                // textOverflow: "ellipsis",
              }}
              href={elm.link}
              title={elm.title}
              target="_blank"
            >
              <Icon
                style={{
                  color: "inherit",
                  fontSize: "inherit",
                  verticalAlign: "middle",
                }}
              >
                {elm.icon ? elm.icon.replace(" ", "_").toLowerCase() : ""}
              </Icon>
              {elm.text}
            </a>
          ) : (
            <Link to={elm.link}>
              <Icon
                style={{
                  color: "inherit",
                  fontSize: "inherit",
                  verticalAlign: "middle",
                }}
              >
                {elm.icon ? elm.icon.replace(" ", "_").toLowerCase() : ""}
              </Icon>
              {elm.text}
            </Link>
          )}

          {elm.children && elm.children.length
            ? this.createMenu(elm.children, { ...options, isTopLevel: false })
            : ""}
        </li>
      );
    };

    if (options.showAsAccordion) {
      return (
        <List component="nav" disablePadding>
          <LinksMenu
            menuLinksData={params}
            bgColor={options.backgroundColor}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              border: "1px solid rgba(0,0,0,0.3)",
            }}
          />
        </List>
      );
    } else {
      return (
        <ul
          style={{
            display: options.stretchToFit && options.isTopLevel ? "flex" : "",
            backgroundColor: "",
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
            border: "1px solid rgba(0,0,0,0.3)",
          }}
          className={this.props.classes.linksMenuUl}
        >
          {params.map((elm) => createLink(elm))}
        </ul>
      );
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
    let link_style = {
      display: "block",
      padding: "0 15px",
    };
    if (this.props.element.textColor) {
      link_style.color = this.props.element.textColor;
    }

    let linksList = this.props.element.moduleOptions.data.links.filter(
      (link) => !link.parentId
    );
    let isVertical = this.props.element.moduleOptions.data.isVertical;
    let showAsAccordion = this.props.element.moduleOptions.data.showAsAccordion;
    let stretchToFit = this.props.element.moduleOptions.data.stretchToFit;
    let backgroundColor = this.props.element.moduleOptions.data.backgroundColor;

    let menuData = linksList.map((link) => ({
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
          display: "inline-block",
          width: isVertical ? "100%" : "",
          color: this.props.element.textColor,
          fontSize: this.props.element.fontSize,
          fontFamily: this.props.element.fontFamily,
        }}
      >
        {(() => {
          return this.createMenu(menuData, {
            showAsAccordion,
            stretchToFit,
            backgroundColor,
            isTopLevel: true,
          });
        })()}
      </div>
    );
  }
}

export default withStyles(styles)(MenuModule);
