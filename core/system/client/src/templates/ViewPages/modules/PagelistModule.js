import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CustomInput from "components/CustomInput/CustomInput.js";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { Editor } from "@tinymce/tinymce-react";
import {Checkbox, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Slider from "@material-ui/core/Slider";
import {SketchPicker} from "react-color";
import reactCSS from "reactcss";

class PagelistModule extends Component {
    state = {
        numberOfPagesToDisplayAtOnce: 5,
        showTitle: false,
        showDescription: false,
        truncateDescription: false,
        showMaxWords: false,
        showThumbnail: false,
        showModifiedDate: false,
        showBorder: false,
        borderWidth: "",
        borderColor: "",
        borderRadius: "",
        showShadow: false,
        shadowColor: "",
        shadowSpread: 5,
        shadowTop: 10,
        shadowLeft: 10,
        padding: 0,
        margin: 0,
        borderColorStyles: {},
        shadowColorStyles: {},
        displayBorderColorPicker: false,
        displayShadowColorPicker: false
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

    async componentDidMount() {
        await this.setAsyncState({borderColorStyles: this.sendStyles(this.state.borderColor),
            shadowColorStyles: this.sendStyles(this.state.shadowColor)});
    }

    closeModuleOptionsModal() {
        this.setState({ showModuleOptionsModal: false });
    }

    handleEdit = async (id) => {
        if (this.props.moduleOptions.data) {
            await this.setAsyncState({
                displayType: this.props.moduleOptions.data.displayType,
            });
            await this.setAsyncState({
                usePagination: this.props.moduleOptions.data.usePagination,
            });
            await this.setAsyncState({
                numberOfLinksPerPage: this.props.moduleOptions.data.numberOfLinksPerPage,
            });
        }
        await this.setAsyncState({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };

    handleInputChange(event) {
        if (event.target) {
            this.setState({
                textContent: event.target.value,
            });
        } else {
            this.setState({
                richTextContent: event,
            });
        }
    }

    sendStyles = (targetedColor) => {
        return reactCSS({
            default: {
                color: {
                    width: "36px",
                    height: "14px",
                    borderRadius: "2px",
                    background: targetedColor,
                },
                swatch: {
                    padding: "5px",
                    background: "#fff",
                    borderRadius: "1px",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    display: "inline-block",
                    cursor: "pointer",
                    height: "26px"
                },
                popover: {
                    position: "absolute",
                    zIndex: "2",
                },
                cover: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                },
            },
        });
    };

    createColorPicker = (styles, displayColorPicker, targetedColor) => {
        if (!this.state[styles]) {
            return;
        }

        let pickerColor = Object.assign({}, this.state[styles].color);

        pickerColor.background = this.state[targetedColor];

        return (
            <React.Fragment>
                <div
                    style={{
                        ...this.state[styles].swatch,
                        verticalAlign: "middle"
                    }}
                    onClick={() => this.handleColorPickerClick(displayColorPicker)}
                >
                    <div style={pickerColor}/>
                </div>
                {this.state[displayColorPicker] ? (
                    <div style={this.state[styles].popover}>
                        <div
                            style={this.state[styles].cover}
                            onClick={() => this.handleColorPickerClose(displayColorPicker)}
                        />
                        <SketchPicker
                            color={this.state[targetedColor]}
                            onChange={(color) => {
                                this.setState({
                                    [targetedColor]: color.hex,
                                });
                            }}
                        />
                    </div>
                ) : null}
            </React.Fragment>
        );
    };

    handleColorPickerClick = (displayColorPicker) => {
        this.setState({ [displayColorPicker]: !this.state.displayColorPicker });
    };

    handleColorPickerClose = (displayColorPicker) => {
        this.setState({ [displayColorPicker]: false });
    };

    handleBorderWidth = async (event, newValue) => {
        await this.setAsyncState({ borderWidth: newValue });
    };

    handleBorderRadius = async (event, newValue) => {
        await this.setAsyncState({ borderRadius: newValue });
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
                        <Typography>
                            <Typography>Number of Pages to Display At Once</Typography>
                            <TextField
                                labelText="Number of Pages to Display At Once"
                                id="numnberOfPagesToDisplayAtOnce"
                                onChange={(e) => this.setState({
                                    numberOfPagesToDisplayAtOnce: e.target.value
                                })}
                                InputProps={{
                                    inputProps: {
                                        value: this.state.numberOfPagesToDisplayAtOnce,
                                        type: "number",
                                        min: 5,
                                        max: 20,
                                    }
                                }}
                            />
                        </Typography>
                        <Typography>
                            Show Title
                            <Tooltip title="Show Title">
                                <Switch
                                    value={this.state.showTitle}
                                    checked={this.state.showTitle}
                                    onChange={() => {
                                        this.setState({
                                            showTitle: !this.state
                                                .showTitle,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </Typography>
                        <Typography>
                            Show Description
                            <Tooltip title="Show Description">
                                <Switch
                                    value={this.state.showDescription}
                                    checked={this.state.showDescription}
                                    onChange={() => {
                                        this.setState({
                                            showDescription: !this.state
                                                .showDescription,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </Typography>
                        <Typography>
                            Truncate Description
                            <Tooltip title="Truncate Description">
                                <Switch
                                    value={this.state.truncateDescription}
                                    checked={this.state.truncateDescription}
                                    onChange={() => {
                                        this.setState({
                                            truncateDescription: !this.state
                                                .truncateDescription,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </Typography>
                        <Typography>
                            Show Thumbnail
                            <Tooltip title="Show Thumbnail">
                                <Switch
                                    value={this.state.showThumbnail}
                                    checked={this.state.showThumbnail}
                                    onChange={() => {
                                        this.setState({
                                            showThumbnail: !this.state
                                                .showThumbnail,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </Typography>
                        <Typography>
                            Show Modified Date
                            <Tooltip title="Show Modified Date">
                                <Switch
                                    value={this.state.showModifiedDate}
                                    checked={this.state.showModifiedDate}
                                    onChange={() => {
                                        this.setState({
                                            showModifiedDate: !this.state
                                                .showModifiedDate,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </Typography>
                        <div>
                            <Typography>
                                <span>Border Color </span>
                            </Typography>
                            {this.createColorPicker(
                                "borderColorStyles",
                                "displayBorderColorPicker",
                                "borderColor"
                            )}

                        </div>
                        <div>
                            <Typography><span>Border Width</span></Typography>
                            <Slider
                                value={this.state.borderWidth}
                                className={this.props.classes.sideMenuSlider}
                                onChange={this.handleBorderWidth.bind(this)}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={10}
                            />
                        </div>
                        <div>
                            <Typography>Border Radius</Typography>
                            <Slider
                                value={this.state.borderRadius}
                                className={this.props.classes.sideMenuSlider}
                                onChange={this.handleBorderRadius.bind(this)}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={30}
                            />
                        </div>
                        <Typography>
                            Shadow
                            <Tooltip title="Enable Shadow">
                                <Switch
                                    value={this.state.showShadow}
                                    checked={this.state.showShadow}
                                    onChange={() => {
                                        this.setState({
                                            showShadow: !this.state
                                                .showShadow,
                                        });
                                    }}
                                />
                            </Tooltip>
                            {this.state.showShadow &&
                            <>
                                <div>
                                    <Typography>
                                        <span>Shadow Color </span>
                                    </Typography>
                                    {this.createColorPicker(
                                        "shadowColorStyles",
                                        "displayShadowColorPicker",
                                        "shadowColor"
                                    )}
                                </div>
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Shadow Spread"
                                        id="spread"
                                        onChange={(e) => this.setState({
                                            shadowSpread: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.shadowSpread,
                                            type: "number",
                                            min: 5,
                                            max: 20,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Top Shadow"
                                        id="topShadow"
                                        onChange={(e) => this.setState({
                                            shadowTop: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.shadowTop,
                                            type: "number",
                                            min: 5,
                                            max: 20,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Left Shadow"
                                        id="leftShadow"
                                        onChange={(e) => this.setState({
                                            shadowLeft: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.shadowLeft,
                                            type: "number",
                                            min: 5,
                                            max: 20,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                            </>
                            }
                        </Typography>
                        <div className={classes.numberPicker}>
                            <TextField
                                label="Padding"
                                id="padding"
                                onChange={(e) => this.setState({
                                    padding: e.target.value
                                })}
                                inputProps={{
                                    value: this.state.padding,
                                    type: "number",
                                    min: 5,
                                    max: 20,
                                }}
                                variant={"outlined"}
                                size={"small"}
                            />
                        </div>
                        <div className={classes.numberPicker}>
                            <TextField
                                label="Margin"
                                id="margin"
                                onChange={(e) => this.setState({
                                    margin: e.target.value
                                })}
                                inputProps={{
                                    value: this.state.margin,
                                    type: "number",
                                    min: 5,
                                    max: 20,
                                }}
                                variant={"outlined"}
                                size={"small"}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="primary"
                            onClick={() => {
                                this.props.handleSave(this.state.itemModuleEditId, {
                                    ...this.state
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

export default withStyles(styles)(PagelistModule);
