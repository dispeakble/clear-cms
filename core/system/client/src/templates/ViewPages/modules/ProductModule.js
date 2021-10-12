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
import {Checkbox, TextField} from "@material-ui/core";
import {CheckBox, CheckBoxOutlineBlank} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

class ProductModule extends Component {
    state = {
        itemModuleEditId: "",
        showModuleOptionsModal: false,
        modalTitle: "Product Details content",
        displayOptions: [],
        displayOptionsList: [{
            label: "Title",
            value: "title"
        },{
            label: "Description",
            value: "description"
        },{
            label: "Category",
            value: "category"
        },{
            label: "Locality",
            value: "locality"
        },{
            label: "Labels",
            value: "labels"
        },{
            label: "Availability",
            value: "availability"
        },{
            label: "Unavailability",
            value: "unavailability"
        },{
            label: "Prices",
            value: "prices"
        },{
            label: "Gallery",
            value: "gallery"
        }]
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
        if(this.props.isTemplate) {
            this.props.templateConfirmCallback()
            return;
        }
        if (this.props.moduleOptions.data) {
            await this.setAsyncState({
                displayOptions: this.props.moduleOptions.data.displayOptions,
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
                            multiple
                            id="productOptionsDropdown"
                            onChange={async (event, label) => await this.setAsyncState({
                                displayOptions: label,
                            })}
                            disableCloseOnSelect
                            className={this.props.classes.option}
                            value={this.state.displayOptions.length ? this.state.displayOptions : []}
                            options={this.state.displayOptionsList}
                            autoHighlight
                            getOptionLabel={(option) => option.label || ""}
                            renderOption={(props, option) => (
                                <span {...props}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlank fontSize={"small"} />}
                                        checkedIcon={<CheckBox fontSize={"small"} />}
                                        style={{ marginRight: 8 }}
                                        checked={option.selected}
                                    />
                                    {props.label}
                                </span>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    className={this.props.classes.textfield}
                                    label="Select Display Option"
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="primary"
                            onClick={() => {
                                this.props.handleSave(this.state.itemModuleEditId, {
                                    displayOptions: this.state.displayOptions
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

export default withStyles(styles)(ProductModule);
