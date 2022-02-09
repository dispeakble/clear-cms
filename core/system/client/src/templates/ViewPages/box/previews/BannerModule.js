import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class BannerModule extends Component {
    state = {
        title: "",
        width: "",
        height: "",
        link: "",
        target: "",
        background: "",
        bannerSizes: [
            { width: "250", height: "250"},
            { width: "200", height: "200"},
            { width: "468", height: "60"},
            { width: "728", height: "90"},
            { width: "300", height: "250"},
            { width: "336", height: "280"},
            { width: "120", height: "600"},
            { width: "160", height: "600"},
            { width: "300", height: "600"},
            { width: "970", height: "90"},
        ],
    };

    pickByKey(params) {
        return params.data.find(el => el[params.what] === params.where)
    }

    render() {
        let banner = null, height = '', width = '';

        if(this.props.moduleOptions.files && this.props.moduleOptions.files.length) {
            banner = this.pickByKey({
                data: this.props.moduleOptions.files,
                what: 'sel',
                where: 'banner'
            });
        }


        const bannerSize = this.props.moduleOptions.bannerSize;

        if (bannerSize) {
            height = this.state.bannerSizes[bannerSize]?.height;
            width = this.state.bannerSizes[bannerSize]?.width;
        }

        return (
            <div>
                {this.state.target === "On Page" ? (
                    <a href={this.state.link}>

                        <img
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                            }}

                            src={!banner?.name? '': `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.boxId}/module/${banner.name}`}
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
                            src={!banner?.name? '': `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.boxId}/module/${banner.name}`}
                            alt={this.state.title}
                        />
                    </Link>
                )}
            </div>
        );
    }
}

export default withRouter(BannerModule);

BannerModule.propTypes = {
    moduleOptions: PropTypes.object,
    pageOptions: PropTypes.object,
    boxId: PropTypes.number,
};