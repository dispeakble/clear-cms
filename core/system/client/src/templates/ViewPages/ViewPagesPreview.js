import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import { withRouter } from "react-router-dom";

import { Helmet } from "react-helmet";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewPagesPreview extends React.Component {
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
    layouts: {},
    fontUnit: "px",
    openedAccordionLink: {},
    page_id:0
  };

  navigateToUrl() {
    // const { pathname } = this.props.location;
    // const pathnameId = Number(pathname.split("/")[2]);
    //
    // if (pathname === this.state.pathname) {
    //   return true;
    // }
    //
    // // const allPages = JSON.parse(localStorage.getItem("pages"));
    // // let currentPage;
    // // currentPage = allPages.find((el) => el.id === pathnameId);
    // //
    // // const items = currentPage ? currentPage.items : "";
    // // const pageConfig = currentPage ? currentPage.pageConfig : "";
    //
    // const
    //
    // this.setState({
    //   items: items,
    //   pageConfig,
    //   pathname,
    // });
  }

  componentDidMount() {
    this.loadPage();
  }

  async loadPage(){
    const page_id = Number(this.props.location.pathObject[2]);
    const page = await this.props.control.get({
      id: page_id
    });
    this.setState({
      page_id: page_id,
      items: page.items,
      pageConfig: page.pageConfig
    });
  }

  createElement(el) {
    const i = el.i;
    el.static = true;

    let style = {};

    if (el.backgroundImage) {
      style.backgroundImage = `url(/files/pages/page-${this.state.page_id}/box-${i}/${el.backgroundImage})`;
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
        <div key={`box-${el.i}`} data-grid={el} style={style}>
          <Suspense fallback={loadingFallback}>
            <LazyComponent i={i} element={el} style={style} pageOptions={{page_id: this.state.page_id}} />
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

  onLayoutChange = (layout, layouts) => {
    try {
      this.setState({ layouts: layouts });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const classes = this.props.classes;

    if (this.state.items === null || this.state.items.length === 0) {
      return "";
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{this.state.pageConfig.pageTitle} </title>
        </Helmet>
        <div className={classes.previewBodyWrapper}>
          <MuiThemeProvider theme={this.getTheme()}>
            <div className={classes.gridHolder}>
              <div
                className={classes.gridLayout}
                style={{
                  backgroundImage: `url(/files/pages/page-${this.state.page_id}/${this.state.pageConfig.backgroundImage})`,
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
                }}
              >
                <ResponsiveReactGridLayout
                  style={{
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.pageConfig.textColor,
                  }}
                  margin={this.state.pageConfig.layoutBoxSpacing}
                  {...this.props}
                  measureBeforeMount={true}
                  layouts={this.state.layouts}
                  onLayoutChange={(layout, layouts) => {
                    return this.onLayoutChange(layout, layouts);
                  }}
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

export default withRouter(withStyles(styles)(ViewPagesPreview));
