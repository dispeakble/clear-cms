import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/modules/headerModule";
import Link from "next/link";

class HeaderModule extends Component {

    pickByKey(params) {
        return params.data.find(el => el[params.what] === params.where)
    }

    render() {
        const classes = this.props.classes;
        let style = {
                height: '100%'
            },
            logo = null;

        if (this.props.element.moduleOptions.files) {
            const bg = this.pickByKey({
                data: this.props.element.moduleOptions.files,
                what: 'sel',
                where: 'bg'
            });

            logo = this.pickByKey({
                data: this.props.element.moduleOptions.files,
                what: 'sel',
                where: 'logo'
            });

            if (bg && bg.name) {
                style.backgroundImage = `url(/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.element.id}/module/${bg.name})`;
                style.backgroundRepeat = this.props.element.moduleOptions
                    .backgroundRepeat
                    ? "repeat"
                    : "no-repeat";
                style.backgroundSize = this.props.element.moduleOptions
                    .backgroundStretch
                    ? "cover"
                    : "auto";
                style.backgroundPosition = "center center";
                style.position =  'relative'

            }

            if (this?.props?.element?.moduleOptions?.isModuleSticky) {
                style.position = "fixed !important";
                style.top = "inherit";
                style.left = "inherit";
                style.right = "inherit";
                style.width = "inherit";
                style.height = "inherit";
                style.overflow = "inherit";
            }
        }

        return (
            <div
                key={this.props.i}
                style={style}
                className={
                    this.props.element.moduleOptions.isModuleSticky
                        ? classes.stickyHeader
                        : ""
                }
            >
                {
                    (logo && logo.name) && <div className={classes.logoImage}>
                        <Link href={`/${this.props.element.moduleOptions.logoLink}`}>
                            <a style={{
                                position: "absolute",
                                left: this.props.element.moduleOptions.logoPosition[0],
                                top: this.props.element.moduleOptions.logoPosition[1],
                            }}><img
                                style={{width: this.props.element.moduleOptions.logoWidth, height: this.props.element.moduleOptions.logoHeight}}
                                src={!logo ? "" : `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.element.id}/module/${logo.name}`}
                                alt={this.props.element.moduleOptions.logoTitle}/></a></Link>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(HeaderModule);
