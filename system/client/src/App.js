import React, {Component} from "react";
import {withRouter, Route, Switch} from "react-router-dom";

//Wrappers
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

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
import WsService from 'services/ws.service';
import { Helmet } from "react-helmet";

class App extends Component {
    state = {
        services:{},
        moduleList: [
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
            },
            {
                toLink: "/blog",
                icon: "book",
                name: "Blog",
            },
            {
                toLink: "/forum",
                icon: "forum",
                name: "Forum",
            },
            {
                toLink: "/video-conference",
                icon: "video_call",
                name: "Video Conference",
            },
            {
                toLink: "/file-transfer",
                icon: "attachment",
                name: "File Transfer",
            },
            {
                toLink: "/photo-gallery",
                icon: "photo_library",
                name: "Photo Gallery",
            },
        ],
        socket:{},
        mobileOpen: false,
    };

    constructor() {
        super();
        this.state.services.ws = new WsService();
        this.state.services.ws.start();
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    render() {
        const {pathname} = this.props.location;
        const excludeHeader=['pagePreview', 'view-auth', 'recover-password'];
        return (
            <React.Fragment>
                <Helmet>
                    <title>App</title>
                </Helmet>
                {excludeHeader.indexOf(pathname.replaceAll('/', '')) === -1 ? (
                    <Header
                        mobileOpen={this.state.mobileOpen}
                        color="transparent"
                        brand="Clear CRM"
                        handleDrawerToggle={() => this.handleDrawerToggle()}
                        leftLinks={
                            <HeaderLinks
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
                    <Route path="/view-auth" render={(props) => {
                        return (<AuthController {...props} services={this.state.services} />)
                    }} />
                    <Route path="/logout" render={(props) => {
                        return (<AuthController {...props} services={this.state.services} />)
                    }} />
                    <Route path="/recover-password" render={(props) => {
                        return (<AuthController {...props} services={this.state.services} />)
                    }} />
                    <Route path="/profile-page" component={ProfilePage}/>
                    <Route path="/" exact component={Dashboard}/>
                    <Route path="/pagesAdd" component={PagesAdd}/>
                    <Route path="/pagePreview/:id" component={PagePreview}/>
                    <Route path="/pageEdit/:id" component={PagesAdd}/>
                    <Route
                        render={(props) => (
                            <MainAppController
                                {...props}
                                moduleList={this.state.moduleList}
                            />
                        )}
                    />
                </Switch>

            </React.Fragment>
        );
    }
}

export default withRouter(App);
