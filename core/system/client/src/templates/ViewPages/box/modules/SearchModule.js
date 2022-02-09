import React, {Component} from "react";

import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";
import {FormControlLabel} from "@material-ui/core";

class SitemapModule extends Component {
    state = {
        title: false,
        description: false,
        showSuggestions: false,
        showStartDate: false,
        showEndDate: false
    };

    componentDidMount() {
        if (this.props.moduleOptions) {
            const {title, description, showSuggestions, showStartDate, showEndDate} = this.props.moduleOptions;
            this.setState({
                title,
                description,
                showSuggestions,
                showStartDate,
                showEndDate,
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
        this.setState({showModuleOptionsModal: false});
    }

    handleEdit = async (id) => {
        if (this.props.moduleOptions) {
            await this.setAsyncState({
                title: this.props.moduleOptions.title,
                description: this.props.moduleOptions.description,
                showSuggestions: this.props.moduleOptions.showSuggestions,
                showStartDate: this.props.moduleOptions.showStartDate,
                showEndDate: this.props.moduleOptions.showEndDate
            });
        }
        await this.setAsyncState({
            boxModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };

    render() {
        return (
            <div style={{
                width: '100%',
                display: 'flex'
            }}>
                <div style={{flex: 1}}>
                    <div>
                        <div>
                            <Typography variant={"caption"} gutterBottom>Search in the title of pages and products</Typography>
                        </div>
                        <FormControlLabel
                            control={<Switch
                                value={this.state.title}
                                checked={this.state.title}
                                onChange={async () => {
                                    await this.setAsyncState({
                                        title: !this.state
                                            .title,
                                    });
                                    this.props.onUpdate(this.state);
                                }}
                            />}
                            label="Title search"/>
                    </div>
                    <div>
                        <div style={{marginTop: 24}}>
                            <Typography variant={"caption"} gutterBottom>Search in the description of pages and products</Typography>
                        </div>
                        <FormControlLabel
                            control={<Switch
                                value={this.state.description}
                                checked={this.state.description}
                                onChange={async () => {
                                    await this.setAsyncState({
                                        description: !this.state
                                            .description,
                                    });
                                    this.props.onUpdate(this.state);
                                }}
                            />}
                            label="Description search"/>
                    </div>
                    <div>
                        <div style={{marginTop: 24}}>
                            <Typography variant={"caption"} gutterBottom>Show a list of suggestions which can be clicked</Typography>
                        </div>
                        <FormControlLabel
                            control={<Switch
                                value={this.state.showSuggestions}
                                checked={this.state.showSuggestions}
                                onChange={async () => {
                                    await this.setAsyncState({
                                        showSuggestions: !this.state
                                            .showSuggestions,
                                    });
                                    this.props.onUpdate(this.state);
                                }}
                            />}
                            label="Show suggestions"/>
                    </div>

                </div>
                <div style={{flex: 1}}>
                    <div>
                        <div>
                            <Typography variant={"caption"} gutterBottom>Allow the user to select a start date</Typography>
                        </div>
                        <FormControlLabel
                            control={<Switch
                                value={this.state.showStartDate}
                                checked={this.state.showStartDate}
                                onChange={async () => {
                                    await this.setAsyncState({
                                        showStartDate: !this.state
                                            .showStartDate,
                                    });
                                    this.props.onUpdate(this.state);
                                }}
                            />}
                            label="Show Start Date"/>
                    </div>
                    <div>
                        <div style={{marginTop: 24}}>
                            <Typography variant={"caption"} gutterBottom>Allow the user to select a end date</Typography>
                        </div>
                        <FormControlLabel
                            control={<Switch
                                value={this.state.showEndDate}
                                checked={this.state.showEndDate}
                                onChange={async () => {
                                    await this.setState({
                                        showEndDate: !this.state
                                            .showEndDate,
                                    });
                                    this.props.onUpdate(this.state);
                                }}
                            />}
                            label="Show End Date"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SitemapModule);

SitemapModule.propTypes = {
    onUpdate: PropTypes.func,
    boxId: PropTypes.number,
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    pageOptions: PropTypes.object,
    defaultTheme: PropTypes.object
};