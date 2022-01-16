import React from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import Typography from "@material-ui/core/Typography";

import Switch from "@material-ui/core/Switch";

// for the dropdown inside each field
import {FormControlLabel, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for the new color picker
import PropTypes from "prop-types";
import CustomInput from "../../../components/CustomInput/CustomInput";
import ColorPicker from "../../../components/ColorPicker/ColorPicker";
import Slider from "@material-ui/core/Slider";

class ViewBoxAdvanced extends React.PureComponent {

    state = {
        modalPositions: [
            {label: "Top", value: "top"},
            {label: "Center", value: "center"},
            {label: "Bottom", value: "bottom"}
        ],
        borderRadius: null,
        borderWidth: null,
        borderColor: "",
        hasBorderColor: false,
        scrollbars: false,
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
    };

    componentDidMount() {
        const box = this.props.box;
        this.setState(box);
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    onUpdate = (data) => {
        this.setState(data);
        this.props.onUpdate(data);
    };

    handleBorderWidth = (event, newValue) => {
        this.onUpdate({borderWidth: newValue});
    };

    handleBorderRadius = (event, newValue) => {
        this.onUpdate({borderRadius: newValue});
    };

    render() {
        return (
            <React.Fragment>
                <h4>Border options</h4>

                <Typography variant="caption" style={{display: 'block'}}>Select a color for the border of this box</Typography>
                <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                    {this.state.hasBorderColor && <div>
                        <ColorPicker
                            color={this.state.borderColor}
                            onChange={(color) => {
                                this.onUpdate({
                                    borderColor: color
                                })
                            }}
                        />
                    </div>}
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.hasBorderColor}
                            onChange={() => {
                                this.onUpdate({
                                    hasBorderColor: !this.state
                                        .hasBorderColor
                                });
                            }}
                        />} label="Border Color"/>
                </div>
                <div>
                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Slide to adjust the border thickness of this box</Typography>
                    <Slider
                        value={this.state.borderWidth}
                        className={this.props.classes.sideMenuSlider}
                        onChange={this.handleBorderWidth.bind(this)}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                    />
                </div>
                <div>
                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Slide to adjust the corner roundness of this box</Typography>
                    <Slider
                        value={this.state.borderRadius}
                        className={this.props.classes.sideMenuSlider}
                        onChange={this.handleBorderRadius.bind(this)}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                    />
                </div>

                <h4>Content options</h4>

                <Typography variant="caption" style={{display: 'block'}}>Allow scrolling inside the box if the content exceeds its size</Typography>
                <div style={{marginBottom: '0.35rem'}}>
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.scrollbars}
                            onChange={() => {
                                this.onUpdate({
                                    scrollbars: !this.state.scrollbars
                                });
                            }}
                        />} label="Allow scrolling"/>
                </div>

                <Typography variant="caption" style={{display: 'block'}}>This box will be placed on top of all elements to be displayed as an important message</Typography>
                <div style={{marginBottom: '0.35rem'}}>
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.displayAsModal}
                            onChange={() => {
                                this.onUpdate({
                                    displayAsModal: !this.state.displayAsModal,
                                });
                            }}
                        />} label="Display on top"/>
                </div>
                {this.state.displayAsModal && <div>
                    <Typography variant="caption" style={{display: 'block', marginBottom: '1rem'}}>Select the position of the box relative to the page</Typography>
                    <div style={{marginBottom: '0.35rem'}}>
                        <Autocomplete
                            onChange={(event, position) => {
                                if (!position) return;
                                this.onUpdate({
                                    modalPosition: position.value
                                });
                            }
                            }
                            className={this.props.classes.option}
                            value={
                                this.state.modalPositions.find(position => position.value === this.state.modalPosition)
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

                    <Typography variant="caption" style={{display: 'block'}}>This box will have the rest of the screen dimmed with a transparent overlay color</Typography>
                    <div style={{marginBottom: '0.35rem'}}>
                        <FormControlLabel
                            control={<Switch
                                checked={this.state.displayBackdrop}
                                onChange={() => {
                                    this.onUpdate({
                                        displayBackdrop: !this.state.displayBackdrop
                                    });
                                }}
                            />} label="Display Backdrop"/>
                    </div>

                    <Typography variant="caption" style={{display: 'block'}}>This box will have a checkbox with the text: Never show again. If the checkbox is selected then this box will not be displayed again</Typography>
                    <div style={{marginBottom: '0.35rem'}}>
                        <FormControlLabel
                            control={<Switch
                                checked={this.state.neverShowAfterClosing}
                                onChange={() => {
                                    this.onUpdate({
                                        neverShowAfterClosing: !this.state.neverShowAfterClosing
                                    });
                                }}
                            />} label="Never show after closing"/>
                    </div>

                    <Typography variant="caption" style={{display: 'block'}}>This box will have a close button so the user can hide it</Typography>
                    <div style={{marginBottom: '0.35rem'}}>
                        <FormControlLabel
                            control={<Switch
                                checked={this.state.showCloseButton}
                                onChange={() => {
                                    this.onUpdate({
                                        showCloseButton: !this.state.showCloseButton
                                    });
                                }}
                            />} label="Show Close Button"/>
                    </div>

                    <Typography variant="caption" style={{display: 'block'}}>This box will have an action button</Typography>
                    <div>
                        <FormControlLabel
                            control={<Switch
                                checked={this.state.showActionButton}
                                onChange={() => {
                                    this.onUpdate({
                                        showActionButton: !this.state.showActionButton,
                                    });
                                }}
                            />} label="Show Action Button"/>
                    </div>

                    {this.state.showActionButton &&
                        <div style={{display: "flex", marginBottom: '1rem'}}>
                            <div style={{marginRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText="Action button text"
                                    id="actionButtonText"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => {
                                            this.onUpdate({
                                                actionButtonText: event.target.value
                                            })
                                        }
                                    }}
                                    inputProps={{
                                        value: this.state.actionButtonText,
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
                                        onChange: (event) => {
                                            this.onUpdate({
                                                actionButtonLink: event.target.value
                                            })
                                        }
                                    }}
                                    inputProps={{
                                        value: this.state.actionButtonLink,
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
                                        onChange: (event) => {
                                            this.onUpdate({
                                                actionButtonTitle: event.target.value
                                            })
                                        },
                                    }}
                                    inputProps={{
                                        value: this.state.actionButtonTitle,
                                        type: "text",
                                    }}
                                />
                            </div>
                        </div>
                    }

                    <Typography variant="caption" style={{display: 'block'}}>This box will have a cancel button similar to the close button</Typography>
                    <div>
                        <FormControlLabel
                            control={<Switch
                                checked={this.state.showCancelButton}
                                onChange={() => {
                                    this.onUpdate({
                                        showCancelButton: !this.state.showCancelButton,
                                    });
                                }}
                            />} label="Show Cancel Button"/>
                    </div>
                    {this.state.showCancelButton &&
                        <div style={{display: "flex", marginBottom: '0.35rem'}}>
                            <div style={{marginRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText="Cancel button text"
                                    id="cancelButtonText"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => {
                                            this.onUpdate({
                                                cancelButtonText: event.target.value
                                            })
                                        }
                                    }}
                                    inputProps={{
                                        value: this.state.cancelButtonText,
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
                                        onChange: (event) => {
                                            this.onUpdate({
                                                cancelButtonLink: event.target.value
                                            })
                                        }
                                    }}
                                    inputProps={{
                                        value: this.state.cancelButtonLink,
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
                                        onChange: (event) => {
                                            this.onUpdate({
                                                cancelButtonTitle: event.target.value
                                            })
                                        }
                                    }}
                                    inputProps={{
                                        value: this.state.cancelButtonTitle,
                                        type: "text",
                                    }}
                                />
                            </div>
                        </div>
                    }
                </div>}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ViewBoxAdvanced);

ViewBoxAdvanced.propTypes = {
    box: PropTypes.object,
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
};
