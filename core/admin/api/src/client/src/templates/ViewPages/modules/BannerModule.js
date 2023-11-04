import React, { Component } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

class BannerModule extends Component {
  state = {
    title: "",
    width: "",
    height: "",
    link: "",
    target: "",
    background: "",
  };

  bannerSizes = [
    {label: "120 x 600"},
    {label: "160 x 600"},
    {label: "200 x 200"},
    {label: "250 x 250"},
    {label: "300 x 250"},
    {label: "300 x 600"},
    {label: "336 x 280"},
    {label: "468 x 60"},
    {label: "728 x 90"},
    {label: "970 x 90"},
  ];

  pickByKey(params) {
    return params.data.find(el => el[params.what] === params.where)
  }

  render() {
    let banner = null, height = '', width = '';

    if(this.props.element.moduleOptions.files && this.props.element.moduleOptions.files.length) {
      banner = this.pickByKey({
        data: this.props.element.moduleOptions.files,
        what: 'sel',
        where: 'banner'
      });
    }

    const bannerSize = this.props.element.moduleOptions.bannerSize;

    if (bannerSize) {
      height = this.bannerSizes[bannerSize]?.height;
      width = this.bannerSizes[bannerSize]?.width;
    }

    return (
        <React.Fragment>
          {this.state.target === "On Page" ? (
              <a href={this.state.link}>
                <img
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                    }}

                    src={!banner?.name? '': `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.element.id}/module/${banner.name}`}
                    alt={this.state.title}
                />
              </a>
          ) : (
              <Link href={this.state.link}>
                <img
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                    }}
                    src={!banner?.name? '': `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.element.id}/module/${banner.name}`}
                    alt={this.state.title}
                />
              </Link>
          )}
        </React.Fragment>
    );
  }
}

export default BannerModule;

BannerModule.propTypes = {
  moduleOptions: PropTypes.object,
  pageOptions: PropTypes.object,
}