import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "../../assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import { withRouter } from 'next/router'
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import getConfig from 'next/config'
import BoxModal from "../../components/BoxModal/BoxModal";
import GoogleFontLoader from 'react-google-font-loader';

const { publicRuntimeConfig } = getConfig();

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ViewPagesPreview extends React.Component {

  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 1
  };

  state = {
    pageId: 0,
    title: this.props.pageData?.pageConfig?.pageTitle,
    pageLink: this.props.pageData?.pageConfig?.pageLink,
    items: [],
    pageConfig: this.props.pageData?.pageConfig,
    fontUnit: "rem",
    layouts: {},
    //pageDataLoaded: false,
    modals: [],
    googleFonts: []
  };

  setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

  async componentDidMount() {
    await this.setAsyncState({
      pageLink: this.props.pageData?.pageConfig?.pageLink,
      items: this.props.pageData?.items,
      pageConfig: this.props.pageData?.pageConfig,
      page_id: this.props.pageData?.id
    });

    this.setUsedGoogleFonts();

    let modalItems = {}
    if(this.props.pageData && this.props.pageData.items) {
      this.props.pageData.items.filter(item => item.displayOptions && item.displayOptions.displayAsModal).map(el =>
          modalItems[el.title + el.i] = {
            name: el.title,
            title: el.title,
            show: this.fetchPopupState(el.title + el.i, el.displayOptions.neverShowAfterClosing),
            content: this.createElement(el),
            showCloseButton: el.displayOptions.showCloseButton,
            position: el.displayOptions.modalPosition,
            displayBackdrop: el.displayOptions.displayBackdrop,
            neverShowAfterClosing: el.displayOptions.neverShowAfterClosing,
            closeButton: {
              show: el.displayOptions.showCancelButton,
              callback: () => {
                this.switchBoxModalState(el)
                if(el.displayOptions.cancelButtonLink) {
                  this.props.history.push(el.displayOptions.cancelButtonLink);
                }
              },
              label: el.displayOptions.cancelButtonTitle,
            },
            confirmButton: {
              show: el.displayOptions.showActionButton,
              callback: () => {
                this.switchBoxModalState(el)
                if(el.displayOptions.actionButtonLink) {
                  this.props.history.push(el.displayOptions.actionButtonLink);
                }
              },
              label: el.displayOptions.actionButtonTitle,
            },
          })
      this.setState({
        modalItems: modalItems
      })
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
    if(el.displayOptions.neverShowAfterClosing) {
      localStorage.setItem(el.title + el.i, el.title);
    }
  }

  fetchPopupState = (key, neverShowAfterClosing) => {
    if(neverShowAfterClosing) {
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
      style.lineHeight = `${this.state.pageConfig.fontSize}${this.state.fontUnit}`;
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
    } else {
      style.overflow = "hidden";
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

  setUsedGoogleFonts() {
    const fonts = [];

    if(this.state.fontFamily && this.state.fontFamily.length) {
      fonts.push({font: this.state.fontFamily});
    }

    if(this.state.items && this.state.items.length) {
      this.state.items.map((item) => {
        if(item.fontFamily && !fonts.some(f => f.font === item.fontFamily)) {
          fonts.push({font: item.fontFamily});
        }
      });
    }
    this.setState({
      googleFonts: fonts
    })
  }

  render() {
    const classes = this.props.classes;

    if (this.state.items === null || this.state.items?.length === 0) {
      return "";
    }

    const style = {
      backgroundImage: this.state.pageConfig.backgroundGradient ? this.state.pageConfig.backgroundGradientColor : `url(/files/pages/page-${this.state.page_id}/${this.state.pageConfig.backgroundImage})`,
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
    };

    delete style.backgroundImage;
    delete style.backgroundColor;

    style.minHeight = "100%";

    return (
      <React.Fragment>
        <Helmet>
          <title>{this.state.pageConfig.pageTitle} </title>
        </Helmet>
        { this.state.googleFonts.length && <GoogleFontLoader
            fonts={this.state.googleFonts}
        /> }
        <div className={classes.previewBodyWrapper}>
          <MuiThemeProvider theme={this.getTheme()}>
            <div className={classes.gridHolder}>
              <div
                className={classes.gridLayout}
                style={style}
              >
                <ResponsiveReactGridLayout
                  style={{
                    fontSize: `${this.state.fontSize}${this.state.fontUnit}`,
                    fontFamily: this.state.fontFamily,
                    color: this.state.pageConfig.textColor,
                    minHeight: "100%"
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
                    ? _.map(this.state.items.filter(item => !(item.displayOptions && item.displayOptions.displayAsModal)), (el) => this.createElement(el))
                    : ""}
                </ResponsiveReactGridLayout>
              </div>
            </div>
          </MuiThemeProvider>
          {this.state.modalItems && Object.keys(this.state.modalItems).map(itemKey => <BoxModal
              key={itemKey}
              showModal={this.state.modalItems[itemKey].show}
              {...this.state.modalItems[itemKey]}
          />)}
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
let Component = withStyles(styles)(ViewPagesPreview);

if (publicRuntimeConfig?.wsEnabled) {
  Component = withRouter(withStyles(styles)(connect(
    mapStateToProps,
    null
  )(ViewPagesPreview)));
}
export default Component;