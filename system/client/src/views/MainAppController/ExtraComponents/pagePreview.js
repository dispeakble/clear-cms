import _ from "lodash";
import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import {
  Save,
  Delete,
  AddCircle,
  Code,
  Visibility,
  HighlightOff,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import CustomInput from "components/CustomInput/CustomInput.js";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PagePreview extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
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
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
    const i = el.i;
    el.static = true;
    return (
      <div
        key={i}
        data-grid={el}
        style={{
          padding: "5px",
          backgroundColor: el.backgroundColor,
          borderColor: el.borderColor,
          borderWidth: el.borderWidth,
          borderRadius: el.borderRadius,
          backgroundImage: el.backgroundImage,
        }}
      >
        <p
          style={{
            fontSize: `${el.fontSize}rem`,
            fontFamily: el.fontFamily,
            color: el.textColor,
          }}
        >
          {el.module}
        </p>
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
                    fontSize: `${this.state.fontSize}rem`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.textColor,
                  }}
                >
                  <h5
                    style={{
                      fontSize: `${this.state.pageConfig.pageTitleFontSize}rem`,
                      color: this.state.pageConfig.pageTitleTextColor,
                    }}
                    className={classes.pageTitle}
                  >
                    {this.state.pageConfig.pageTitle}
                  </h5>
                  <ResponsiveReactGridLayout
                    style={{
                      backgroundColor: this.state.pageConfig.backgroundColor,
                      fontSize: `${this.state.fontSize}rem`,
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
          <div className={classes.noItemsMessageWrapper}>
            <h1 className={classes.noItemsMessage}>
              There are no added items.
            </h1>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagePreview);
