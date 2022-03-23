import React, {Component} from "react";
import {withRouter, Route, Switch} from "react-router-dom";
import {Scrollbars} from 'react-custom-scrollbars';
//Wrappers
import Header from "components/Header/Header.js";
import SideMenuLinks from "components/Header/SideMenuLinks.js";

import {withStyles, createTheme} from "@material-ui/core/styles";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/global.js";
import CssBaseline from "@material-ui/core/CssBaseline";

import {Helmet} from "react-helmet";

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
import PropTypes from "prop-types";

class App extends Component {
    header = null
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
                ],
            },
            {
                id: 2,
                name: "Tourism Agency",
                icon: "apps",
                subitems: [

                ],
            },
            {
                id: 4,
                name: "Settings",
                icon: "settings",
                subitems: [
                    {
                        toLink: "/general-settings",
                        name: "General Settings",
                        controller: "settings",
                        icon: "settings",
                        active: false,
                    },
                ],
            },
        ],
        excludeHeader: ["pages/preview", "view-auth", "recover-password", "password-reset", "logout", "products/preview"],
        socket: {},
        defaultPalette: {}
    };

    messageCallbacks = {};

    constructor() {
        super();
        this.state.services.ws = new WsService();
        this.state.services.ws.start().then((connected) => {
            if (!connected) {
                console.log('app will redirect to login');
                this.unlisten();
                this.props.history.push("/view-auth");
                return;
            }

            this.state.services.ws.subscribe({
                channel: 'app',
                callbacks: {
                    message: (response) => this.onMessage(response)
                }
            });

            this.unlisten = this.props.history.listen((location) => {
                if (!this.state.services.ws.isConnected && !['/view-auth', '/logout', '/recover-password', "/password-reset"].includes(location.pathname)) {
                    console.log('app will redirect to login')
                    this.props.history.push("/view-auth")
                }
            });


        });

    }

    componentDidMount() {

        this.getTheme();

        let features = {
            pages: false,
            categories: false,
            users: false
        };

        //const forcedFeatures = localStorage.setItem('features', JSON.stringify({pages: true, categories: true, users: true}));

        try {
            const forcedFeatures = JSON.parse(localStorage.getItem('features'));

            if(forcedFeatures) {
                features = Object.assign({}, features, forcedFeatures);
            }

        } catch (err) {

        }

        const moduleList = this.state.moduleList;

        if(features.pages) {
            moduleList[1].subitems.push({
                toLink: "/pages",
                name: "Pages",
                controller: "pages",
                icon: "web",
                active: false
            });
        }

        if(features.categories) {
            moduleList[1].subitems.push({
                toLink: "/categories",
                name: "Categories",
                controller: "categories",
                icon: "category",
                active: false,
            });
        }

        if(features.users) {
            moduleList[1].subitems.push({
                toLink: "/users",
                name: "Users",
                controller: "users",
                icon: "people",
                active: false,
            });
        }

        const navPayload = this.state.moduleList.find((module) => {
            let foundItem = false;
            if (module.subitems && module.subitems.length) {
                module.subitems.forEach(item => {
                    if (this.props.location.pathname.indexOf(item.toLink) > -1) {
                        foundItem = true;
                    }
                });
            } else {
                if (module.toLink && module.toLink.length) {
                    return this.props.location.pathname.indexOf(module.toLink) > -1;
                } else {
                    if (this.props.location.pathname === "/") {
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

        if (currentTheme) {
            this.setState({
                defaultPalette: currentTheme
            });
            return;
        }

        const response = await this.sendMessage({
            module: 'system',
            api: 'adminThemes',
            act: 'get',
            payload: {
                fields: ["data"],
                where: {
                    isDefault: 1
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
                MuiToggleButton: {
                    root: {
                        textTransform: "none !important",
                        lineHeight: "1rem"
                    }
                },
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
                MuiTab: {
                    root: {
                        textTransform: "none !important"
                    }
                },
                MuiButton: {
                    root: {
                        textTransform: "none !important"
                    }
                },
                MuiFormControlLabel: {
                    label: {
                        color: "#000",
                    },
                },
                paperWidthSm: "100%",
                MuiSwitch: {
                    switchBase: {
                        color: "#000000"
                    }
                }, MuiIconButton: {
                    root: {
                        color: "blue"
                    }
                }, MuiSpeedDial: {
                    actionsClosed: {
                        height: "0", overflow: "hidden",
                    }
                }, MuiInputBase: {
                    root: {
                        width: "100%", margin: "0 auto",
                    }
                },
                MuiAutocomplete: {
                    endAdornment: {
                        position: "absolute", top: "calc(50% - 14px)", right: "0px !important",
                    },
                    tag: {
                        height: 'auto',
                        margin: 0
                    },
                },
                MuiInputLabel: {
                    outlined: {
                        transform: 'translate(14px, 11px) scale(1)'
                    }
                },
                MuiChip: {
                    deleteIcon: {
                        margin: 0,
                    }
                },
                MuiOutlinedInput: {
                    root: {
                        "&&& $input": {
                            padding: "0"
                        }
                    }
                },
            }
        });
    };

    handleDrawerToggleToMenu = () => {
        this.header.handleParentStateChange()
    }

    onNavigate(params) {
        this.setState({
            currentModule: params.cat
        })
    }

    render() {
        const {pathname} = this.props.location;
        const locationPath = pathname.substring(1);
        return (
            <React.Fragment>
                <Helmet>
                    <title>App</title>
                </Helmet>
                <MuiThemeProvider theme={this.createTheme()}>
                    <CssBaseline/>
                    {!this.state.excludeHeader.find((path) => {
                        return !(locationPath.indexOf(path) === -1)
                    }) && <Header
                        history={this.props.history}
                        onRef={ref => (this.header = ref)}
                        services={this.state.services}
                        color="transparent"
                        brand="Clear CRM"
                        leftLinks={
                            <SideMenuLinks
                                currentModule={this.state.currentModule}
                                closeDrawer={() => this.handleDrawerToggleToMenu()}
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
                                    <AuthController {...props} services={this.state.services}/>
                                );
                            }}
                        />
                        <Route
                            path="/logout"
                            render={(props) => {
                                return (
                                    <AuthController {...props} services={this.state.services}/>
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
                        <Route
                            path="/password-reset"
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
                                return (
                                    <Scrollbars style={{
                                        height: '100%'
                                    }}>
                                        <MainController
                                            {...props}
                                            defaultTheme={this.state.defaultPalette}
                                            services={this.state.services}
                                            moduleList={this.state.moduleList}
                                        />
                                    </Scrollbars>

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

App.propTypes = {
    classes: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
}
