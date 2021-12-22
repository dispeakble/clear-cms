import React, {Component} from "react";

import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";

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
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };

    render() {
        return (
            <div
                style={{
                    textAlign: "center",
                }}
            >

                <div>
                    <Typography>Title</Typography>
                    <Tooltip title="Enable Title">
                        <Switch
                            value={this.state.title}
                            checked={this.state.title}
                            onChange={async () => {
                                await this.setAsyncState({
                                    title: !this.state
                                        .title,
                                });
                                this.props.onUpdate(this.state);
                            }}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Typography>Description</Typography>
                    <Tooltip title="Enable Description">
                        <Switch
                            value={this.state.description}
                            checked={this.state.description}
                            onChange={async () => {
                                await this.setAsyncState({
                                    description: !this.state
                                        .description,
                                });
                                this.props.onUpdate(this.state);
                            }}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Typography>Show Suggestions</Typography>
                    <Tooltip title="Enable Suggestions">
                        <Switch
                            value={this.state.showSuggestions}
                            checked={this.state.showSuggestions}
                            onChange={async () => {
                                await this.setAsyncState({
                                    showSuggestions: !this.state
                                        .showSuggestions,
                                });
                                this.props.onUpdate(this.state);
                            }}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Typography>Show Start Date</Typography>
                    <Tooltip title="Show Start Date">
                        <Switch
                            value={this.state.showStartDate}
                            checked={this.state.showStartDate}
                            onChange={async () => {
                                await this.setAsyncState({
                                    showStartDate: !this.state
                                        .showStartDate,
                                });
                                this.props.onUpdate(this.state);
                            }}
                        />
                    </Tooltip>
                </div>
                <div>
                    <Typography>Show End Date</Typography>
                    <Tooltip title="Show End Date">
                        <Switch
                            value={this.state.showEndDate}
                            checked={this.state.showEndDate}
                            onChange={async () => {
                                await this.setState({
                                    showEndDate: !this.state
                                        .showEndDate,
                                });
                                this.props.onUpdate(this.state);
                            }}
                        />
                    </Tooltip>
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