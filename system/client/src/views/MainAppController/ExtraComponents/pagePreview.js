import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PagePreview extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 1,
  };

  state = {
    title: "",
    showModal: false,
    itemOnDeleteIndex: "",
    isAddBtnDisabled: true,
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
    pageModule: [],
    fontUnit: "px",
  };

  componentDidMount() {
    const items = JSON.parse(localStorage.getItem("items"));
    this.setState({
      items: items,
    });

    const pageConfig = JSON.parse(localStorage.getItem("pageConfig"));

    this.setState({
      pageConfig,
    });
  }

  createElement(el) {
    const i = el.i;
    el.static = true;

    let style = {};

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

    if (el.fontSize) {
      style.fontSize = `${el.fontSize}${this.state.fontUnit}`;
      style.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
    }

    if (el.fontFamily) {
      style.fontFamily = el.fontFamily;
    }

    if (el.textColor) {
      style.color = el.textColor;
    }

    const loadingFallback = (() => {
      return <span>Loading...</span>;
    })();

    let LazyComponent;

    switch (el.module) {
      case "Text Module":
        LazyComponent = React.lazy(() => import(`./modules/TextModule`));
        break;
      case "Header Module":
        LazyComponent = React.lazy(() => import(`./modules/HeaderModule`));
        break;
      case "Menu Module":
        LazyComponent = React.lazy(() => import(`./modules/MenuModule`));
        break;
      default:
        LazyComponent = "";
    }

    return (
      <div key={i} data-grid={el} style={style}>
        {el.module ? (
          <Suspense fallback={loadingFallback}>
            <LazyComponent />
          </Suspense>
        ) : (
          ""
        )}
      </div>
    );
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
    console.log(this.state.items === undefined);

    return (
      <React.Fragment>
        {this.state.items !== null && this.state.items.length > 0 ? (
          <div className={classes.previewBodyWrapper}>
            <MuiThemeProvider theme={this.getTheme()}>
              <div className={classes.gridHolder}>
                <div
                  className={classes.gridLayout}
                  style={{
                    backgroundColor: this.state.pageConfig.backgroundColor,
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.textColor,
                  }}
                >
                  <ResponsiveReactGridLayout
                    style={{
                      backgroundColor: this.state.pageConfig.backgroundColor,
                      fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                      fontFamily: this.state.fontFamily,
                      color: this.state.textColor,
                    }}
                    margin={this.state.pageConfig.layoutBoxSpacing}
                    isBounded="true"
                    onLayoutChange={() => this.onLayoutChange}
                    onBreakpointChange={() => this.onBreakpointChange}
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
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagePreview);
