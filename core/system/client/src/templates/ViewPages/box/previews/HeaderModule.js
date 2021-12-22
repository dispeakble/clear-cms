import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import PropTypes from "prop-types";
import imageHelper from "../../../../helpers/image.helper";

class HeaderModule extends Component {

    state = {
        bg_src: "",
        logo_src: "",
        isModuleSticky: false,
        enabledBackground: false,
        enabledLogo: false,
        logoLinkProps: {},
        logoImgProps: {},
    }

    pickByKey(params) {
        return params.data.find(el => el[params.what] === params.where)
    }

    async componentDidMount() {
        const {isModuleSticky,
            enabledBackground,
            backgroundPosition,
            backgroundRepeat,
            backgroundStretch,
            enabledLogo,
            logoPosition,
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
            href: logoLink
        }

        if(files.length) {
            if(enabledBackground) {
                const bgFile = this.pickByKey({
                    data: files, what: 'sel', where: 'bg'
                });

                if(bgFile) {
                    let bg_src = "";
                    if(bgFile.file) {
                        bg_src = await imageHelper.toBase64(bgFile.file);

                    } else {
                        bg_src = `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.boxId}/module/${bgFile.name}`;
                    }

                    containerStyle.background = `url(${bg_src})`;

                    containerStyle.backgroundSize = backgroundStretch ? 'cover' : 'auto';
                    containerStyle.backgroundPosition = backgroundPosition || 'center center';
                    containerStyle.backgroundRepeat = backgroundRepeat ? 'repeat' : 'no-repeat';
                }
            }

            if(enabledLogo) {
                const logoFile = this.pickByKey({
                    data: files, what: 'sel', where: 'logo'
                });

                if(logoFile) {
                    if(logoFile.file) {
                        imageHelper.toBase64(logoFile.file).then(src => {
                            this.setState({
                                logo_src: src
                            })
                        });
                    } else {
                        this.setState({
                            logo_src: `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.boxId}/module/${logoFile.name}`
                        })
                    }

                    logoImgProps.style = {
                        width: logoWidth
                    };

                    logoImgProps.alt = logoTitle;

                    const logoPositionArr = logoPosition.split(' ');
                    containerStyle.justifyContent = logoPositionArr[0];
                    containerStyle.alignItems = logoPositionArr[1];

                }
            }
        }

        this.setState({
            containerStyle: containerStyle,
            enabledLogo: enabledLogo,
            logoImgProps: logoImgProps,
            logoLinkProps: logoLinkProps,
        })
    }

    render() {
        return (
            <div style={this.state.containerStyle} className={ this.state.isModuleSticky ? this.props.classes.itemWrapper : "" }>
                { this.state.enabledLogo ? <a {...this.state.logoLinkProps}><img alt={this.props.moduleOptions.logoTitle} {...this.state.logoImgProps} src={this.state.logo_src} /></a> : "" }
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
    id: PropTypes.number,
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    pageOptions: PropTypes.object,
};

