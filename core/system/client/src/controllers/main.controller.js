import React, {Component, Suspense} from "react";
import {Route} from "react-router-dom";
import NotFound from "templates/ViewNotFound/ViewNotFound";
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";

class MainController extends Component {
    state = {};

    getModuleByLink(currentPath, moduleList) {
        if (currentPath === `/`) {
            return moduleList[0];
        } else {
            const pathObject = currentPath.split("/");
            let module = null;

            moduleList.map((el) => {
                if (el.subitems) {
                    el.subitems.map((item) => {
                        if (item.toLink.replace("/", "") === pathObject[1]) {
                            module = item;
                        }
                        return item;
                    })
                }

                return el;
            });

            return module;
        }
    }

    hasModule(currentPath, moduleList) {

        if (currentPath === `/`) {
            return true;
        } else {
            const pathObject = currentPath.split("/");
            let componentExists = false;

            moduleList.map((el) => {
                if (el.subitems) {
                    el.subitems.map((item) => {
                        if (item.toLink.replace("/", "") === pathObject[1]) {
                            componentExists = true;
                        }
                        return item;
                    })
                }
                return el;
            });
            return componentExists;
        }
    }

    render() {
        const {location} = this.props;

        const currentPath = location.pathname;
        const pathnames = this.props.moduleList;
        this.props.location.pathObject = currentPath.substring(1).split("/");
        let LazyComponent;
        if (this.hasModule(currentPath, pathnames)) {
            const module = this.getModuleByLink(currentPath, pathnames);
            LazyComponent = React.lazy(() =>
                import(`./${module.controller}.controller`).then((component) => component).catch(() => {
                    return {default: NotFound}
                })
            );
        } else {
            LazyComponent = NotFound;
        }
        return (
            <Route
                render={() => (
                    <Suspense
                        fallback={
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    background: "none",
                                }}
                            >
                                <ClipLoader
                                    size={50}
                                    color={"#123abc"}
                                    loading={true}
                                    style={{background: "none"}}
                                />
                            </div>
                        }
                    >
                        <LazyComponent
                            {...this.props}
                            hist={this.props.history}
                        />
                    </Suspense>
                )}
            />
        );
    }
}

export default MainController;

MainController.propTypes = {
    moduleList: PropTypes.array,
    services: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
};