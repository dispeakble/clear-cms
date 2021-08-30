import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import { withRouter } from 'next/router'
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();


const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewPagesPreview extends React.Component {

  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 1
  };

  state = {
    pageId: 0,
    title: "",
    pageLink: this.props.pageData?.pageConfig?.pageLink,
    items: [],
    pageConfig: this.props.pageData?.pageConfig,
    fontUnit: "px",
    layouts: {},
    //pageDataLoaded: false
  };

  componentDidMount() {
    this.setState({
      pageLink: this.props.pageData?.pageConfig?.pageLink,
      items: this.props.pageData?.items,
      pageConfig: this.props.pageData?.pageConfig,
      page_id: this.props.pageData?.id
    })
  }

  onLayoutChange = (layout, layouts) => {
    try {
      this.setState({ layouts: layouts });
    } catch (err) {
      console.log(err);
    }
  };

  createElement(el) {//TODO get from a shared config or something
    const i = el.i;
    el.static = true;

    let style = {};

    if (el.backgroundImage) {
      style.backgroundImage = `url(/files/pages/page-${el.templateUsed ? el.templateUsed : this.state.page_id}/box-${i}/${el.backgroundImage})`;
    }

    if (el.backgroundRepeat) {
      style.backgroundRepeat = el.backgroundRepeat ? "repeat" : "no-repeat";
    }

    if (el.backgroundStretch) {
      style.backgroundSize = el.backgroundStretch ? "cover" : "auto";
    }

    if (el.backgroundGradient) {
      style.backgroundImage = el.backgroundGradientColor;
    }

    if (el.backgroundColor) {
      style.backgroundColor = el.backgroundColor;
    }

    if (el.borderColor) {
      style.borderColor = el.borderColor;
    }

    if (el.borderWidth) {
      style.borderStyle = "solid";
      style.borderWidth = el.borderWidth + "px";
    }

    if (el.borderRadius) {
      style.borderRadius = el.borderRadius;
    }

    if (Number(el.fontSize)) {
      style.fontSize = `${el.fontSize}${this.state.fontUnit}`;
      style.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
    } else if (this.state.pageConfig.fontSize) {
      style.fontSize = `${this.state.pageConfig.fontSize}${this.state.fontUnit}`;
      style.fontSlineHeightize = `${this.state.pageConfig.fontSize}${this.state.fontUnit}`;
    }

    if (el.fontFamily) {
      style.fontFamily = el.fontFamily;
    } else if (this.state.pageConfig.fontFamily) {
      style.fontFamily = this.state.pageConfig.fontFamily;
    }

    if (el.textColor) {
      style.color = el.textColor;
    } else if (this.state.pageConfig.textColor) {
      style.textColor = this.state.pageConfig.textColor;
    }

    if (el.showScrollbars) {
      style.overflow = "auto";
    }

    const loadingFallback = (() => {
      return <span>Loading...</span>;
    })();

    if (el.module) {
      let LazyComponent = null;
      let LazyComponentName = el.module.replace(" ", "");
      if (el.module === "Header Module" && el.moduleOptions.data.isModuleSticky) {
        style.position = "fixed !important";
        style.top = "0";
      }

      if (LazyComponentName) {
        LazyComponent = React.lazy(() =>
          import(`./modulesPreviews/${LazyComponentName}`)
        );
      }

      return (
        <div key={`box-${el.i}`} data-grid={el} style={style}>
          <Suspense fallback={loadingFallback}>
            <LazyComponent i={i} element={el} style={style} pageOptions={{page_id: el.templateUsed ? el.templateUsed : this.state.page_id}} />
          </Suspense>
        </div>
      );
    } else {
      return <div key={i} data-grid={el} style={style}></div>;
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
      },
    });
  };

  render() {
    const classes = this.props.classes;

    if (this.state.items === null || this.state.items?.length === 0) {
      return "";
    }

    console.log(this.state.pageConfig)

    return (
        <React.Fragment>
          <Helmet>
            <title>{this.state.pageConfig?.pageTitle || ''} </title>
            <meta name="keyword" content="test desc" />
          </Helmet>
          <div className={classes.previewBodyWrapper}>
            <MuiThemeProvider theme={this.getTheme()}>
              <div className={classes.gridHolder}>
                <div
                  className={classes.gridLayout}
                  style={{
                    backgroundImage: `url(/files/pages/page-${this.state.page_id}/${this.state.pageConfig?.backgroundImage})`,
                    backgroundRepeat: this.state.pageConfig?.backgroundRepeat
                      ? "repeat"
                      : "no-repeat",
                    backgroundSize: this.state.pageConfig?.backgroundStretch
                      ? "cover"
                      : "auto",
                    backgroundColor: this.state.pageConfig?.backgroundColor,
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.pageConfig?.textColor,
                  }}
                >
                  <ResponsiveReactGridLayout
                    style={{
                      fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                      fontFamily: this.state.fontFamily,
                      color: this.state.pageConfig?.textColor,
                    }}
                    isBounded={true}
                    margin={this.state.pageConfig?.layoutBoxSpacing}
                    {...this.props}
                    layouts={this.state.layouts}
                    onLayoutChange={(layout, layouts) => {
                      return this.onLayoutChange(layout, layouts);
                    }}
                    measureBeforeMount={true}
                    compactType="vertical"
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    useCSSTransforms={false}
                  >
                    {this.state.items
                      ? _.map(this.state.items, (el) => this.createElement(el))
                      : ""}
                  </ResponsiveReactGridLayout>
                </div>
              </div>
            </MuiThemeProvider>
          </div>
        </React.Fragment>
    );
  }
}




const mapStateToProps = state => {
  return {
    pageLink: state.page.pageLink,
    items: state.page.items,
    pageConfig: state.page.pageConfig,
    pageId: state.page.pageId,
    pageDataLoaded: state.page.pageDataLoaded
  };
};
let Component; 

if (publicRuntimeConfig?.wsEnabled) {
  Component = withRouter(withStyles(styles)(connect(
    mapStateToProps,
    null
  )(ViewPagesPreview)));
} else {
  Component = withRouter(withStyles(styles)(ViewPagesPreview));
}
export default Component;