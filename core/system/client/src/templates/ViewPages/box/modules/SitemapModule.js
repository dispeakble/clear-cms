import React, {Component} from "react";

// for the modal

import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import {Checkbox, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

class SitemapModule extends Component {
    state = {
        displayOptions: [{
            label: "Display as Complete List",
            value: "displayAsCompleteList"
        }, {
            label: "Display as Categories and Pages",
            value: "displayAsCategoriesAndPages"
        }],
        displayType: "displayAsCompleteList",
        usePagination: false,
        numberOfLinksPerPage: 5,
        modalTitle: "Sitemap content",
    };



    componentDidMount() {
        console.log('from sitemap module', this.props);
        const {displayOptions, displayType, usePagination, numberOfLinksPerPage, modalTitle} = this.props.moduleOptions;
        this.setState({
            displayOptions: displayOptions ?? this.state.displayOptions,
            displayType: displayType ?? this.state.displayType,
            usePagination,
            numberOfLinksPerPage: numberOfLinksPerPage ?? 1,
            modalTitle: modalTitle ?? "Sitemap content",
        });
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


    handleUpdate(params) {
        const payload = Object.assign({}, {
            displayOptions: this.state.displayOptions,
            displayType: this.state.displayType,
            usePagination: this.state.usePagination,
            numberOfLinksPerPage: this.state.numberOfLinksPerPage,
            modalTitle: this.state.modalTitle,

        }, params);

        this.props.onUpdate(payload);

        this.setState(params);
    }

    render() {
        // const classes = this.props.classes;

        return (
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <Autocomplete
                    onChange={ (event, displayCategory) => {
                        if (displayCategory) {
                            this.handleUpdate({
                                displayType: displayCategory.value
                            })

                        }
                    }}
                    className={this.props.classes.option}
                    value={
                        this.state.displayOptions.find(option => option.value === this.state.displayType)
                    }
                    options={this.state.displayOptions}
                    autoHighlight
                    getOptionLabel={(option) => option && option.hasOwnProperty('label') ? option.label : ""}
                    renderInput={(params) => (
                        <TextField
                            className={this.props.classes.textfield}
                            {...params}
                            label="Select a Display Option"
                            variant="outlined"
                        />
                    )}
                />
                <Typography>
                    <Checkbox
                        checked={this.state.usePagination}
                        onChange={async (event, checked) => {
                            this.handleUpdate({
                                usePagination: checked,
                            })

                        }}
                    />
                    Use Pagination
                </Typography>
                <Typography>
                    <Typography>Number of Link Per Page</Typography>
                    <TextField
                        labelText="Number of link per Page"
                        id="numberOfLinksPerPage"
                        onChange={async (e) => {
                            this.handleUpdate({
                                numberOfLinksPerPage: e.target.value

                            })

                        }}
                        disabled={!this.state.usePagination}
                        InputProps={{
                            inputProps: {
                                value: this.state.numberOfLinksPerPage,
                                type: "number",
                                min: 5,
                                max: 20,
                            }
                        }}
                    />
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(SitemapModule);
