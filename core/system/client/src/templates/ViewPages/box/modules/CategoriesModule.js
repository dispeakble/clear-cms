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
        categoriesPerPage: "4",
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
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="primary"
                            onClick={() => {
                                this.props.handleSave(this.state.itemModuleEditId, {
                                    displayType: this.state.displayType,
                                    categoriesPerPage: this.state.categoriesPerPage
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

export default withStyles(styles)(CategoriesModule);
