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

            /*if(options.verticallyCentered) {
                spanStyle.alignItems = "center";
            }*/

            return (
                <li key={`menu-box-${elm.id}`}>
                    <a style={options.style} href={elm.href} title={elm.title} target={elm.target} >
                        <span style={spanStyle}>
                            <Icon style={{ verticalAlign: "middle" }}>
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
                backgroundColor: this.props.moduleOptions.bgColor || "" || "",
                color: options.style.color,
                fontSize: options.style.fontSize,
                fontFamily: options.style.fontFamily,
            };

            return <ul style={style}>{params.map((elm) => createLink(elm))}</ul>;
        }
    }

    populateChildrenLinks = (childRows) => {
        return childRows ? childRows.map((childLink) => ({
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
                link => !link.parentId
            );
        }else {
            linksList = []
        }

        const {
            isMenuVertical,
            showAsAccordion,
            stretchToFit,
            horizontallyCentered,
            verticallyCentered,
            menuIconSpace
        } = this.props.moduleOptions;


        let menuClass = isMenuVertical ? classes.verticalLinksMenu : classes.horizontalLinksMenu;
        let verticalClass = "vertical";
        let accordionClass = "accordion";
        let stretchClass = "stretch";
        let horizontallyCenteredClass = "centerHorizontally";
        let verticallyCenteredClass = "centerVertically";

        if(isMenuVertical) {
            menuClass +=  " " + verticalClass;
        }

        if(showAsAccordion) {
            menuClass +=  " " + accordionClass;
        }

        if(stretchToFit) {
            menuClass +=  " " + stretchClass;
        }

        if(horizontallyCentered) {
            menuClass +=  " " + horizontallyCenteredClass;
        }

        if(verticallyCentered) {
            menuClass +=  " " + verticallyCenteredClass;
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

        return (
            <div className={ menuClass }
                data-grid={this.props.moduleOptions}
                style={gridStyle} >
                {(() => {
                    return this.createMenu(menuData, {
                        showAsAccordion,
                        stretchToFit,
                        style,
                        isTopLevel: true,
                        isMenuVertical,
                        menuIconSpace,
                        verticallyCentered
                    });
                })()}
            </div>
        );
    }
}

export default withStyles(styles)(MenuModule);

MenuModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func,
    menuItems: PropTypes.array,
    style: PropTypes.object,
};