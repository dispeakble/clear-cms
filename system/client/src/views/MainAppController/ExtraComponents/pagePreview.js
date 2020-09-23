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
    items: JSON.parse(localStorage.getItem("items"))
      ? JSON.parse(localStorage.getItem("items"))
      : "",
  };

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
            fontSize: JSON.parse(localStorage.getItem("fontSize"))
              ? `${JSON.parse(localStorage.getItem("fontSize"))}rem`
              : "",
            fontFamily: JSON.parse(localStorage.getItem("fontFamily"))
              ? JSON.parse(localStorage.getItem("fontFamily"))
              : "",
            color: JSON.parse(localStorage.getItem("textColor"))
              ? JSON.parse(localStorage.getItem("textColor"))
              : "",
          }}
        >
          {el.title}
        </p>
        <p
          style={{
            fontSize: JSON.parse(localStorage.getItem("fontSize"))
              ? `${JSON.parse(localStorage.getItem("fontSize"))}rem`
              : "",
            fontFamily: JSON.parse(localStorage.getItem("fontFamily"))
              ? JSON.parse(localStorage.getItem("fontFamily"))
              : "",
            color: JSON.parse(localStorage.getItem("textColor"))
              ? JSON.parse(localStorage.getItem("textColor"))
              : "",
          }}
        >
          {el.module}
        </p>
      </div>
    );
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  };

  onLayoutChange(layout) {
    this.setState({ layout: layout });
  }

  onRemoveItem(i) {
    this.setState({
      items: _.reject(this.state.items, { i: i }),
    });
  }

  handleInputChange = (event) => {
    if (event.target.value.length >= 5) {
      this.setState({ isAddBtnDisabled: false, title: event.target.value });
    } else {
      this.setState({ isAddBtnDisabled: true });
    }
  };

  closeModal() {
    this.setState({ showModal: false });
  }

  handleEdit = () => {
    console.log("editted");
  };

  handleSave = () => {
    const { history } = this.props;
    history.push("/pages");
  };

  handleDelete = () => {
    this.setState({ showModal: true });
  };

  callConfirmCallback = () => {
    this.closeModal();
    const { history } = this.props;
    history.push("/pages");
  };

  // for Hamburger menu

  handleHiddenChange = (event) => {
    this.setState({ hidden: event.target.checked });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

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
            backgroundColor: "darkcyan",
            "&:hover": {
              backgroundColor: "#006F6F",
            },
          },
        },
      },
    });
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <div className={classes.bodyWrapper}>
          <MuiThemeProvider theme={this.getTheme()}>
            <div className={classes.gridHolder}>
              <div className={classes.gridLayout}>
                <h1 className={classes.pageTitle}>
                  {JSON.parse(localStorage.getItem("pageTitle"))
                    ? JSON.parse(localStorage.getItem("pageTitle"))
                    : ""}
                </h1>
                <ResponsiveReactGridLayout
                  style={{
                    backgroundColor: JSON.parse(localStorage.getItem("bgColor"))
                      ? JSON.parse(localStorage.getItem("bgColor"))
                      : "",
                  }}
                  margin={
                    JSON.parse(localStorage.getItem("layoutBoxSpacing"))
                      ? JSON.parse(localStorage.getItem("layoutBoxSpacing"))
                      : 0
                  }
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PagePreview);
