import React, { Component } from "react";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";

class CategoriesModule extends Component {
    state = {
        showImageAsOptions: [{
            label: "Background",
            value: "background"
        }, {
            label: "Thumbnail",
            value: "thumbnail"
        }],
        displayType: "background",
        categoriesPerPage: "4"
    };

     componentDidMount() {



        if (this.props.moduleOptions) {
            let {moduleOptions} = this.props;
            this.setState({
                showImageAsOptions: moduleOptions.showImageAsOptions,
                displayType: moduleOptions.displayType,
                categoriesPerPage: moduleOptions.categoriesPerPage,
             });
        }
    }
    getTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiDialogTitle: {
                    root: {
                        padding: "16px 24px 0",
                    },
                },
            },
        });
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    closeModuleOptionsModal() {

        this.setState({ showModuleOptionsModal: false });
    }

    handleEdit = async (id) => {
        if (this.props.moduleOptions) {
            this.handleUpdate({
                displayType: this.props.moduleOptions.displayType,
                categoriesPerPage: this.props.moduleOptions.categoriesPerPage,
            })

        }
        this.handleUpdate({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        })

    };



    handleUpdate(params) {
        const payload = Object.assign({}, {
            showImageAsOptions: this.state.showImageAsOptions,
            displayType: this.state.displayType,
            categoriesPerPage: this.state.categoriesPerPage,

        }, params);

        this.props.onUpdate(payload);

        this.setState(params);
    }
    render() {
        return (
            <div
                style={{
                    textAlign: "center",
                }}
            >


                <Autocomplete
                    onChange={ (event, displayCategory) => {
                        if(displayCategory){
                            this.handleUpdate({
                                displayType: displayCategory.value
                            })



                        }
                    }
                    }
                    className={this.props.classes.option}
                    value={
                        this.state.showImageAsOptions?.find(option => option.value === this.state.displayType)
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
                <Autocomplete
                    onChange={ (event, categoriesPerPage) => {
                        if(categoriesPerPage) {
                            this.handleUpdate({
                                categoriesPerPage: categoriesPerPage
                            })

                        }
                    }}
                    onInputChange={(event, value) =>{
                        this.handleUpdate({
                            categoriesPerPage: value
                        })

                    }
                    }
                    className={this.props.classes.option}
                    value={this.state.categoriesPerPage}
                    options={[...Array(10)].map((_, index) => (index + 1).toString())}
                    freeSolo={true}
                    autoHighlight
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
        );
    }
}

export default withStyles(styles)(CategoriesModule);
CategoriesModule.propTypes = {

    moduleOptions: PropTypes.object,

    onUpdate: PropTypes.func,

};