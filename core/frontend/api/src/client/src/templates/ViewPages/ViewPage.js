import React from "react";
import dynamic from "next/dynamic";
import {withStyles, createTheme} from "@material-ui/core/styles";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/core/styles";
import styles from "../../assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import {withRouter} from 'next/router'
import {connect} from "react-redux";
import getConfig from 'next/config'
import BoxModal from "../../components/BoxModal/BoxModal";
import GoogleFontLoader from 'react-google-font-loader';
import ActivityService from "../../services/activity.service";

//const { publicRuntimeConfig } = getConfig();

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const modules = {
    AccordionModule: dynamic(() => import(`./modules/AccordionModule`)),
    AudioModule: dynamic(() => import(`./modules/AudioModule`)),
    BannerModule: dynamic(() => import(`./modules/BannerModule`)),
    CalendarModule: dynamic(() => import(`./modules/CalendarModule`)),
    CategoriesModule: dynamic(() => import(`./modules/CategoriesModule`)),
    ChartModule: dynamic(() => import(`./modules/ChartModule`)),
    GalleryModule: dynamic(() => import(`./modules/GalleryModule`)),
    HeaderModule: dynamic(() => import(`./modules/HeaderModule`)),
    MenuModule: dynamic(() => import(`./modules/MenuModule`)),
    PagelistModule: dynamic(() => import(`./modules/PagelistModule`)),
    ProductModule: dynamic(() => import(`./modules/ProductModule`)),
    SearchModule: dynamic(() => import(`./modules/SearchModule`)),
    SitemapModule: dynamic(() => import(`./modules/SitemapModule`)),
    TableModule: dynamic(() => import(`./modules/TableModule`)),
    TextModule: dynamic(() => import(`./modules/TextModule`)),
    VideoModule: dynamic(() => import(`./modules/VideoModule`)),
};

class ViewPage extends React.Component {

    control = {
        //pageList: this.props.pagesData,
        //categoryList: this.props.categoriesData
    }

