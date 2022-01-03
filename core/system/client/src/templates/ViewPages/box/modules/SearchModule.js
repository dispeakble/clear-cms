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

    handleUpdate(params) {
        const payload = Object.assign({}, {
            title: this.state.title,
            description: this.state.description,
            showSuggestions: this.state.showSuggestions,
            showStartDate: this.state.showStartDate,
            showEndDate: this.state.showEndDate,

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

                <div>
                    <Typography>Title</Typography>
                    <Tooltip title="Enable Title">
                        <Switch
                            value={this.state.title}
                            checked={this.state.title}
                            onChange={ () => {
                                this.handleUpdate({
                                    title: !this.state
                                        .title,

                                })

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
                            onChange={ () => {
                                this.handleUpdate({
                                    description: !this.state
                                        .description,

                                })

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
                                this.handleUpdate({
                                    showSuggestions: !this.state
                                        .showSuggestions,

                                })

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
                            onChange={ () => {
                                this.handleUpdate({
                                    showStartDate: !this.state
                                        .showStartDate,
                                })

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
                            onChange={ () => {
                                this.handleUpdate({
                                    showEndDate: !this.state
                                        .showEndDate,

                                })

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