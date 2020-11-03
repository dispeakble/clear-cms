import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { withRouter, Route, Switch } from "react-router-dom";
import styles from "./assets/jss/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";

import { Helmet } from "react-helmet";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class App extends React.PureComponent {
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
    fontUnit: "px", //TODO make dynamic or rem
    openedAccordionLink: {},
    pathname: "",
  };

  navigateToUrl() {
    const { pathname } = this.props.location;

    if (pathname === this.state.pathname) {
      return true;
    }

    const allPages = JSON.parse(localStorage.getItem("pages"));
    let currentPage;
    if (pathname !== "/") {
      currentPage = allPages.find((el) => el.pageConfig.pageLink === pathname);
    }

    if (pathname === "/") {
      currentPage = allPages.find((el) => el.pageConfig.defaultPage);
    }

    const items = currentPage ? currentPage.items : "";
    const pageConfig = currentPage ? currentPage.pageConfig : "";

    this.setState({
      items: items,
      pageConfig,
      pathname,
    });
  }

  shouldComponentUpdate() {
    this.navigateToUrl();
    return true;
  }

  componentDidMount() {
    this.navigateToUrl();
  }

  updateCurrentPage = () => {
    const { pathname } = this.props.location;

    const allPages = JSON.parse(localStorage.getItem("pages"));
    let currentPage;
    if (pathname !== "/") {
      currentPage = allPages.find((el) => el.pageConfig.pageLink === pathname);
    }

    if (pathname === "/") {
      currentPage = allPages.find((el) => el.pageConfig.defaultPage);
    }

    const items = currentPage ? currentPage.items : "";
    const pageConfig = currentPage ? currentPage.pageConfig : "";

    this.setState({
      items: items,
      pageConfig,
    });
  };

  createElement(el) {
    const i = el.i;
    el.static = true;

    let style = {};

    if (el.backgroundImage) {
      style.backgroundImage = `url(${el.backgroundImage})`;
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

    if (el.backgroundImage) {
      style.backgroundImage = el.backgroundImage;
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
        if (el.moduleOptions.data.bg) {
          style.backgroundImage = `url(${el.moduleOptions.data.bg})`;
          style.backgroundRepeat = `no-repeat`;
          style.backgroundSize = "cover";
          style.backgroundPosition = "center center";
        }

        style.position = el.moduleOptions.data.isModuleSticky
          ? "fixed !important"
          : "";
        style.top = "0";
      }

      if (LazyComponentName) {
        LazyComponent = React.lazy(() =>
          import(`./modules/${LazyComponentName}`)
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
    const { pathname } = this.props.location;
    const classes = this.props.classes;

    if (this.state.items === null || this.state.items.length === 0) {
      return "";
    }

    return (
      <div className={classes.previewBodyWrapper}>
        <Helmet>
          <title>{this.state.pageConfig.pageTitle}</title>
        </Helmet>
        <MuiThemeProvider theme={this.getTheme()}>
          <div className={classes.gridHolder}>
            <div
              className={classes.gridLayout}
              style={{
                backgroundColor: this.state.pageConfig.backgroundColor,
                fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                fontFamily: this.state.fontFamily,
                color: this.state.pageConfig.textColor,
              }}
            >
              <ResponsiveReactGridLayout
                style={{
                  backgroundImage: `url(${this.state.pageConfig.backgroundImage})`,
                  backgroundColor: this.state.pageConfig.backgroundColor,
                  fontSize: `${this.state.pageConfig.fontSize}${this.state.fontUnit}`,
                  fontFamily: this.state.pageConfig.fontFamily,
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
    );
  }
}

export default withRouter(withStyles(styles)(App));
