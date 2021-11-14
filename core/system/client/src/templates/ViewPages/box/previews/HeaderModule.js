import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

class HeaderModule extends Component {

  pickByKey(params) {
    return params.data.find(el => el[params.what] === params.where)
  }

  render() {
    const classes = this.props.classes;
    let style = { height: "100%" },
        logo_name = null;

    if(this.props.element.moduleOptions.files){
      const bg_name = this.pickByKey({
        data: this.props.element.moduleOptions.files,
        what: 'sel',
        where: 'bg'
      });

      logo_name = this.pickByKey({
        data: this.props.element.moduleOptions.files,
        what: 'sel',
        where: 'logo'
      });

      if (bg_name && bg_name.name) {
        style.backgroundImage = `url(/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.i}/module/${bg_name.name})`;
        style.backgroundRepeat = this.props.element.moduleOptions
            .backgroundRepeat
            ? "repeat"
            : "no-repeat";
        style.backgroundSize = this.props.element.moduleOptions
            .backgroundStretch
            ? "cover"
            : "auto";
        style.backgroundPosition = "center center";
      }
    }

    return (
      <div
        key={this.props.i}
        data-grid={this.props.element}
        style={style}
        className={
          this.props.element.moduleOptions.isModuleSticky
            ? classes.itemWrapper
            : ""
        }
      >
        {
          (logo_name && logo_name.name) ? <a
            title={this.props.element.moduleOptions.logoTitle}
            href={this.props.element.moduleOptions.logoLink}
            target="_blank"
            rel="noopener noreferrer"
        >
          <img
              style={{ maxWidth: "150px" }}
              className={classes.logoImage}
              src={!logo_name ? "" : `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.i}/module/${logo_name.name}`}
              alt={this.props.element.moduleOptions.logoTitle}
          />
        </a> : <></>
        }

      </div>
    );
  }
}

export default withStyles(styles)(HeaderModule);
