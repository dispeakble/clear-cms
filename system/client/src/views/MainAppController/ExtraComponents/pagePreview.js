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
    config: {
      backgroundColor: "",
      fontSize: "",
      fontFamily: "",
      textColor: "",
      layoutBoxSpacing: "",
      pageTitle: "",
    },
  };

  componentDidMount() {
    const items = JSON.parse(localStorage.getItem("items"));
    this.setState({
      items: items,
    });

    const config = JSON.parse(localStorage.getItem("pageConfig"));

    this.setState({
      config: config,
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
            fontSize: this.state.config.fontSize,
            fontFamily: this.state.config.fontFamily,
            color: this.state.config.fontColor,
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
            backgroundColor: this.state.config.backgroundColor,
            "&:hover": {
              backgroundColor: this.state.config.backgroundColor,
            },
          },
        },
      },
    });
  };

  render() {
    const classes = this.props.classes;

    return (
      <div
        className={classes.previewBodyWrapper}
        style={{ backgroundColor: this.state.config.backgroundColor }}
      >
        <MuiThemeProvider theme={this.getTheme()}>
          <div className={classes.gridHolder}>
            <div className={classes.gridLayout}>
              <h1 className={classes.pageTitle}>
                {this.state.config.pageTitle}
              </h1>
              <ResponsiveReactGridLayout
                margin={this.state.config.layoutBoxSpacing}
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
    );
  }
}

export default withStyles(styles)(PagePreview);
