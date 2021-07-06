import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";

//Wrappers
import Header from "components/Header/Header.js";
import SideMenuLinks from "components/Header/SideMenuLinks.js";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/global.js";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Helmet } from "react-helmet";

//contollers
import MainController from "controllers/main.controller";
import PagesAdd from "views/MainAppController/ExtraComponents/pagesAdd";
import PagePreview from "views/MainAppController/ExtraComponents/pagePreview";

//styles
import "assets/scss/clear-crm.scss";

//Controllers
import AuthController from "controllers/auth.controller";
import AdminProfileController from "./controllers/admin-profile.controller";

//Services
import WsService from "services/ws.service";
import AuthGuardService from "./services/authGuard.service";
import * as shortId from "shortid";

class App extends Component {
  state = {
    services: {},
    moduleList: [
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
            toLink: "/bucket",
            icon: "publish",
            name: "Bucket",
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
        id: 2,
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
    excludeHeader: ["pagePreview", "view-auth", "recover-password", "logout"],
    socket: {},
    mobileOpen: false,
    defaultPalette: {//TODO GET THIS FROM A CONFIG OR GET RID OF THEM AND USE DB INSTEAD
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
    }
  };

  messageCallbacks = {};

  constructor() {
    super();
    this.state.services.ws = new WsService();
    this.state.services.ws.start().then((connected) => {
      if(!connected){
        window.location.href = '/view-auth';
      }
    });
  }

  componentDidMount() {
    this.state.services.ws.subscribe({
      channel: 'app',
      callbacks: {
        message: (response) => this.onMessage(response)
      }
    });

    this.getTheme();

  }

  onMessage(params) {
    try {
      this.messageCallbacks[params.id](params.data);
    } catch (err) {
      console.log(err);
    }
    console.log('got message in app.js', params);
  }

  sendMessage(params) {
    return new Promise((resolve_send) => {
      const uniqueId = shortId.generate();
      this.messageCallbacks[uniqueId] = resolve_send;
      this.state.services.ws.emit({
        id: uniqueId,
        channel: 'app',
        module: params.module,
        api: params.api,
        act: params.act,
        payload: params.payload
      });
    });
  }

  getTheme = async () => {
    const response = await this.sendMessage({
      module: 'system',
      api: 'adminThemes',
      act: 'getOne',
      payload: {
        where: {
          isdefault: 1
        }
      }
    })

    if (response && response.data && response.data.length) {
      this.setState({defaultPalette: JSON.parse(response.data)});
    }
  }

  createTheme = () => {
    return createMuiTheme({
      palette: this.state.defaultPalette,
      overrides: {
        MuiDialog: {
          paper: {
            width: "100%",
          },
          paperWidthSm: {
            maxWidth: "100vw",
          },
        },
        MuiDropzoneArea: {
          root: {
            height: "145px",
            minHeight: "145px",
          },
          text: {
            fontSize: "1rem",
          },
        },
        MuiTab:{
          root:{
            textTransform:"none"
          }
        },
        MuiButton:{
          root:{
            textTransform: "none !important"
          }
        },
        MuiFormControlLabel: {
          label: {
            color: "#000",
          },
        },
        paperWidthSm: "100%",
      },
    });
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
        <MuiThemeProvider theme={this.createTheme()}>
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
                color: "primary",
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
                    <AuthController {...props} services={this.state.services}/>
                );
              }}
            />
            <Route path="/admin-profile"
              render={(props) => {
               return (
                   <AdminProfileController {...props} services={this.state.services}/>
               );
              }}
            />
            <Route path="/pagesAdd" component={PagesAdd} />
            <Route path="/pagePreview/:id" component={PagePreview} />
            <Route path="/pageEdit/:id" component={PagesAdd} />
            <Route
              render={(props) => (
                <MainController
                  {...props}
                  defaultTheme={this.state.defaultPalette}
                  services={this.state.services}
                  moduleList={this.state.moduleList}
                />
              )}
            />
          </Switch>
        </MuiThemeProvider>
        <AuthGuardService services={{ws: this.state.services.ws}}/>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(App));
