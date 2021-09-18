import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";

//Wrappers
import Header from "components/Header/Header.js";
import SideMenuLinks from "components/Header/SideMenuLinks.js";

import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/global.js";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Helmet } from "react-helmet";

//contollers
import MainController from "controllers/main.controller";

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
    currentModule: {},
    moduleList: [
      {
        id: 0,
        name: "Dashboard",
        controller: "dashboard",
        icon: "dashboard",
        show: false,
        toLink: "",
        exact: true,
        active: false
      },
      {
        id: 1,
        name: "All Modules",
        icon: "apps",
        subitems: [
          {
            //TODO get this from hub module list
            toLink: "/pages",
            name: "Pages",
            controller: "pages",
            icon: "web",
            active: false
          },
          {
            toLink: "/categories",
            name: "Categories",
            controller: "categories",
            icon: "category",
            active: false,
          },
          {
            toLink: "/themes",
            name: "Themes",
            controller: "themes",
            icon: "brush",
            active: false,
          },
          {
            toLink: "/bucket",
            icon: "publish",
            controller: "bucket",
            name: "Bucket",
            active: false,
          },
          {
            toLink: "/users",
            name: "Users",
            controller: "users",
            icon: "people",
            active: false,
          }
        ],
      },
      {
        id: 2,
        name: "E-Commerce",
        icon: "apps",
        subitems: [
          {
            toLink: "/products",
            name: "Products",
            controller: "products",
            icon: "web",
            active: false
          },
          {
            toLink: "/images",
            name: "Images",
            controller: "images",
            icon: "image",
            active: false,
          },
          {
            toLink: "/labels",
            name: "Labels",
            controller: "labels",
            icon: "subject",
            active: false,
          },
          {
            toLink: "/prices",
            icon: "monetization_on",
            controller: "prices",
            name: "Prices",
            active: false,
          },
          {
            toLink: "/availability",
            name: "Availability",
            controller: "availability",
            icon: "shopping_cart",
            active: false,
          },
          {
            toLink: "/locality",
            name: "Locality",
            controller: "locality",
            icon: "location_on",
            active: false,
          }
        ],
      },
      {
        id: 3,
        name: "Settings",
        icon: "settings",
        subitems: [
          {
            //TODO get this from hub module list
            toLink: "/general-settings",
            name: "General Settings",
            controller: "settings",
            icon: "settings",
            active: false,
          },
        ],
      },
    ],
    excludeHeader: ["pages/preview", "view-auth", "recover-password", "logout", "products/preview"],
    socket: {},
    mobileOpen: false,
    defaultPalette: {}
  };

  messageCallbacks = {};

  constructor() {
    super();
    this.state.services.ws = new WsService();
    this.state.services.ws.start().then((connected) => {
      if(!connected){
        window.location.href = '/view-auth';
        return;
      }

      this.state.services.ws.subscribe({
        channel: 'app',
        callbacks: {
          message: (response) => this.onMessage(response)
        }
      });

      this.getTheme();

      this.unlisten = this.props.history.listen((location, action) => {
        console.log("on route change");
        if (!this.state.services.ws.isConnected && !['/view-auth', '/logout'].includes(window.location.pathname)) {
          this.props.history.push("/view-auth")
        }
      });


    });

  }

  componentDidMount() {

    const navPayload = this.state.moduleList.find((module) => {
      let foundItem = false;
      if(module.subitems && module.subitems.length) {
        module.subitems.forEach(item => {
          if(window.location.href.indexOf(item.toLink) > -1) {
            foundItem = true;
          }
        });
      } else {
        if(module.toLink && module.toLink.length) {
          return window.location.href.indexOf(module.toLink) > -1;
        } else {
          if (window.location.href === "/") {
            return true;
          }
        }
      }

      return foundItem
    });

    this.setState({
      currentModule: navPayload
    })

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

    const currentTheme = JSON.parse(localStorage.getItem("adminTheme"));

    if(currentTheme) {
      this.setState({defaultPalette: currentTheme});
      return;
    }

    const response = await this.sendMessage({
      module: 'system',
      api: 'adminThemes',
      act: 'getOne',
      payload: {
        fields: ["data"],
        where: {
          isdefault: 1
        }
      }
    })

    if (response && response.data && response.data.length) {
      this.setState({defaultPalette: JSON.parse(response.data)});
      localStorage.setItem('adminTheme', response.data)
    }
  }

  createTheme = () => {
    return createTheme({
      palette: this.state.defaultPalette,
      overrides: {
        MuiDialog: {
          paper: {
            width: "100%",
          },
          paperWidthSm: {
            maxWidth: "100vw",
          }
        },
        MuiDropzoneArea: {
          root: {
            height: "145px",
            minHeight: "145px",
          },
          text: {
            fontSize: "1rem",
          }
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
        paperWidthSm: "100%"
      }
    });
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  onNavigate(params) {
    this.setState({
      currentModule: params.cat
    })
  }

  render() {
    const { pathname } = this.props.location;
    const locationPath = pathname.substring(1);
    return (
      <React.Fragment>
        <Helmet>
          <title>App</title>
        </Helmet>
        <MuiThemeProvider theme={this.createTheme()}>
          <CssBaseline />
          {!this.state.excludeHeader.find((path) => {
            return !(locationPath.indexOf(path) === -1)
          }) && <Header
              services={this.state.services}
              mobileOpen={this.state.mobileOpen}
              color="transparent"
              brand="Clear CRM"
              handleDrawerToggle={() => this.handleDrawerToggle()}
              leftLinks={
                <SideMenuLinks
                    currentModule={this.state.currentModule}
                    closeDrawer={() => this.handleDrawerToggle()}
                    moduleList={this.state.moduleList}
                    onNavigate={(params) => this.onNavigate(params)}
                />
              }
              fixed
              changeColorOnScroll={{
                height: 10,
                color: "primary",
              }}
          />}
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
            <Route
              render={(props) => {
                props.host = 'http://localhost:9696';
                return (

                <MainController
                  {...props}
                  defaultTheme={this.state.defaultPalette}
                  services={this.state.services}
                  moduleList={this.state.moduleList}
                />
              );
              }}
            />
          </Switch>
        </MuiThemeProvider>
        <AuthGuardService services={{ws: this.state.services.ws}}/>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(App));