    constructor(props) {
        super(props);

        let modalItems = {}
        if (this.props.pageData && this.props.pageData.items) {
            this.props.pageData.items.filter(item => item.displayOptions && item.displayOptions.displayAsModal).map(el => {

                const LazyComponent = modules[el.module.replace(" ", "")] || <div/>;//TODO FIX MODALS

                modalItems[el.title + el.i] = {
                    name: el.title,
                    title: el.title,
                    show: this.fetchPopupState(el.title + el.i, el.displayOptions.neverShowAfterClosing),
                    content: (
                        <div data-grid={box} key={`box-${index}`} style={boxStyle}>
                            <LazyComponent
                                control={this.control}
                                id={index}
                                element={box}
                                style={moduleStyle}
                                pageOptions={{pageId: pageId}}
                            />
                        </div>
                    ),
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
                        },
                        label: el.displayOptions.actionButtonTitle,
                    },
                };
                return el;
            });
        }

        this.state = {
            layouts: {},
            modals: [],
            fontSize: this.props.pageData.pageConfig.fontSize || 11,
            fontUnit: this.props.pageData.pageConfig.fontUnit || 'px',
            googleFonts: this.getGoogleFonts(),
            modalItems: modalItems
        }
    }

    componentDidMount() {
        if(this.props.isDev) {
            const activityService = new ActivityService();

            activityService.start();//TODO ONLY FOR DEV
        }

    }

    switchBoxModalState = (el) => {
        this.setState(prevState => ({
            ...prevState,
            modalItems: {
                ...prevState.modalItems,
                [el.title + el.i]: {
                    ...prevState.modalItems[el.title + el.i],
                    show: false
                }
            }
        }));
        if (el.displayOptions.neverShowAfterClosing) {
            localStorage.setItem(el.title + el.i, el.title);
        }
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

    onLayoutChange = (layout, layouts) => {
        try {
            this.setState({layouts: layouts});
        } catch (err) {
            console.log(err);
        }
    };

    // for MuiThemeProvider
    getTheme = () => {
        return createTheme();
    };

    getGoogleFonts(items) {
        const fonts = [];

        if (items && items.length) {
            items.map((item) => {
                if (item.fontFamily && !fonts.some(f => f.font === item.fontFamily)) {
                    fonts.push({font: item.fontFamily});
                }
            });
        }
        return fonts;
    }

    createBox(el, index) {
        el.static = true;
        const pageId = el.templateUsed || this.props.pageData.id;


        const box = {
            i: String(index),
            id: el.PageToBox.boxId,
            static: true,
            x: el.PageToBox.x,
            y: el.PageToBox.y,
            w: el.data.w,
            h: el.data.h,
            moduleOptions: el.moduleOptions
        };

        let boxStyle = {};

        if (el.data.hasBackgroundImage) {
            boxStyle.backgroundImage = `url(/files/pages/page-${pageId}/box-${el.id}/${el.data.backgroundImage})`;
            boxStyle.backgroundRepeat = el.data.hasBackgroundRepeat ? "repeat" : "no-repeat";
            boxStyle.backgroundSize = el.data.hasBackgroundStretch ? "cover" : "auto";
        }

        if (el.data.hasBackgroundGradient) {
            boxStyle.backgroundImage = el.data.backgroundGradient;
        }

        if (el.data.hasBackgroundColor) {
            boxStyle.backgroundColor = el.data.backgroundColor;
        }

        if (el.data.hasBorderColor) {
            boxStyle.borderColor = el.data.borderColor;
        }

        if (el.data.borderWidth) {
            boxStyle.borderStyle = "solid";
            boxStyle.borderWidth = el.data.borderWidth + this.props.pageData.pageConfig.fontUnit;
        }

        if (el.data.borderRadius) {
            boxStyle.borderRadius = el.data.borderRadius;
        }

        if (el.data.hasFontSize) {
            boxStyle.fontSize = `${el.data.fontSize}${this.state.fontUnit}`;
            boxStyle.lineHeight = `${el.data.fontSize}${this.state.fontUnit}`;
        }

        if (el.data.hasFontFamily) {
            boxStyle.fontFamily = el.data.fontFamily;
        } else if (this.props.pageData.pageConfig.fontFamily) {
            boxStyle.fontFamily = this.props.pageData.pageConfig.fontFamily;
        }

        if (el.data.hasTextColor) {
            boxStyle.color = el.data.textColor;
        } else if (this.props.pageData.pageConfig.textColor) {
            boxStyle.color = this.props.pageData.pageConfig.textColor;
        }

        if (el.data.scrollbars) {
            boxStyle.overflow = "auto";
        }

        const moduleStyle = {
            fontFamily: boxStyle.fontFamily,
            color: boxStyle.color,
            textColor: boxStyle.textColor,
            fontSize: boxStyle.fontSize
        };

        if (el.module) {
            if (el.module === "Header Module") {
                boxStyle.position = el.moduleOptions.isModuleSticky
                    ? "fixed !important"
                    : "";
                boxStyle.top = "0";
            }

            if(el.module === "Menu Module") {
                boxStyle.zIndex = 9999;
            }

            const LazyComponent = modules[el.module.replace(" ", "")] || <div/>;

            return (
                <div data-grid={box} key={`box-${index}`} style={boxStyle}>
                    <LazyComponent
                        control={this.control}
                        id={index}
                        element={box}
                        style={moduleStyle}
                        pageOptions={{pageId: pageId}}
                    />
                </div>
            );
        } else {
            return <div data-grid={box} key={index} style={boxStyle}></div>;
        }
    }

    render() {
        const classes = this.props.classes;
        const pageId = this.props.pageData.id;

        if (!this.props.pageData.items || !this.props.pageData.items.length) {
            return "";
        }

        const bodyStyle = {};

        const pageStyle = {
            fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
            fontFamily: this.props.pageData.pageConfig.fontFamily,
            color: this.props.pageData.pageConfig.textColor,
        };

        let hasBgImg = false;
        let hasBgColor = false;

        if(this.props.pageData.pageConfig.hasBackgroundGradient) {
            bodyStyle.backgroundImage = this.props.pageData.pageConfig.backgroundGradient;
            hasBgImg = true;
        } else if(this.props.pageData.pageConfig.hasBackgroundImage) {
            bodyStyle.backgroundImage = `url(/files/pages/page-${pageId}/${this.props.pageData.pageConfig.backgroundImage})`;

            hasBgImg = true;
        }

        if(this.props.pageData.pageConfig.hasBackgroundColor) {
            bodyStyle.backgroundColor = this.props.pageData.pageConfig.backgroundColor;
            hasBgColor = true;
        }

        if(this.props.pageData.pageConfig.hasBackgroundStretch) {
            bodyStyle.backgroundSize = "cover";
        } else {
            bodyStyle.backgroundSize = "auto";
        }

        if(this.props.pageData.pageConfig.hasBackgroundRepeat) {
            bodyStyle.backgroundRepeat = "repeat";
        } else {
            bodyStyle.backgroundRepeat = "no-repeat";
        }

        pageStyle.minHeight = "100%";

        return (
            <MuiThemeProvider theme={this.getTheme()}>
                <style jsx global>{`
                    body {
                      background-color: ${hasBgColor ? bodyStyle.backgroundColor : "#FFFFFF"};
                      ${hasBgImg && `background-image: ${bodyStyle.backgroundImage};`}
                      ${hasBgImg && `background-repeat: ${bodyStyle.backgroundRepeat};`}
                      ${hasBgImg && `background-size: ${bodyStyle.backgroundSize};`}
                    }
                `}</style>
                <div className={classes.gridHolder} style={pageStyle}>
                    <div className={classes.gridLayout}>
                        <ResponsiveReactGridLayout
                            style={{
                                fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                                fontFamily: this.props.pageData.pageConfig.fontFamily,
                                color: this.props.pageData.pageConfig.textColor,
                                minHeight: "100%"
                            }}
                            margin={this.props.pageData.pageConfig.layoutBoxSpacing}
                            {...this.props}
                            layouts={this.state.layouts}
                            onLayoutChange={(layout, layouts) => {
                                return this.onLayoutChange(layout, layouts);
                            }}
                            useCSSTransforms={true}
                            compactType="vertical"
                            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                            rowHeight={1} >{
                                this.props.pageData.items
                                ? this.props.pageData.items.filter(item => !(item.displayOptions?.displayAsModal)).map((el, i) => {
                                    return this.createBox(el, i);
                                })
                                : ""
                            }</ResponsiveReactGridLayout>
                    </div>
                </div>
                {this.state.googleFonts.length ? <GoogleFontLoader
                    fonts={this.state.googleFonts}
                /> : ""}
                {Object.keys(this.state.modalItems).map(itemKey => <BoxModal
                    key={itemKey}
                    showModal={this.state.modalItems[itemKey].show}
                    {...this.state.modalItems[itemKey]}
                />)}
            </MuiThemeProvider>
        );
    }
}

/*const mapStateToProps = state => {
  return {
    items: state.page.items,
    pageConfig: state.page.pageConfig,
    pageId: state.page.pageId
  };
};*/

let Component = withStyles(styles)(ViewPage);

/*if (publicRuntimeConfig?.wsEnabled) {
  Component = withRouter(withStyles(styles)(connect(
    mapStateToProps,
    null
  )(ViewPagesPreview)));
}*/
export default Component;