import React, {Component} from "react";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import {FormControlLabel, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";

import Slider from "@material-ui/core/Slider";

import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";

class AudioModule extends Component {
    sourceTypes = [{label: "Exact URL"}, {label: "Query String Variable"}];
    state = {
        url: "",
        sourceType: 0,
        volume: 0.1,
        sliderVolume: 0,
        autoplay: false,
        enabled: false
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

    componentDidMount() {
        this.setState({
            autoplay: this.props.moduleOptions.autoplay,
            sourceType: this.props.moduleOptions.sourceType,
            url: this.props.moduleOptions.url,
            variableName: this.props.moduleOptions.variableName || "",
            sliderVolume: this.props.moduleOptions.volume * 100,
            volume: this.props.moduleOptions.volume,
            enabled: true
        });
    }

    getIndex(name) {
        return Number(
            this.sourceTypes.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleSourceType = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        await this.setAsyncState({
            sourceType: this.getIndex(newValue.label),
        });

        this.props.onUpdate(this.state);
    };

    handleVolume = async (newValue) => {
        await this.setAsyncState({
            sliderVolume: newValue * 100,
            volume: newValue
        });

        this.props.onUpdate(this.state);
    };

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "url":
                await this.setAsyncState({url: event.target.value});
                this.props.onUpdate(this.state);
                break;

            case "variableName":
                await this.setAsyncState({variableName: event.target.value});
                this.props.onUpdate(this.state);
                break;
            default:
                break;
        }
    };

    render() {
        const audioProps = {
            src: this.state.url || "",
            volume: this.state.volume,
            layout: "horizontal-reverse",
            onVolumeChange: (evt) => {
                this.handleVolume(evt.target.volume.toFixed(2))
            }
        }

        return (
            <div>
                <div style={{ height: "78px", margin: "5% 0 10% 0" }}>
                    { this.state.enabled && <AudioPlayer {...audioProps} /> }
                </div>
                <div>
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.autoplay}
                            onChange={async () => {
                                await this.setAsyncState({
                                    autoplay: !this.state.autoplay,
                                });
                                this.props.onUpdate(this.state)
                            }}
                            inputProps={{'aria-label': 'controlled'}}
                        />}
                        label="Autoplay"/>
                </div>
                <div>
                    <Typography id="discrete-slider" gutterBottom>
                        Default Volume
                        <Slider
                            value={this.state.sliderVolume}
                            onChange={(evt, newValue) => {
                                this.handleVolume(newValue / 100);
                            }}
                            aria-labelledby="discrete-slider"
                            valueLabelFormat={(value) => `${value}%`}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                        />
                    </Typography>
                </div>
                <Autocomplete
                    id="moduleDropdown"
                    onChange={this.handleSourceType.bind(this)}
                    className={this.props.classes.option}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    value={this.sourceTypes[this.state.sourceType]}
                    options={this.sourceTypes}
                    renderInput={(params) => (
                        <TextField
                            className={this.props.classes.textfield}
                            {...params}
                            label="Source Type"
                            variant="outlined"
                        />
                    )}
                />{" "}
                <CustomInput
                    labelText="URL"
                    id="url"
                    required="required"
                    formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                    }}
                    inputProps={{
                        value: this.state.url,
                        type: "text",
                    }}
                />

                {this.state.sourceType === 1 && <React.Fragment>
                    <CustomInput
                        labelText="Variable name"
                        id="variableName"
                        required="required"
                        formControlProps={{
                            fullWidth: true,
                            onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                            value: this.state.variableName,
                            type: "text",
                        }}
                    />

                </React.Fragment>}
            </div>
        );
    }
}

export default withStyles(styles)(AudioModule);

AudioModule.propTypes = {
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
    moduleOptions: PropTypes.object,
    defaultTheme: PropTypes.object,
};
