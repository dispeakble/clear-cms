import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";

class SitemapModule extends Component {
    state = {
        title: false,
        description: false,
        showSuggestions: false,
        showStartDate: false,
        showEndDate: false
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
        if (this.props.moduleOptions.data) {
            await this.setAsyncState({
                title: this.props.moduleOptions.data.title,
                description: this.props.moduleOptions.data.description,
                showSuggestions: this.props.moduleOptions.data.showSuggestions,
                showStartDate: this.props.moduleOptions.data.showStartDate,
                showEndDate: this.props.moduleOptions.data.showEndDate
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
                <IconButton
                    onClick={() => this.handleEdit(this.props.boxId)}
                    color="primary"
                    size="medium"
                >
                    <ArtTrack />
                </IconButton>

                <Dialog
                    onBackdropClick={() => "false"}
                    classes={{
                        root: classes.center,
                        paper: classes.modal,
                    }}
                    open={this.state.showModuleOptionsModal}
                    TransitionComponent={this.transition}
                    keepMounted
                    onClose={() => this.closeModuleOptionsModal()}
                    aria-labelledby="classic-modal-slide-title"
                    aria-describedby="classic-modal-slide-description"
                >
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}
                    >
                        <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
                    </DialogTitle>
                    <DialogContent
                        id="classic-modal-slide-description"
                        className={classes.modalBody}
                    >
                        <div>
                            <Typography>Title</Typography>
                            <Tooltip title="Enable Title">
                                <Switch
                                    value={this.state.title}
                                    checked={this.state.title}
                                    onChange={() => {
                                        this.setState({
                                            title: !this.state
                                                .title,
                                        });
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
                                    onChange={() => {
                                        this.setState({
                                            description: !this.state
                                                .description,
                                        });
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
                                    onChange={() => {
                                        this.setState({
                                            showSuggestions: !this.state
                                                .showSuggestions,
                                        });
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
                                    onChange={() => {
                                        this.setState({
                                            showStartDate: !this.state
                                                .showStartDate,
                                        });
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
                                    onChange={() => {
                                        this.setState({
                                            showEndDate: !this.state
                                                .showEndDate,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="primary"
                            onClick={() => {
                                this.props.handleSave(this.state.itemModuleEditId, {
                                    title: this.state.title,
                                    description: this.state.description,
                                    showSuggestions: this.state.showSuggestions,
                                    showStartDate: this.state.showStartDate,
                                    showEndDate: this.state.showEndDate
                                });
                                this.closeModuleOptionsModal();
                            }}
                        >
                            <div>Save</div>
                        </Button>
                        <Button
                            color="danger"
                            onClick={async () => {
                                this.closeModuleOptionsModal();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(SitemapModule);
