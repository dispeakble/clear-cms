import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";

//Wrappers
import Header from "components/Header/Header.js";
import SideMenuLinks from "components/Header/SideMenuLinks.js";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/categories.js";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Helmet } from "react-helmet";

//views //TODO MOVE TO CONTROLLERS
import Dashboard from "views/Dashboard/Dashboard.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import MainAppController from "views/MainAppController/MainAppController";
import PagesAdd from "views/MainAppController/ExtraComponents/pagesAdd";
import PagePreview from "views/MainAppController/ExtraComponents/pagePreview";

//styles
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "assets/scss/clear-crm.scss";

//Controllers
import AuthController from "controllers/auth.controller";

//Services
import WsService from "services/ws.service";

class App extends Component {
  state = {
    services: {},
    moduleList: {
      list: [
        {
          id: 1,
          title: "",
          items: [
            {
              id: 1,
              name: "All Modules",
              icon: "apps",
              subitems: [
                {
                  //TODO get this from hub module list
                  toLink: "/pages",
                  name: "Pages",
                  icon: "web",
                  active: true,
                },
                {
                  toLink: "/categories",
                  name: "Categories",
                  icon: "category",
                  active: false,
                },
                {
                  toLink: "/themes",
                  name: "Themes",
                  icon: "brush",
                  active: false,
                },
                {
                  toLink: "/fileUpload",
                  icon: "publish",
                  name: "File Upload",
                  active: false,
                },
                {
                  toLink: "/forum",
                  icon: "forum",
                  name: "Forum",
                  active: false,
                },
                {
                  toLink: "/video-conference",
                  icon: "video_call",
                  name: "Video Conference",
                  active: false,
                },
                {
                  toLink: "/file-transfer",
                  icon: "attachment",
                  name: "File Transfer",
                  active: false,
                },
                {
                  toLink: "/photo-gallery",
                  icon: "photo_library",
                  name: "Photo Gallery",
                  active: false,
                },
              ],
            },
            {
              id: 1,
              name: "Settings",
              icon: "settings",
              subitems: [
                {
                  //TODO get this from hub module list
                  toLink: "/general-settings",
                  name: "General Settings",
                  icon: "settings",
                  active: false,
                },
              ],
            },
          ],
        },
      ],
    },
    excludeHeader: ["pagePreview", "view-auth", "recover-password"],
    socket: {},
    mobileOpen: false,
    someTweakedState: false,
  };

  constructor() {
    super();
    this.state.services.ws = new WsService();
    this.state.services.ws.start();
  }

  defaultThemeToDispatch;

  getTheme = () => {
    const themes = JSON.parse(localStorage.getItem("adminThemes"));

    const hardcodedStyles = {
      text: {
        //primary: "#F00",
        //secondary: "#0F0",
        disabled: "#00F",
        hint: "#333",
      },
      error: {
        main: "#FF0000",
      },
      warning: {
        main: "#FF0000",
      },
      info: {
        main: "#FF0000",
      },
      success: {
        main: "#FF0000",
      },
      primary: {
        main: "#008B8B",
      },
      secondary: {
        main: "#FFFFFF",
      },
    };

    let defaultTheme;

    console.log(themes);

    if (themes) {
      defaultTheme = themes.find((theme) => theme.isdefault === true);
      if (!defaultTheme) {
        defaultTheme = hardcodedStyles;
      }
    } else {
      defaultTheme = hardcodedStyles;
    }

    this.defaultThemeToDispatch = defaultTheme;
    console.log(this.defaultThemeToDispatch);

    return createMuiTheme({
      palette: defaultTheme,
      overrides: {
        paperWidthSm: "100%",
      },
    });
  };

  tweakTheState = () => {
    this.setState({ someTweakedState: !this.state.someTweakedState });
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  render() {
    const { pathname } = this.props.location;
    const basePath = pathname.substring(1).split("/");
    return (
      <React.Fragment>
        <Helmet>
          <title>App</title>
        </Helmet>

        <MuiThemeProvider theme={this.getTheme()}>
          <CssBaseline />
          {this.state.excludeHeader.indexOf(basePath[0]) === -1 ? (
            <Header
              mobileOpen={this.state.mobileOpen}
              color="transparent"
              brand="Clear CRM"
              handleDrawerToggle={() => this.handleDrawerToggle()}
              leftLinks={
                <SideMenuLinks
                  closeDrawer={() => this.handleDrawerToggle()}
                  moduleList={this.state.moduleList}
                />
              }
              fixed
              changeColorOnScroll={{
                height: 10,
                color: "info",
              }}
            />
          ) : (
            ""
          )}
          <Switch>
            <Route
              path="/view-auth"
              render={(props) => {
                return (
                  <AuthController {...props} services={this.state.services} />
                );
              }}
            />
            <Route
              path="/logout"
              render={(props) => {
                return (
                  <AuthController {...props} services={this.state.services} />
                );
              }}
            />
            <Route
              path="/recover-password"
              render={(props) => {
                return (
                  <AuthController {...props} services={this.state.services} />
                );
              }}
            />
            <Route path="/profile-page" component={ProfilePage} />
            <Route path="/" exact component={Dashboard} />
            <Route path="/pagesAdd" component={PagesAdd} />
            <Route path="/pagePreview/:id" component={PagePreview} />
            <Route path="/pageEdit/:id" component={PagesAdd} />
            <Route
              render={(props) => (
                <MainAppController
                  tweakTheState={this.tweakTheState}
                  defaultTheme={this.defaultThemeToDispatch}
                  {...props}
                  moduleList={this.state.moduleList}
                />
              )}
            />
          </Switch>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(App));
