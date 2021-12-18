import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

class HeaderModule extends Component {
  state = {
    backgroundPosition: 'center center',
    logoPosition: 'left top',
    backgroundStretch: false,
    logoWidth: 100,
    logoTitle: '',
    logoLink: ''
  }

  componentDidMount() {
    const {backgroundPosition, logoPosition, backgroundStretch, logoWidth, logoTitle, logoLink} = this.props.moduleOptions;
    this.setState({
      backgroundPosition: backgroundPosition || this.state.backgroundPosition,
      logoPosition: logoPosition || this.state.logoPosition,
      backgroundStretch: !!backgroundStretch,
      logoWidth: logoWidth || this.state.logoWidth,
      logoTitle: logoTitle || '',
      logoLink: logoLink || '',
    });
  }

  pickByKey(params) {
    return params.data.find(el => el[params.what] === params.where)
  }

  render() {
    const classes = this.props.classes;
    let style = { height: "100%" },
        logo_name = null;
    style.display = 'flex';
    const logoPositionArr = this.state.logoPosition.split(' ');
    style.justifyContent = logoPositionArr[0];
    style.alignItems = logoPositionArr[1];

    if(this.props.moduleOptions.files){
      const bg_name = this.pickByKey({
        data: this.props.moduleOptions.files,
        what: 'sel',
        where: 'bg'
      });

      logo_name = this.pickByKey({
        data: this.props.moduleOptions.files,
        what: 'sel',
        where: 'logo'
      });

      if (bg_name && bg_name.name) {
        style.backgroundImage = `url(/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.id}/module/${bg_name.name})`;
        style.backgroundRepeat = this.props.moduleOptions
            .backgroundRepeat
            ? "repeat"
            : "no-repeat";
        style.backgroundSize = this.state.backgroundStretch
            ? "cover"
            : "auto";
        style.backgroundPosition = this.state.backgroundPosition;
      }
    }

    return (
      <div
        key={this.props.i}
        data-grid={this.props.moduleOptions}
        style={style}
        className={
          this.props.moduleOptions.isModuleSticky
            ? classes.itemWrapper
            : ""
        }
      >
        {
          (logo_name && logo_name.name) ? <a
            title={this.state.logoTitle}
            href={this.state.logoLink}
            target="_blank"
            rel="noopener noreferrer"
        >
          <img
              style={{ maxWidth: "150px", width: this.state.logoWidth }}
              className={classes.logoImage}
              src={!logo_name ? "" : `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.id}/module/${logo_name.name}`}
              alt={this.props.moduleOptions.logoTitle}
          />
        </a> : <></>
        }

      </div>
    );
  }
}

export default withStyles(styles)(HeaderModule);
