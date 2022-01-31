import _ from "lodash";
import React, {Suspense} from "react";
import {withStyles, createTheme} from "@material-ui/core/styles";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagePreview.js";

import {withRouter} from "react-router-dom";

import {Helmet} from "react-helmet";
import BoxModal from "../../components/BoxModal/BoxModal";
import GoogleFontLoader from 'react-google-font-loader';
import PropTypes from "prop-types";

import {WidthProvider, Responsive} from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewPagesPreview extends React.Component {
    static defaultProps = {
        className: "layout",
        cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
        rowHeight: 1,
    };

    state = {
        title: "",
        boxes: [],
        pageConfig: {
            backgroundColor: "",
            fontSize: "",
            fontFamily: "",
            textColor: "",
            layoutBoxSpacing: [],
            title: "",
        },
        modals: [],
        layouts: {},
        fontUnit: "px",
        pageId: 0,
        googleFonts: [],
        modalBoxes: {}
    };

    componentDidMount() {
        this.loadPage();
    }

    async loadPage() {
        const pageId = Number(this.props.location.pathObject[2]);
        if (this.props.isLivePreview) {
            this.setState({
                pageId: pageId,
                boxes: _.cloneDeep(this.props.boxes),
                pageConfig: _.cloneDeep(this.props.pageConfig)
            });
        } else {
            const page = await this.props.control.get({
                id: pageId
            });

            const boxes = page.boxes && page.boxes.length && page.boxes.map((box, index) => {
                box.data = JSON.parse(box.data);
                return {
                    i: String(index),
                    id: box.PageToBox.boxId,
                    static: true,
                    x: box.PageToBox.x,
                    y: box.PageToBox.y,
                    w: box.data.w,
                    h: box.data.h,
                    module: box.module,
                    moduleOptions: JSON.parse(box.moduleOptions)
                }
            });

            this.setState({
                pageId: pageId,
                boxes: boxes,
                pageConfig: page.pageConfig
            });
            let modalBoxes = {}
            page.boxes.filter(box =>box.displayOptions &&box.displayOptions.displayAsModal).map((el, index) => {
                modalBoxes[el.title + el.i] = {
                    name: el.title,
                    title: el.title,
                    show: this.fetchPopupState(el.title + el.i, el.displayOptions.neverShowAfterClosing),
                    content: this.createElement(el),
                    showCloseButton: el.displayOptions.showCloseButton,
                    position: el.displayOptions.modalPosition,
                    displayBackdrop: el.displayOptions.displayBackdrop,
                    neverShowAfterClosing: el.displayOptions.neverShowAfterClosing,
                    closeButton: {
                        show: el.displayOptions.showCancelButton,
                        callback: () => {
                            this.switchBoxModalState(el)
                            if (el.displayOptions.cancelButtonLink) {
                                this.props.history.push(el.displayOptions.cancelButtonLink);
                            }
                            return true;
                        },
                        label: el.displayOptions.cancelButtonTitle,
                    },
                    confirmButton: {
                        show: el.displayOptions.showActionButton,
                        callback: () => {
                            this.switchBoxModalState(el)
                            if (el.displayOptions.actionButtonLink) {
                                this.props.history.push(el.displayOptions.actionButtonLink);
                            }
                            return true;
                        },
                        label: el.displayOptions.actionButtonTitle,
                    },
                }

                return el;
            })

            this.setState({
                modalBoxes: modalBoxes
            })

            this.setUsedGoogleFonts();
        }
    }

    switchBoxModalState = (el) => {
        this.setState(prevState => ({
            ...prevState,
            modalBoxes: {
                ...prevState.modalBoxes,
                [el.title + el.i]: {
                    ...prevState.modalBoxes[el.title + el.i],
                    show: false
                }
            }
        }));
        if (el.displayOptions.neverShowAfterClosing) {
            localStorage.setItem(el.title + el.i, el.title);
        }
        return true;
    }

    fetchPopupState = (key, neverShowAfterClosing) => {
        if (neverShowAfterClosing) {
            const isConfirm = localStorage.getItem(key);
            if (isConfirm) {
                return false
            }
        } else {
            localStorage.removeItem(key);
        }
        return true;
    }

    createElement(el) {
        el.static = true;

        let boxStyle = {};

        if (el.scrollbars) {
            boxStyle.scrollbars = el.scrollbars;
        }

        if (el.hasFontFamily) {
            boxStyle.fontFamily = el.fontFamily;
        }

        if (el.hasTextColor) {
            boxStyle.color = el.textColor;
        }

        if(el.hasBackgroundImage) {
            if (el.backgroundImageString) {
                boxStyle.backgroundImage = `url(${el.backgroundImageString})`;
            } else {
                boxStyle.backgroundImage = `url(/files/pages/page-${el.templateId ? el.templateId : this.state.pageId}/box-${el.id}/${el.backgroundImage})`;
            }

            if (el.backgroundImage && el.backgroundImage.indexOf("__delete__") === 0) {
                el.backgroundImageString = "";
                boxStyle.backgroundImage = "";
            }

            boxStyle.backgroundRepeat = el.hasBackgroundRepeat ? "repeat" : "no-repeat";

            if (el.hasBackgroundStretch) {
                boxStyle.backgroundSize = "cover";
            } else {
                boxStyle.backgroundSize = "auto";
            }
        }

        if (el.hasBackgroundGradient) {
            boxStyle.backgroundImage = el.backgroundGradient;
        }

        if (el.hasBackgroundColor) {
            boxStyle.backgroundColor = el.backgroundColor;
        }

        if (el.hasBorderColor && Number(el.borderWidth)) {
            boxStyle.borderColor = el.borderColor;
            boxStyle.borderStyle = "solid";
            boxStyle.borderWidth = el.borderWidth + "px";
        }

        if (Number(el.borderRadius)) {
            boxStyle.borderRadius = el.borderRadius;
        }

        const moduleStyle = {};

        if (el.hasBackgroundColor) {
            moduleStyle.backgroundColor = el.backgroundColor;
        } else if (el.hasBackgroundImage) {
            moduleStyle.backgroundImage = `url(/files/pages/page-${el.templateId ? el.templateId : this.state.pageId}/box-${el.id}/${el.backgroundImage})`;
            moduleStyle.backgroundRepeat = el.hasBackgroundRepeat ? "repeat" : "no-repeat";
            moduleStyle.backgroundSize = el.hasBackgroundStretch ? "cover" : "auto";
        } else if (el.hasBackgroundGradient) {
            moduleStyle.backgroundImage = el.backgroundGradient;
        }

        if (Number(el.borderRadius)) {
            moduleStyle.borderRadius = el.borderRadius;
        }

        if (el.hasFontSize) {
            moduleStyle.fontSize = `${el.fontSize}${this.state.fontUnit}`;
            moduleStyle.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
        } else if (this.state?.fontSize) {
            moduleStyle.fontSize = `${this.state.fontSize}${this.state.fontUnit}`;
            moduleStyle.lineHeight = `${this.state.fontSize}${this.state.fontUnit}`;
        }

        if (el.hasFontFamily) {
            moduleStyle.fontFamily = el.fontFamily;
        } else if (this.state?.fontFamily) {
            moduleStyle.fontFamily = this.state.fontFamily;
        }

        if (el.hasTextColor) {
            moduleStyle.color = el.textColor;
        } else if (this.state?.textColor) {
            moduleStyle.textColor = this.state.textColor;
        }

        if (el.scrollbars) {
            moduleStyle.overflow = "auto";
        } else {
            moduleStyle.overflow = "hidden";
        }

        if (el.module) {
            const loadingFallback = (() => {
                return <span>Loading...</span>;
            })();

            let moduleType = el.module.replaceAll(" ", "");
            if (el.module === "Header Module") {
                boxStyle.position = el.moduleOptions.isModuleSticky
                    ? "fixed !important"
                    : "";
                boxStyle.top = "0";
            }

            if(el.module === "Menu Module") {
                boxStyle.zIndex = 99;
            }

            const LazyModule = React.lazy(() => {
                return import(`./box/previews/${moduleType}`)
            });

            return (
                <div key={`box-${el.i}`} data-grid={Object.assign({}, el, {static: true})} style={boxStyle}>
                    <Suspense fallback={loadingFallback}>
                        <LazyModule
                            control={this.props.control}
                            services={this.props.services}
                            i={el.i}
                            element={el}
                            boxId={el.id || -1}
                            moduleOptions={el.moduleOptions}
                            pageOptions={{pageId: el.templateUsed ? el.templateUsed : this.state.pageId}}
                        />
                    </Suspense>
                </div>
            );
        } else {
            return <div key={`box-${el.i}`} data-grid={el} style={boxStyle}></div>;
        }
    }

    // for MuiThemeProvider
    getTheme = () => {
        return createTheme({
            overrides: {
                MuiSpeedDial: {
                    fab: {
                        backgroundColor: "",
                        "&:hover": {
                            backgroundColor: "",
                        },
                    },
                },
                MuiAccordionSummary: {
                    content: {
                        width: "calc(100% - 48px)",
                        "&$expanded": {
                            margin: "12px 0",
                        },
                        "& p": {
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflowX: "hidden",
                        },
                    },
                    root: {
                        "&$expanded": {
                            minHeight: "48px",
                        },
                    },
                },
                MuiAccordion: {
                    root: {
                        "&$expanded": {
                            margin: "0",
                        },
                    },
                },
            }
        });
    };

    onLayoutChange = (layout, layouts) => {
        try {
            this.setState({layouts: layouts});
        } catch (err) {
            console.log(err);
        }
    };

    setUsedGoogleFonts() {
        const fonts = [];

        if (this.state.fontFamily && this.state.fontFamily.length) {
            fonts.push({font: this.state.fontFamily});
        }

        if (this.state.boxes && this.state.boxes.length) {
            this.state.boxes.map((box) => {
                if (box.fontFamily && !fonts.some(f => f.font ===box.fontFamily)) {
                    fonts.push({font:box.fontFamily});
                }
                return box;
            });
        }
        this.setState({
            googleFonts: fonts
        })
    }

    render() {
        const classes = this.props.classes;

        if (this.state.boxes === null || this.state.boxes.length === 0) {
            return "";
        }

        const style = {
            backgroundImage: this.state.pageConfig.backgroundGradient ? this.state.pageConfig.backgroundGradient : `url(/files/pages/page-${this.state.pageId}/${this.state.pageConfig.backgroundImage})`,
            backgroundRepeat: this.state.pageConfig.backgroundRepeat
                ? "repeat"
                : "no-repeat",
            backgroundSize: this.state.pageConfig.backgroundStretch
                ? "cover"
                : "auto",
            backgroundColor: this.state.pageConfig.backgroundColor,
            fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
            fontFamily: this.state.fontFamily,
            color: this.state.pageConfig.textColor,
        };

        if (this.props.hideBackground) {
            delete style.backgroundImage;
            delete style.backgroundColor;
        }

        style.minHeight = "100%";

        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.state.title}</title>
                </Helmet>
                {this.state.googleFonts.length ? <GoogleFontLoader
                    fonts={this.state.googleFonts}
                /> : ""}
                <div className={classes.previewBodyWrapper}>
                    <MuiThemeProvider theme={this.getTheme()}>
                        <div className={classes.gridHolder}>
                            <div
                                className={classes.gridLayout}
                                style={style}
                            >
                                <ResponsiveReactGridLayout
                                    style={{
                                        fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                                        fontFamily: this.state.fontFamily,
                                        color: this.state.pageConfig.textColor,
                                        minHeight: "100%"
                                    }}
                                    margin={this.state.pageConfig.layoutBoxSpacing}
                                    {...this.props}
                                    measureBeforeMount={true}
                                    layouts={this.state.layouts}
                                    onLayoutChange={(layout, layouts) => {
                                        return this.onLayoutChange(layout, layouts);
                                    }}
                                    compactType="vertical"
                                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                                    useCSSTransforms={true}
                                >
                                    {this.state.boxes.length
                                        ? _.map(this.state.boxes.filter(box => !(box.displayOptions &&box.displayOptions.displayAsModal)), (el, index) => this.createElement(el))
                                        : ""}
                                </ResponsiveReactGridLayout>
                            </div>
                        </div>
                    </MuiThemeProvider>
                    {Object.keys(this.state.modalBoxes).map(boxKey => <BoxModal key={boxKey}
                        showModal={this.state.modalBoxes[boxKey].show}
                        {...this.state.modalBoxes[boxKey]}
                    />)}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ViewPagesPreview));

ViewPagesPreview.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object,
    services: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    isLivePreview: PropTypes.bool,
    pageConfig: PropTypes.object,
    boxes: PropTypes.array,
    hideBackground: PropTypes.bool,
};
