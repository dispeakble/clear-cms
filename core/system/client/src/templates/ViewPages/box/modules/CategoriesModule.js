import React, {Component, Suspense} from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import {pick} from "lodash";

class CategoriesModule extends Component {

    constructor(props) {
        super(props);

        let {moduleOptions} = this.props;
        moduleOptions.displayType = moduleOptions.displayType || "card";
        moduleOptions.categoriesPerPage = Number(moduleOptions.categoriesPerPage) || 10;
        this.setState({
            displayType: moduleOptions.displayType,
            categoriesPerPage: moduleOptions.categoriesPerPage
        });

        this.state.displayType = moduleOptions.displayType;
        this.state.categoriesPerPage = moduleOptions.categoriesPerPage;
    }

    state = {
        showImageAsOptions: [{
            label: "Card",
            value: "card"
        }, {
            label: "List",
            value: "list"
        }],
        displayType: "card",
        categoriesPerPage: 10
    };

    paginationOptions = [...Array(10)].map((n, index) => (index+1));

    componentDidMount() {

    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

    onUpdate(params) {

        const keys = ["displayType", "categoriesPerPage"];

        this.props.onUpdate({...pick(this.state, keys), ...params})
        this.setState(params)
    }

    render() {

        const loadingFallback = (() => {
            return <span>Loading...</span>;
        })();

        const LazyModule = React.lazy(() => import(`../previews/CategoriesModule`));

        return (
            <div>
                <div style={{display: "flex"}}>
                    <div style={{
                        flex: 1,
                        marginBottom: "24px",
                        marginRight: "12px"
                    }}>
                        <div>
                            <Typography variant={"caption"} display={"block"} gutterBottom>Select the way to display the
                                category image</Typography>
                        </div>
                        <div style={{marginTop: "1rem"}}>
                            <Autocomplete
                                onChange={async (event, displayCategory) => {
                                    if (displayCategory) {

                                        this.onUpdate({
                                            displayType: displayCategory.value
                                        });
                                    }
                                }
                                }
                                className={this.props.classes.option}
                                value={
                                    this.state.showImageAsOptions.find(option => option.value === this.state.displayType)
                                }
                                options={this.state.showImageAsOptions}
                                autoHighlight
                                getOptionLabel={(option) => option && option.hasOwnProperty('label') ? option.label : ""}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        label="Show Image as"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        marginBottom: "24px",
                        marginLeft: "12px"
                    }}>
                        <div>
                            <Typography variant={"caption"} display={"block"} gutterBottom>Type in the number of
                                categories to be displayed on a page</Typography>
                        </div>
                        <div style={{marginTop: "1rem"}}>
                            <Autocomplete
                                onInputChange={(event, value) => {
                                    this.onUpdate({
                                        categoriesPerPage: Number(value)
                                    })
                                }
                                }
                                className={this.props.classes.option}
                                value={this.state.categoriesPerPage}
                                options={this.paginationOptions}
                                getOptionLabel={(option) => option.toString()}
                                freeSolo={true}
                                disableClearable={true}
                                openOnFocus={true}
                                autoHighlight={true}
                                autoSelect={true}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        type={"number"}
                                        label="Categories Per Page"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Suspense fallback={loadingFallback}>
                        <LazyModule
                            key={`box-category-module`}
                            boxId={this.props.boxId}
                            pageId={this.props.pageId}
                            moduleOptions={{
                                categoriesPerPage: this.state.categoriesPerPage,
                                displayType: this.state.displayType
                            }}
                            control={this.props.control}
                            services={this.props.services}
                        />
                    </Suspense>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CategoriesModule);

CategoriesModule.propTypes = {
    classes: PropTypes.object,
    services: PropTypes.object,
    control: PropTypes.object,
    moduleOptions: PropTypes.object,
    box: PropTypes.object,
    boxId: PropTypes.number,
    pageId: PropTypes.number,
    onUpdate: PropTypes.func
};
