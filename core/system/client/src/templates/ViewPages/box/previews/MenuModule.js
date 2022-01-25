import React, { Component } from "react";
import LinksMenu from "components/LinksMenu/LinksMenu";
import styles from "assets/jss/clear-crm/views/menuModule.js";
import { withStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";

class MenuModule extends Component {

    createMenu(params, options) {
        const createLink = (elm) => {

            const spanStyle = {
                paddingRight: `${options.menuIconSpace}px`,
                color: options.style.color,fontSize: options.style.fontSize,
            };

            if(options.verticallyCentered) {
                spanStyle.alignItems = "center";
            }

            return (
                <li key={`menu-box-${elm.id}`}>
                    <a
                        style={options.style}
                        href={elm.href}
                        title={elm.title}
                        target={elm.target}
                    >
                        <span style={spanStyle}>
                            <Icon
                                style={{
                                    verticalAlign: "middle",
                                }}
                            >
                                {elm.icon ? elm.icon.replace(" ", "_").toLowerCase() : ""}
                            </Icon>
                        </span>
                        {elm.text}
                    </a>

                    {elm.children && elm.children.length
                        ? this.createMenu(elm.children, { ...options, isTopLevel: false })
                        : ""}
                </li>
            );
        };

        if (options.showAsAccordion) {
            const accordionStyle = {
                bgColor: this.props.moduleOptions.bgColor || "" || "",
                color: options.style.color,
                fontSize: options.style.fontSize,
                fontFamily: options.style.fontFamily,
                border: "1px solid rgba(0,0,0,0.3)",
                menuIconSpace: options.menuIconSpace
            };

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
            const style = {
                display:
                    options.stretchToFit && options.isTopLevel && !options.isVertical
                        ? "flex"
                        : "",
                backgroundColor: this.props.moduleOptions.bgColor || "" || "",
                color: options.style.color,
                fontSize: options.style.fontSize,
                fontFamily: options.style.fontFamily,
            };
            if (options.isVertical && options.stretchToFit && options.isTopLevel) {
                style.width = "100%";
                style.display = "flex";
                style.flexDirection = "column";
                style.justifyContent = "space-around";
                style.alignItems = "center"
            }
            if(options.verticallyCentered){
                style.alignItems = "center";
                style.height = '100%';
            }
            if (options.stretchToFit && options.isTopLevel) {
                style.height = "100%";
            }
            return <ul style={style}>{params.map((elm) => createLink(elm))}</ul>;
        }
    }

    populateChildrenLinks = (childRows) => {
        return childRows
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
    };

    render() {
        const classes = this.props.classes;
        const style = {
            color: this.props.style?.color || "inherit",
            backgroundColor: this.props.moduleOptions.backgroundColor || "inherit",
            fontSize: this.props.style?.fontSize || "inherit",
            fontFamily: this.props.style?.fontFamily || "inherit",
        };

        let linksList;
        if(this.props.moduleOptions.menuItems){
            linksList = this.props.moduleOptions.menuItems.filter(
                (link) => !link.parentId
            );
        }else {
            linksList = []
        }

        let isVertical = this.props.moduleOptions.isVertical;
        let showAsAccordion = this.props.moduleOptions.showAsAccordion;
        let stretchToFit = this.props.moduleOptions.stretchToFit;
        let horizontallyCentered = this.props.moduleOptions.horizontallyCentered;
        let verticallyCentered = this.props.moduleOptions.verticallyCentered;
        let menuIconSpace = this.props.moduleOptions.menuIconSpace;
        if (verticallyCentered && isVertical) {
            style.display = "flex";
            style.alignContent = "stretch"
            style.alignItems = "center";
            style.width = "100%";
            style.justifyItems = "stretch"
            if(horizontallyCentered){
                style.justifyContent="center"
            }
        }
        let menuData = linksList.map((link) => ({
            moduleOptions: this.props.moduleOptions,
            id: link.id,
            title: link.title,
            text: link.text,
            href: link.link,
            target: link.targetLink,
            icon: link.icon,
            children: this.populateChildrenLinks(link.tableData.childRows),
        }));
        let gridStyle={}
        if(this.props.moduleOptions.backgroundColor){
            gridStyle.backgroundColor = this.props.moduleOptions.backgroundColor;
        }
        if(!isVertical && stretchToFit){
            gridStyle.width = "100%";
            if(verticallyCentered){
                gridStyle.height = "100%";
            }
        }
        if(isVertical && stretchToFit) {
            gridStyle.height = "100%"
        }
        if(horizontallyCentered){
            gridStyle.textAlign= "center"
        }

        return (
            <div
                className={
                    isVertical ? classes.verticalLinksMenu : classes.horizontalLinksMenu
                }
                data-grid={this.props.moduleOptions}
                style={{...gridStyle}}
            >
                {(() => {
                    return this.createMenu(menuData, {
                        showAsAccordion,
                        stretchToFit,
                        style,
                        isTopLevel: true,
                        isVertical,
                        menuIconSpace,
                        verticallyCentered
                    });
                })()}
            </div>
        );
    }
}

MenuModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func,
    menuItems: PropTypes.array,
    style: PropTypes.object,
};

export default withStyles(styles)(MenuModule);
