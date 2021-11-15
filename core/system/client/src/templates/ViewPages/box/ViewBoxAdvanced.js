import React from "react";
import {withStyles, createTheme} from "@material-ui/core/styles";
import {MuiThemeProvider} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router-dom";

import Tooltip from "@material-ui/core/Tooltip";

// for speed dial
import Switch from "@material-ui/core/Switch";

// for the dropdown inside each field
import {FormControlLabel, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for the new color picker
import PropTypes from "prop-types";
import CustomInput from "../../../components/CustomInput/CustomInput";

class ViewBoxAdvanced extends React.PureComponent {

    state = {
        modalPositions: [
            {label: "Top", value: "top"},
            {label: "Center", value: "center"},
            {label: "Bottom", value: "bottom"}
        ],
        DisplayOptions: {
            displayAsModal: false,
            showCloseButton: false,
            showActionButton: false,
            actionButtonText: "",
            actionButtonLink: "",
            actionButtonTitle: "",
            showCancelButton: false,
            cancelButtonLink: "",
            cancelButtonText: "",
            cancelButtonTitle: "",
            modalPosition: "center",
            displayBackdrop: false,
            backDropColor: "",
            neverShowAfterClosing: false
        }
    };

    defaultTheme = {};
    muiTheme = {};

    async componentDidMount() {
        const item = this.props.item;
        await this.setAsyncState({
            ...(item.displayOptions && {DisplayOptions: item.displayOptions})
        });
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    async handleDisplayInputChange(event) {
        const DisplayOptions = {...this.state.DisplayOptions}
        const stateName = event.target.id;
        DisplayOptions[stateName] = event.target.value
        await this.setAsyncState({
            DisplayOptions: DisplayOptions
        });
        this.saveChangedStyle();
    }

    async saveChangedStyle() {
        this.props.item.displayOptions = this.state.DisplayOptions;
        this.props.onUpdate(this.props.item);
    };

    // for MuiThemeProvider

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiSwitch: {
                    switchBase: {
                        color: this.props.defaultTheme.primary.main
                    }
                },
                MuiFormControl: {
                    root: {
                        backgroundColor: "white",
                    },
                },
                MuiInputBase: {
                    root: {
                        width: "100%",
                        margin: "0 auto",
                    },
                },
                MuiInputLabel: {
                    formControl: {
                        // width: "90%",
                        marginLeft: "1%",
                    },
                },

                MuiFormLabel: {
                    root: {
                        marginLeft: "5%",
                    },
                },
                MuiAutocomplete: {
                    endAdornment: {
                        position: "absolute",
                        top: "calc(50% - 14px)",
                        right: "0px !important",
                    },
                },
                MuiOutlinedInput: {
                    root: {
                        borderRadius: "",
                        width: "100%",
                        backgroundColor: "white",
                        margin: "0 auto",
                        height: "50px",
                    },
                }
            },
        });
    };

    render() {
        return (
            <React.Fragment>
                <MuiThemeProvider theme={this.muiTheme}>
                    <div className={this.props.classes.optionGroup}>
                        <Typography gutterBottom>
                            <Tooltip
                                title="This box will be placed on top of all elements to be displayed as an important message">
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.DisplayOptions.displayAsModal}
                                        onChange={async () => {
                                            await this.setAsyncState(prevState =>
                                                ({
                                                    ...prevState,
                                                    DisplayOptions: {
                                                        ...prevState.DisplayOptions,
                                                        displayAsModal: !prevState.DisplayOptions.displayAsModal,
                                                    }
                                                }));
                                            this.saveChangedStyle();
                                        }
                                        }
                                    />} label="Display as Modal"/>
                            </Tooltip>
                        </Typography>
                    </div>
                    {this.state.DisplayOptions.displayAsModal && <div>
                        <div className={this.props.classes.optionGroup}>
                            <Autocomplete
                                onChange={async (event, position) => {
                                    if (!position) return;
                                    await this.setAsyncState(prevState => ({
                                        ...prevState,
                                        DisplayOptions: {
                                            ...prevState.DisplayOptions,
                                            modalPosition: position.value,
                                        }
                                    }))
                                    this.saveChangedStyle();
                                }
                                }
                                className={this.props.classes.option}
                                value={
                                    this.state.modalPositions.find(position => position.value === this.state.DisplayOptions.modalPosition)
                                }
                                options={this.state.modalPositions}
                                autoHighlight
                                getOptionLabel={(option) => option && option.hasOwnProperty('label') ? option.label : ""}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        label="Select a Modal Position"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </div>
                        <div className={this.props.classes.optionGroup} style={{maxWidth: "100%"}}>
                            <div style={{flex: 1}}>
                                <Typography>
                                    <Tooltip
                                        title="This box will have the rest of the screen dimmed with a transparent overlay color">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.DisplayOptions.displayBackdrop}
                                                onChange={async () => {
                                                    await this.setAsyncState(prevState => ({
                                                        ...prevState,
                                                        DisplayOptions: {
                                                            ...prevState.DisplayOptions,
                                                            displayBackdrop: !prevState.DisplayOptions
                                                                .displayBackdrop,
                                                        }
                                                    }));
                                                    this.saveChangedStyle();
                                                }}
                                            />} label="Display Backdrop"/>
                                    </Tooltip>
                                </Typography>
                            </div>
                            <div style={{flex: 1}}>
                                <Typography>
                                    <Tooltip
                                        title="This box will have a checkbox with the text: Never show again. If the checkbox is selected then this box will not be displayed again">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.DisplayOptions.neverShowAfterClosing}
                                                onChange={async () => {
                                                    await this.setAsyncState(prevState => ({
                                                        ...prevState,
                                                        DisplayOptions: {
                                                            ...prevState.DisplayOptions,
                                                            neverShowAfterClosing: !prevState.DisplayOptions
                                                                .neverShowAfterClosing,
                                                        }
                                                    }));
                                                    this.saveChangedStyle();
                                                }}
                                            />} label="Never show after closing"/>
                                    </Tooltip>
                                </Typography>
                            </div>
                            <div style={{flex: 1}}>
                                <Typography>
                                    <Tooltip title="This box will have a close button so the user can hide it">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.DisplayOptions.showCloseButton}
                                                onChange={async () => {
                                                    await this.setAsyncState(prevState => ({
                                                        ...prevState,
                                                        DisplayOptions: {
                                                            ...prevState.DisplayOptions,
                                                            showCloseButton: !prevState.DisplayOptions
                                                                .showCloseButton,
                                                        }
                                                    }));
                                                    this.saveChangedStyle();
                                                }}
                                            />} label="Show Close Button"/>
                                    </Tooltip>
                                </Typography>
                            </div>
                        </div>
                        <div className={this.props.classes.optionGroup}>
                            <Tooltip title="This box will have an action button.">
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.DisplayOptions.showActionButton}
                                        onChange={async () => {
                                            await this.setAsyncState(prevState => ({
                                                ...prevState,
                                                DisplayOptions: {
                                                    ...prevState.DisplayOptions,
                                                    showActionButton: !prevState.DisplayOptions
                                                        .showActionButton,
                                                }
                                            }));
                                            this.saveChangedStyle();
                                        }}
                                    />} label="Show Action Button"/>
                            </Tooltip>
                        </div>
                        {this.state.DisplayOptions.showActionButton &&
                        <div style={{display: "flex"}}>
                            <div style={{marginRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText="Action button text"
                                    id="actionButtonText"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleDisplayInputChange(event),
                                    }}
                                    inputProps={{
                                        value: this.state.DisplayOptions.actionButtonText,
                                        type: "text",
                                    }}
                                />
                            </div>
                            <div style={{marginRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText="Action button link"
                                    id="actionButtonLink"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleDisplayInputChange(event),
                                    }}
                                    inputProps={{
                                        value: this.state.DisplayOptions.actionButtonLink,
                                        type: "text",
                                    }}
                                />
                            </div>
                            <div style={{flex: 1}}>
                                <CustomInput
                                    labelText="Action button Title"
                                    id="actionButtonTitle"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleDisplayInputChange(event),
                                    }}
                                    inputProps={{
                                        value: this.state.DisplayOptions.actionButtonTitle,
                                        type: "text",
                                    }}
                                />
                            </div>
                        </div>
                        }
                        <div className={this.props.classes.optionGroup}>
                            <Tooltip title="This box will have a cancel button similar to the close button">
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.DisplayOptions.showCancelButton}
                                        onChange={async () => {
                                            await this.setAsyncState(prevState => ({
                                                ...prevState,
                                                DisplayOptions: {
                                                    ...prevState.DisplayOptions,
                                                    showCancelButton: !prevState.DisplayOptions
                                                        .showCancelButton,
                                                }
                                            }));
                                            this.saveChangedStyle();
                                        }}
                                    />} label="Show Cancel Button"/>
                            </Tooltip>
                        </div>
                        {this.state.DisplayOptions.showCancelButton &&
                        <div style={{display: "flex"}}>
                            <div style={{marginRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText="Cancel button text"
                                    id="cancelButtonText"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleDisplayInputChange(event),
                                    }}
                                    inputProps={{
                                        value: this.state.DisplayOptions.cancelButtonText,
                                        type: "text",
                                    }}
                                />
                            </div>
                            <div style={{marginRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText="Cancel button Link"
                                    id="cancelButtonLink"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleDisplayInputChange(event),
                                    }}
                                    inputProps={{
                                        value: this.state.DisplayOptions.cancelButtonLink,
                                        type: "text",
                                    }}
                                />
                            </div>
                            <div style={{flex: 1}}>
                                <CustomInput
                                    labelText="Cancel button Title"
                                    id="cancelButtonTitle"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleDisplayInputChange(event),
                                    }}
                                    inputProps={{
                                        value: this.state.DisplayOptions.cancelButtonTitle,
                                        type: "text",
                                    }}
                                />
                            </div>
                        </div>
                        }
                    </div>}


                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ViewBoxAdvanced));

ViewBoxAdvanced.propTypes = {
    item: PropTypes.object,
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
    defaultTheme: PropTypes.object
};
