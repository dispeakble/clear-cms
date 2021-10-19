import React, { Component } from "react";
import LinksMenu from "../../../components/LinksMenu/LinksMenu";
import styles from "../../../assets/jss/clear-crm/views/menuModule.js";
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
                                marginRight: `${options.menuIconSpace}em`
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
                style.display = "flex";
                style.flexDirection = "column";
                style.justifyContent = "space-around";
                style.alignItems = "stretch"
            }
            if(!options.isVertical && options.verticallyCentered){
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
            color: this.props.style.color || "inherit",
            backgroundColor: this.props.element.moduleOptions.data.backgroundColor || "inherit",
            fontSize: this.props.style.fontSize || "inherit",
            fontFamily: this.props.style.fontFamily || "inherit",
        };

        const links = this.props.element.moduleOptions.data.links;

        if(!links || !links.length) {
            return "";
        }

        let linksList = this.props.element.moduleOptions.data.links.filter(
            (link) => !link.parentId
        );
        let isVertical = this.props.element.moduleOptions.data.isVertical;
        let showAsAccordion = this.props.element.moduleOptions.data.showAsAccordion;
        let stretchToFit = this.props.element.moduleOptions.data.stretchToFit;
        let horizontallyCentered = this.props.element.moduleOptions.data.horizontallyCentered;
        let verticallyCentered = this.props.element.moduleOptions.data.verticallyCentered;
        let menuIconSpace = this.props.element.moduleOptions.data.menuIconSpace;
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
            moduleOptions: this.props.element.moduleOptions,
            id: link.id,
            title: link.title,
            text: link.text,
            href: link.link,
            target: link.targetLink,
            icon: link.icon,
            children: this.populateChildrenLinks(link.tableData.childRows),
        }));
        var gridStyle={}
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
                key={this.props.i}
                data-grid={this.props.element}
                style={gridStyle}
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

export default withStyles(styles)(MenuModule);
