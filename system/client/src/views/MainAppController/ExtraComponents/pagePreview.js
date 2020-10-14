import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import parse from "html-react-parser";
import { LinkSharp } from "@material-ui/icons";

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
    const allPages = JSON.parse(localStorage.getItem("pages"));
    const currentPage = allPages[Number(this.props.match.params.id) - 1];
    const items = currentPage.items;
    const pageConfig = currentPage.pageConfig;
    console.log(items);

    this.setState({
      items: items,
      pageConfig,
    });
  }

  createElement(el, classes) {
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

    if (Number(el.fontSize)) {
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
        style.backgroundImage = `url(${el.moduleOptions.data.bg})`;
        style.backgroundRepeat = `no-repeat`;
        style.backgroundSize = "cover";
        style.backgroundPosition = "center center";
        style.position = "fixed !important";
        style.top = "0";
        LazyComponent = React.lazy(() => import(`./modules/HeaderModule`));
        break;
      case "Menu Module":
        LazyComponent = React.lazy(() => import(`./modules/MenuModule`));
        break;
      default:
        LazyComponent = null;
    }

    switch (el.module) {
      case "Header Module":
        return (
          <div
            key={i}
            data-grid={el}
            style={style}
            className={
              el.moduleOptions.data.isModuleSticky ? classes.itemWrapper : ""
            }
          >
            <a
              title={el.moduleOptions.data.logoTitle}
              href={el.moduleOptions.data.logoLink}
              target="_blank"
            >
              <img
                className={classes.logoImage}
                src={el.moduleOptions.data.logoImage}
                alt={el.moduleOptions.data.logoTitle}
              />
            </a>
          </div>
        );
        break;
      case "Text Module":
        return (
          <div key={i} data-grid={el} style={style}>
            {el.moduleOptions ? parse(el.moduleOptions.data) : ""}
          </div>
        );
        break;
      case "Menu Module":
        let link_style = {
          display: "block",
          padding: "0 15px",
        };
        if (el.textColor) {
          link_style.color = el.textColor;
        }
        // if (el.fontSize) {
        //   link_style.fontSize = `${el.fontSize}${this.state.fontUnit}`;
        //   link_style.lineHeight = `${el.fontSize}${this.state.fontUnit}`;
        // }
        return (
          <div key={i} data-grid={el} style={style}>
            <ul
              style={{
                margin: "0",
                padding: "0",
                listStyle: "none",
              }}
            >
              {el.moduleOptions.data.links.map((elm, i) => {
                return (
                  <li
                    style={{
                      display: "inline-block",
                    }}
                  >
                    <a
                      style={el.moduleOptions.isVertical ? link_style : {}}
                      title={elm.title}
                      href={elm.link}
                      target={elm.targetLink}
                    >
                      {elm.text} ADD HOVER EFFECT :D
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
        break;
      default:
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
                      ? _.map(this.state.items, (el) =>
                          this.createElement(el, classes)
                        )
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
