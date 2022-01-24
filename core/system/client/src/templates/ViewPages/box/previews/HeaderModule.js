import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import PropTypes from "prop-types";
import imageHelper from "../../../../helpers/image.helper";

class HeaderModule extends Component {
    
    state = {
        isModuleSticky: false,
        logoSrc: "",
        containerStyle: {},
        logoImgProps: {},
        logoLinkProps: {}
    }

    pickByKey(params) {
        return params.data.find(el => el[params.what] === params.where)
    }

    async componentDidMount() {
        const {isModuleSticky,
            backgroundPosition,
            backgroundRepeat,
            backgroundStretch,
            logoWidth,
            logoTitle,
            logoLink,
            files
        } = this.props.moduleOptions;

        this.setState({
            isModuleSticky: !!isModuleSticky
        })

        let containerStyle = {height: "100%", display: "flex"};

        const logoImgProps = {};

        const logoLinkProps = {
            title: logoTitle,
            href: logoLink,
        }

        if(files.length) {
            const bgFile = this.pickByKey({
                data: files, what: 'sel', where: 'bg'
            });

            if(bgFile) {
                let bgSrc = "";
                if(bgFile.file) {
                    bgSrc = await imageHelper.toBase64(bgFile.file);

                } else {
                    bgSrc = `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.boxId}/module/${bgFile.name}`;
                }

                containerStyle.background = `url(${bgSrc})`;
                containerStyle.backgroundSize = backgroundStretch ? 'cover' : 'auto';
                containerStyle.backgroundPosition = backgroundPosition || 'center center';
                containerStyle.backgroundRepeat = backgroundRepeat ? 'repeat' : 'no-repeat';
            }

            const logoFile = this.pickByKey({
                data: files, what: 'sel', where: 'logo'
            });

            if(logoFile) {
                if(logoFile.file) {
                    imageHelper.toBase64(logoFile.file).then(src => {
                        this.setState({
                            logoSrc: src
                        })
                    });
                } else {
                    this.setState({
                        logoSrc: `/files/pages/page-${this.props.pageOptions.pageId}/box-${this.props.boxId}/module/${logoFile.name}`
                    })
                }

                logoImgProps.style = {
                    width: logoWidth,
                };

                logoImgProps.alt = logoTitle;

            }
        }

        this.setState({
            containerStyle: containerStyle,
            logoImgProps: logoImgProps,
            logoLinkProps: logoLinkProps,
        })
    }

    render() {
        return (
            <div style={this.state.containerStyle} className={ this.state.isModuleSticky ? this.props.classes.boxWrapper : "" }>
                { <a style={{
                    position: "absolute",
                    left: this.props.moduleOptions.logoPosition[0],
                    top: this.props.moduleOptions.logoPosition[1]
                }} {...this.state.logoLinkProps}><img alt={this.props.moduleOptions.logoTitle} {...this.state.logoImgProps} src={this.state.logoSrc} /></a> }
            </div>
        );
    }
}

export default withStyles(styles)(HeaderModule);

HeaderModule.propTypes = {
    logoTitle: PropTypes.string,
    logoLink: PropTypes.string,
    logoWidth: PropTypes.number,
    logoPosition: PropTypes.string,
    boxId: PropTypes.number,
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    pageOptions: PropTypes.object,
};

