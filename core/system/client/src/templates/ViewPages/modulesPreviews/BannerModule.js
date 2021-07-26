import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";

class BannerModule extends Component {
  state = {
    title: "",
    width: "",
    height: "",
    link: "",
    target: "",
    bgImage: "",
    bannerSizes: [
      { width: "250 ", height: "250"},
      { width: "200 ", height: "200"},
      { width: "468 ", height: "60"},
      { width: "728 ", height: "90"},
      { width: "300 ", height: "250"},
      { width: "336 ", height: "280"},
      { width: "120 ", height: "600"},
      { width: "160 ", height: "600"},
      { width: "300 ", height: "600"},
      { width: "970 ", height: "90"},
    ],
  };

  pickByKey(params) {
    return params.data.find(el => el[params.what] === params.where)
  }

  render() {
    let banner = null, height = '', width = '';

    banner = this.pickByKey({
      data: this.props.element.moduleOptions.data.files,
      what: 'sel',
      where: 'banner'
    });

    const banner_size = this.props.element.moduleOptions.data.bannerSize;

    if (banner_size) {
      height = this.state.bannerSizes[banner_size].height;
      width = this.state.bannerSizes[banner_size].width;
    }

    return (
      <Tooltip title={this.state.title}>
        {this.state.target === "On Page" ? (
          <a href={this.state.link}>
            <img
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }}

              src={!banner?.name? '': `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.i}/module/${banner.name}`}
              alt={this.state.title}
            />
          </a>
        ) : (
          <Link to={this.state.link}>
            <img
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              src={!banner?.name? '': `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.element.i}/module/${banner.name}`}
              alt={this.state.title}
            />
          </Link>
        )}
      </Tooltip>
    );
  }
}

export default withRouter(BannerModule);
