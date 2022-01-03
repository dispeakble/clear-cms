import React, {Suspense} from "react";
import {createTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import CustomInput from "../../../components/CustomInput/CustomInput";

class ViewBoxGeneral extends React.PureComponent {

    state = {
        title: "",
        selectedModule: -1,
        theme: {},
        modulesList: [//TODO GET THESE VALUES FROM A LIST IN DB
            {label: "Header Module"},
            {label: "Table Module"},
            {label: "Text Module"},
            {label: "Menu Module"},
            {label: "Categories Module"},
            {label: "Product Module"},
            {label: "Pagelist Module"},
            {label: "Gallery Module"},
            {label: "Calendar Module"},
            {label: "Video Module"},
            {label: "Audio Module"},
            {label: "Banner Module"},
            {label: "Chart Module"},
            {label: "Accordion Module"},
            {label: "Sitemap Module"},
            {label: "Search Module"},
            {label: 'Card Module'}
        ]
    }

    item = this.props.item;

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        this.item = this.props.item;

        await this.setAsyncState({
            selectedModule: this.getModuleIndex(this.props.item.module)
        });

        this.item.title = this.props.item.title;

        this.setState({
            theme: createTheme({
                palette: this.props.defaultTheme,
                overrides: {
                    MuiAccordionDetails: {
                        root: {
                            display: "initial"
                        }
                    }
                }
            })
        });

    }

    getModuleIndex(name) {
        return this.state.modulesList.findIndex((mod) => {
            return mod.label === name;
        });
    }

    async handleModuleSelection (event, newValue) {
        if (!newValue || !newValue.label) {
            await this.setAsyncState({
                selectedModule: -1
            });
            return;
        }

        let moduleName = newValue ? newValue.label : "";
        this.item.module = moduleName;
        this.item.moduleOptions = {};

        if(moduleName.length) {
            await this.setAsyncState({
                selectedModule: this.getModuleIndex(moduleName)
            });
        }

        this.props.onUpdate(this.item);

    }

    handleTitleUpdate(event) {
        this.item.title = event.target.value;
        this.props.onUpdate(this.item);
    }

    handleModuleUpdate(moduleOptions) {
        this.item.moduleOptions = moduleOptions;
        this.props.onUpdate(this.item);
    }

    render() {
        const item = this.item;
        if(!item) {
            return "";
        }
        let LazyModule = false;
        let module = false;

        const loadingFallback = (() => {
            return <span>Loading...</span>;
        })();

        if(this.state.selectedModule > -1) {
            module = this.state.modulesList[this.state.selectedModule];
            let moduleType = module.label.replaceAll(" ", "");

            if (module) {
                LazyModule = React.lazy(() => import(`./modules/${moduleType}`));
            }
        }

        return (
            <MuiThemeProvider theme={this.state.theme}>
                <div style={{
                    display: 'grid',
                    columnGap: '10px',
                    gridTemplateColumns: 'repeat(2, 1fr [col-start])'
                }}>
                    <div>
                        <CustomInput
                            labelText="Title"
                            id="itemTitle"
                            required="required"
                            formControlProps={{
                                fullWidth: true,
                                onChange: (event) => this.handleTitleUpdate(event),
                            }}
                            inputProps={{
                                autoFocus: true,
                                defaultValue: this.item.title,
                                type: "text",
                            }}
                        />
                    </div>
                    <div>
                        <Autocomplete
                            onChange={(event, newValue) => this.handleModuleSelection(event, newValue)}
                            className={this.props.classes.option}
                            value={this.state.modulesList[this.state.selectedModule] || null}
                            options={this.state.modulesList}
                            getOptionLabel={(option) => option && option.hasOwnProperty('label') ? option.label : ""}
                            renderInput={(params) => (
                                <TextField
                                    className={this.props.classes.textfield}
                                    {...params}
                                    label="Select a module"
                                    variant="outlined"
                                />
                            )}
                        />
                    </div>
                </div>
                <div>
                    {module && LazyModule && (
                        <Suspense fallback={loadingFallback}>
                            <LazyModule
                                control={this.props.control}
                                defaultTheme={this.props.defaultTheme}
                                onUpdate={(moduleOptions) => this.handleModuleUpdate(moduleOptions)}
                                onStartEditingModule={() => this.onStartEditingModule()}
                                onEndEditingModule={() => this.onEndEditingModule()}
                                boxId={item.id || 0}
                                moduleOptions={this.item.moduleOptions}
                                pageId={this.props.page_id}
                                onSave={(data) => {
                                    this.item.moduleOptions = data;
                                }}
                            />
                        </Suspense>
                    )}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(withStyles(styles)(ViewBoxGeneral));

ViewBoxGeneral.propTypes = {
    page_id: PropTypes.number,
    item: PropTypes.object,
    classes: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    control: PropTypes.object,
    showModal: PropTypes.bool,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    defaultTheme: PropTypes.object
};