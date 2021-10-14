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
            logo_name = null;

        if (this.props.element.moduleOptions.data.files) {
            const bg_name = this.pickByKey({
                data: this.props.element.moduleOptions.data.files,
                what: 'sel',
                where: 'bg'
            });

            logo_name = this.pickByKey({
                data: this.props.element.moduleOptions.data.files,
                what: 'sel',
                where: 'logo'
            });

            if (bg_name && bg_name.name) {
                style.backgroundImage = `url(/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.i}/module/${bg_name.name})`;
                style.backgroundRepeat = this.props.element.moduleOptions.data
                    .backgroundRepeat
                    ? "repeat"
                    : "no-repeat";
                style.backgroundSize = this.props.element.moduleOptions.data
                    .backgroundStretch
                    ? "cover"
                    : "auto";
                style.backgroundPosition = "center center";
                style.position =  'relative'

            }

            if (this?.props?.element?.moduleOptions?.data?.isModuleSticky) {
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
                data-grid={this.props.element}
                style={style}
                className={
                    this.props.element.moduleOptions.data.isModuleSticky
                        ? classes.stickyHeader
                        : ""
                }
            >
                {
                    (logo_name && logo_name.name) && <div className={classes.logoImage}>
                        <Link href={`/${this.props.element.moduleOptions.data.logoLink}`}>
                            <a><img
                                style={{width: '100%'}}
                                src={!logo_name ? "" : `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.i}/module/${logo_name.name}`}
                                alt={this.props.element.moduleOptions.data.logoTitle}/></a></Link>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(HeaderModule);
