import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

class HeaderModule extends Component {

  componentDidMount() {
    this.setState({files: this.props.element.moduleOptions});
    console.log('header preview', this.props)

  }

  pickByKey(params) {
    return params.data.find(el => el[params.what] === params.where)
  }

  render() {
    const classes = this.props.classes;
    let style = { height: "100%" }; // replaced , with ;
    // logo_name = null;
    const images = {
      bg_name: {},
      logo_name: {},
    }

    const {bg_name, logo_name} = images;



    if(this.props.element.moduleOptions.files){

      this.props.element.moduleOptions.files.forEach(item => {
        if(item.sel == 'bg') {
          images.bg_name = item;
        }
        if(item.sel == 'logo') {
          images.logo_name = item;
        }
      })
      const {bg_name} = images;
      if (bg_name && bg_name.name) {
        style.backgroundImage = `url(/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.id}/module/${bg_name.name})`;
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
        {console.log(images, 'kjdflksajdflksdjf')}
        {
          (images.logo_name && images.logo_name.name) ? <a
            title={this.props.element.moduleOptions.logoTitle}
            href={this.props.element.moduleOptions.logoLink}
            target="_blank"
            rel="noopener noreferrer"
        >
          <img
              style={{ maxWidth: "150px" }}
              className={classes.logoImage}
              src={!images.logo_name ? "" : `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.id}/module/${images.logo_name.name}`}
              alt={this.props.element.moduleOptions.logoTitle}
          />
        </a> : <></>
        }

      </div>
    );
  }
}

export default withStyles(styles)(HeaderModule);
