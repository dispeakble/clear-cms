import _ from "lodash";
import React, { Suspense } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import styles from "assets/jss/clear-crm/views/pagePreview.js";
import { WidthProvider, Responsive } from "react-grid-layout";
import parse from "html-react-parser";

// for accordion menu
import List from "@material-ui/core/List";
import AppMenu from "components/AppMenuItem/AppMenu";

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

  createMenu(params, showAsAccordion, stretchToFit, backgroundColor, style) {
    const createLink = (elm) => {
      return (
        <li>
          <a href={elm.link} title={elm.title} target={elm.target}>
            {elm.text}
          </a>
          {elm.children && elm.children.length
            ? this.createMenu(elm.children)
            : ""}
        </li>
      );
    };

    console.log(backgroundColor);

    if (!showAsAccordion) {
      return (
        <ul
          style={{ display: stretchToFit ? "flex" : "" }}
          className={this.props.classes.linksMenuUl}
        >
          {params.map((elm) => createLink(elm))}
        </ul>
      );
    } else {
      return (
        <List component="nav" disablePadding>
          <AppMenu
            menuLinksData={params}
            bgColor={backgroundColor}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              border: "1px solid rgba(0,0,0,0.3)",
            }}
          />
        </List>
      );
    }
  }

  handleClick = (id) => {
    let openedAccordionLinks = this.state.openedAccordionLink;
    openedAccordionLinks[id] = !openedAccordionLinks[id];

    this.setState({ openedAccordionLinks });
  };

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

    if (el.showScrollbars) {
      style.overflow = "auto";
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
        if (el.moduleOptions.data.isRichFormattedText) {
          return (
            <div key={i} data-grid={el} style={style}>
              {el.moduleOptions ? parse(el.moduleOptions.data.textData) : ""}
            </div>
          );
        } else {
          return (
            <div key={i} data-grid={el} style={style}>
              {el.moduleOptions ? el.moduleOptions.data.textData : ""}
            </div>
          );
        }
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

        // let x = (
        //   <div>
        //     <p>ppppp</p>
        //   </div>
        // );
        // let y = <p>nnnnn</p>;
        // let w = String(x).replace("<div>", "");
        // console.log(w);
        // let z = w.replace("</div>", "");
        // console.log(z);
        // x = `<div>${z}</div>`;
        // console.log(x);

        let linksList = el.moduleOptions.data.links.filter(
          (link) => !link.parentId
        );
        let isVertical = el.moduleOptions.data.isVertical;
        let showAsAccordion = el.moduleOptions.data.showAsAccordion;
        let stretchToFit = el.moduleOptions.data.stretchToFit;
        let backgroundColor = el.moduleOptions.data.backgroundColor;

        function populateChildrenLinks(childRows) {
          let childrenRows = childRows
            ? childRows.map((childLink) => ({
                id: childLink.id,
                title: childLink.title,
                text: childLink.text,
                href: childLink.link,
                target: childLink.targetLink,
                children: populateChildrenLinks(childLink.tableData.childRows),
              }))
            : "";

          return childrenRows;
        }

        let menuData = linksList.map((link) => ({
          id: link.id,
          title: link.title,
          text: link.text,
          href: link.link,
          target: link.targetLink,
          children: populateChildrenLinks(link.tableData.childRows),
        }));

        return (
          <div
            className={
              isVertical
                ? classes.verticalLinksMenu
                : classes.horizontalLinksMenu
            }
            key={i}
            data-grid={el}
            style={{ display: "inline-block" }}
          >
            {(() => {
              return this.createMenu(
                menuData,
                showAsAccordion,
                stretchToFit,
                backgroundColor,
                style
              );
            })()}
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
