import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";

import { Helmet } from "react-helmet";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PagePreview extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 1,
  };

  state = {
    title: "",
    items: [],
    pageConfig: {
      backgroundColor: "",
      fontSize: "",
      fontFamily: "",
      textColor: "",
      layoutBoxSpacing: "",
      pageTitle: "",
      pageTitleFontSize: "",
      pageTitleTextColor: "",
    },
    fontUnit: "px",
    openedAccordionLink: {},
  };

  componentDidMount() {
    const allPages = JSON.parse(localStorage.getItem("pages"));
    const currentPage = allPages[Number(this.props.match.params.id) - 1];
    const items = currentPage.items;
    const pageConfig = currentPage.pageConfig;

    this.setState({
      items: items,
      pageConfig,
    });
  }

  createElement(el) {
    const i = el.i;
    el.static = true;

    let style = {};

    if (el.backgroundImage) {
      style.backgroundImage = `url(${el.backgroundImage})`;
    }

    if (el.backgroundRepeat) {
      style.backgroundRepeat = el.backgroundRepeat ? "repeat" : "no-repeat";
    }

    if (el.backgroundStretch) {
      style.backgroundSize = el.backgroundStretch ? "cover" : "auto";
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
      if (el.module === "Header Module") {
        style.position = el.moduleOptions.data.isModuleSticky
          ? "fixed !important"
          : "";
        style.top = "0";
      }

      if (LazyComponentName) {
        LazyComponent = React.lazy(() =>
          import(`./modulesPreviews/${LazyComponentName}`)
        );
      }

      return (
        <div key={i} data-grid={el} style={style}>
          <Suspense fallback={loadingFallback}>
            <LazyComponent i={i} element={el} style={style} />
          </Suspense>
        </div>
      );
    } else {
      return <div key={i} data-grid={el} style={style}></div>;
    }
  }

  // for MuiThemeProvider
  getTheme = () => {
    /*
    error?: PaletteColorOptions;
  warning?: PaletteColorOptions;
  info?: PaletteColorOptions;
  success?: PaletteColorOptions;
    */
    return createMuiTheme({
      overrides: {
        MuiSpeedDial: {
          fab: {
            backgroundColor: "",
            "&:hover": {
              backgroundColor: "",
            },
          },
        },
      },
    });
  };

  render() {
    const classes = this.props.classes;

    if (this.state.items === null || this.state.items.length === 0) {
      return "";
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Preview Page</title>
        </Helmet>
        <div className={classes.previewBodyWrapper}>
          <MuiThemeProvider theme={this.getTheme()}>
            <div className={classes.gridHolder}>
              <div
                className={classes.gridLayout}
                style={{
                  backgroundImage: `url(${this.state.pageConfig.backgroundImage})`,
                  backgroundRepeat: this.state.pageConfig.pageBackgroundRepeat
                    ? "repeat"
                    : "no-repeat",
                  backgroundSize: this.state.pageConfig.pageBackgroundStretch
                    ? "cover"
                    : "auto",
                  backgroundColor: this.state.pageConfig.backgroundColor,
                  fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                  fontFamily: this.state.fontFamily,
                  color: this.state.pageConfig.textColor,
                }}
              >
                <ResponsiveReactGridLayout
                  style={{
                    backgroundImage: `url(${this.state.pageConfig.backgroundImage})`,
                    backgroundRepeat: this.state.pageConfig.pageBackgroundRepeat
                      ? "repeat"
                      : "no-repeat",
                    backgroundSize: this.state.pageConfig.pageBackgroundStretch
                      ? "cover"
                      : "auto",
                    backgroundColor: this.state.pageConfig.backgroundColor,
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.pageConfig.textColor,
                  }}
                  margin={this.state.pageConfig.layoutBoxSpacing}
                  {...this.props}
                >
                  {this.state.items
                    ? _.map(this.state.items, (el) => this.createElement(el))
                    : ""}
                </ResponsiveReactGridLayout>
              </div>
            </div>
          </MuiThemeProvider>
        </div>
        )
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagePreview);
