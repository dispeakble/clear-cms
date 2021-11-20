import React, { Component } from "react";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
            await this.setAsyncState({
                displayType: this.props.moduleOptions.displayType,
                categoriesPerPage: this.props.moduleOptions.categoriesPerPage,
            });
        }
        await this.setAsyncState({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };

    render() {
        const classes = this.props.classes;

        return (
            <div
                style={{
                    textAlign: "center",
                }}
            >


                <Autocomplete
                    onChange={(event, displayCategory) => displayCategory &&
                        this.setState({
                            displayType: displayCategory.value
                        })
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
                <Autocomplete
                    onChange={(event, categoriesPerPage) => categoriesPerPage &&
                        this.setState({
                            categoriesPerPage: categoriesPerPage
                        })
                    }
                    onInputChange={(event, value) =>{
                        this.setState({
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
