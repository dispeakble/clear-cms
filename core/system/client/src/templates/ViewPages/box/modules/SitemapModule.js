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
            });
            await this.setAsyncState({
                usePagination: this.props.moduleOptions.usePagination,
            });
            await this.setAsyncState({
                numberOfLinksPerPage: this.props.moduleOptions.numberOfLinksPerPage,
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
                        <Autocomplete
                            onChange={(event, displayCategory) => displayCategory &&
                                this.setState({
                                    displayType: displayCategory.value
                                })
                            }
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
                                onChange={(event, checked) => {
                                    this.setState({
                                        usePagination: checked,
                                    });
                                }}
                            />
                            Use Pagination
                        </Typography>
                        <Typography>
                            <Typography>Number of Link Per Page</Typography>
                            <TextField
                                labelText="Number of link per Page"
                                id="numberOfLinksPerPage"
                                onChange={(e) => this.setState({
                                    numberOfLinksPerPage: e.target.value
                                })}
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
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="primary"
                            onClick={() => {
                                this.props.handleSave(this.state.itemModuleEditId, {
                                    displayType: this.state.displayType,
                                    usePagination: this.state.usePagination,
                                    numberOfLinksPerPage: this.state.numberOfLinksPerPage
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
