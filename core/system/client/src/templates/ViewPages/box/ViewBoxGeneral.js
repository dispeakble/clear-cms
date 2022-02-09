import React, {Suspense} from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import PropTypes from "prop-types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import CustomInput from "../../../components/CustomInput/CustomInput";
import Typography from "@material-ui/core/Typography";
import ClipLoader from "react-spinners/ClipLoader";

class ViewBoxGeneral extends React.PureComponent {

    state = {
        title: this.props.box.title,
        selectedModule: -1,
        modulesList: [//TODO GET THESE VALUES FROM A LIST IN DB
            {label: "Accordion Module"},
            {label: "Audio Module"},
            {label: "Banner Module"},
            {label: "Calendar Module"},
            {label: "Categories Module"},
            {label: "Chart Module"},
            {label: "Gallery Module"},
            {label: "Header Module"},
            {label: "Menu Module"},
            {label: "Pagelist Module"},
            {label: "Product Module"},
            {label: "Search Module"},
            {label: "Sitemap Module"},
            {label: "Table Module"},
            {label: "Text Module"},
            {label: "Video Module"}
        ]
    }

    box = this.props.box;

    componentDidMount() {
        this.box = this.props.box;
        this.setState({
            selectedModule: this.getModuleIndex(this.props.box.module)
        });
    }

    onUpdate = (data) => {
        this.setState(data);
        this.props.onUpdate(data);
    };

    getModuleIndex(name) {
        return this.state.modulesList.findIndex((mod) => {
            return mod.label === name;
        });
    }

    handleModuleSelection (event, newValue) {
        if (!newValue || !newValue.label) {
            this.setState({
                selectedModule: -1
            });
            return;
        }

        let moduleName = newValue ? newValue.label : "";
        this.box.module = moduleName;
        this.box.moduleOptions = {};

        if(moduleName.length) {
            this.setState({
                selectedModule: this.getModuleIndex(moduleName)
            });
        }

        this.props.onUpdate(this.box);
    }

    handleModuleUpdate(moduleOptions) {
        this.box.moduleOptions = moduleOptions;
        this.props.onUpdate(this.box);
    }

    render() {
        const box = this.box;
        if(!box) {
            return "";
        }
        let LazyModule = false;
        let module = false;

        const loadingFallback = (() => {
            return <ClipLoader
                size={50}
                color={"#123abc"}
                loading={true}
                style={{ background: "none" }}
            />;
        })();

        if(this.state.selectedModule > -1) {
            module = this.state.modulesList[this.state.selectedModule];
            let moduleType = module.label.replaceAll(" ", "");

            if (module) {
                LazyModule = React.lazy(() => import(`./modules/${moduleType}`));
            }
        }

        return (
            <React.Fragment>
                <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                    <div style={{
                        display: 'grid',
                        columnGap: '10px',
                        gridTemplateColumns: 'repeat(2, 1fr [col-start])'
                    }}>
                        <div>
                            <CustomInput
                                labelText="Title"
                                id="boxTitle"
                                required="required"
                                formControlProps={{
                                    fullWidth: true,
                                    onChange: (event) => {
                                        this.onUpdate({
                                            title: event.target.value
                                        });
                                    },
                                }}
                                inputProps={{
                                    autoFocus: true,
                                    defaultValue: this.state.title,
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
                    {(module && LazyModule) ? (
                        <div style={{flex: 1}}>
                            <Suspense fallback={loadingFallback}>
                                <LazyModule
                                    control={this.props.control}
                                    defaultTheme={this.props.defaultTheme}
                                    onUpdate={(moduleOptions) => this.handleModuleUpdate(moduleOptions)}
                                    onStartEditingModule={() => this.onStartEditingModule()}
                                    onEndEditingModule={() => this.onEndEditingModule()}
                                    boxId={box.id || 0}
                                    moduleOptions={this.box.moduleOptions}
                                    box={this.box}
                                    layoutBoxSpacing={this.props.layoutBoxSpacing}
                                    pageId={this.props.pageId}
                                    onSave={(data) => {
                                        this.box.moduleOptions = data;
                                    }}
                                    services={this.props.services}
                                />
                            </Suspense>
                        </div>
                    ) : <div style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <Typography variant={"h4"}> Please select a module </Typography>
                    </div>}
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ViewBoxGeneral);

ViewBoxGeneral.propTypes = {
    pageId: PropTypes.number,
    box: PropTypes.object,
    layoutBoxSpacing: PropTypes.number,
    classes: PropTypes.object,
    control: PropTypes.object,
    showModal: PropTypes.bool,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    defaultTheme: PropTypes.object,
    services: PropTypes.object
};