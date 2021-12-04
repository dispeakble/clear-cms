import React, {Component} from "react";

import ReactPlayer from "react-player/lazy";

import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Tooltip from "@material-ui/core/Tooltip";


import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

class VideoModule extends Component {
    state = {
        url: "",
        sourceTypes: [{label: "Exact URL"}, {label: "Query String Variable"}],
        mute: null,
        controls: false,
        loop: false,
        sourceId: 0,
        enablePlayer: true,
        volume: 50,
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
            url: this.props.moduleOptions.url,
            mute: this.props.moduleOptions.mute,
            controls: this.props.moduleOptions.controls,
            loop: this.props.moduleOptions.loop,
            volume: this.props.moduleOptions.volume,
        });
    }

    getIndex(name) {
        return Number(
            this.state.sourceTypes.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleSourceType = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        await this.setAsyncState({
            sourceId: this.getIndex(newValue.label),
        });
    };

    handleEdit = async (id) => {
        await this.setAsyncState({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
        await this.setAsyncState({
            editGalleryType: this.state.editGalleryType,
        });
    };

    handleVolume = async (event, newValue) => {
        await this.setAsyncState({
            volume: newValue,
            mute: false,
        });
    };

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "url":
                let url = this.state.url;
                url = event.target.value;
                await this.setAsyncState({url, enablePlayer: false});
                this.props.onUpdate(this.state)

                // this.setState({ url, enablePlayer: false });

                setTimeout(async () => {
                    await this.setAsyncState({url, enablePlayer: true});
                    this.props.onUpdate(this.state)
                }, 30);
                break;

            case "folderPath":
                let folderPath = this.state.folderPath;
                folderPath = event.target.value;
                // this.setState({ folderPath, enablePlayer: false });
                await this.setAsyncState({folderPath, enablePlayer: false});
                this.props.onUpdate(this.state);
                setTimeout(async () => {
                    // this.setState({ enablePlayer: true });
                    await this.setAsyncState({enablePlayer: true});
                    this.props.onUpdate(this.state);
                }, 30);

                break;

            case "fileExtension":
                let fileExtension = this.state.fileExtension;
                fileExtension = event.target.value;
                // this.setState({ fileExtension, enablePlayer: false });
                await this.setAsyncState({fileExtension, enablePlayer: false})
                this.onUpdate(this.state);
                setTimeout(async () => {
                    // this.setState({ enablePlayer: true });
                    await this.setAsyncState({enablePlayer: true});
                    this.props.onUpdate(this.state);
                }, 30);
                break;
            default:
                break;
        }
    };

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

    render() {
        const videoProps = {
            volume: this.state.volume ? this.state.volume / 100 : 0,
            width: "100%",
            controls: this.state.controls,
            loop: this.state.loop,
            url: this.state.url,
            mute: this.state.mute
        };

        return (
            <div>
                <div style={{height: "360px"}}>
                    {this.state.enablePlayer ? (
                        <ReactPlayer
                            playing
                            {...videoProps}

                        />
                    ) : (
                        ""
                    )}
                </div>
                <Autocomplete
                    style={{margin: "5% 0"}}
                    id="moduleDropdown"
                    onChange={this.handleSourceType}
                    className={this.props.classes.option}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    defaultValue={this.state.sourceTypes[this.state.sourceId]}
                    options={this.state.sourceTypes}
                    renderInput={(params) => (
                        <TextField
                            className={this.props.classes.textfield}
                            {...params}
                            label="Source Type"
                            variant="outlined"
                        />
                    )}
                />
                <Typography id="discrete-slider" gutterBottom>
                    Default Volume
                    <Slider
                        defaultValue={this.state.volume}
                        onChangeCommitted={this.handleVolume}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                    />
                </Typography>
                <div style={{display: "flex"}}>
                    <div style={{width: "33%"}}>
                        <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Mute Video">
                                <Switch
                                    checked={this.state.mute}
                                    onChange={async () => {
                                        await this.setAsyncState({
                                            enablePlayer: false,
                                            mute: this.state.mute ? null : true
                                        });
                                        if (this.state.mute) {
                                            this.setState({
                                                volume: 0,
                                            });
                                        } else {
                                            this.setState({
                                                volume: 50,
                                            });
                                        }

                                        await this.setAsyncState({
                                            enablePlayer: false
                                        });
                                    }}
                                />
                            </Tooltip>
                            Muted
                        </Typography>
                    </div>
                    <div style={{width: "33%"}}>
                        <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Enable Controls">
                                <Switch
                                    checked={this.state.controls}
                                    onChange={async () => {

                                        console.log('video controls onChange', !this.state.controls);
                                        this.setAsyncState({

                                            controls: !this.state.controls,
                                            enablePlayer: false,
                                        })
                                        this.props.onUpdate(this.state);

                                        setTimeout(() => {
                                            // this.setState({enablePlayer: true});
                                            this.setAsyncState({
                                                enablePlayer: true,
                                            })
                                            this.props.onUpdate(this.state);
                                        }, 30);
                                    }}
                                />
                            </Tooltip>
                            Controls{" "}
                        </Typography>
                    </div>
                    <div style={{width: "33%"}}>
                        <Typography id="discrete-slider" gutterBottom>
                            <Tooltip title="Allow looping through video">
                                <Switch
                                    checked={this.state.loop}
                                    onChange={() => {
                                        this.setState({
                                            loop: !this.state.loop,
                                            enablePlayer: false,
                                        });
                                        setTimeout(() => {
                                            this.setState({
                                                enablePlayer: true,
                                            });
                                        }, 30);
                                    }}
                                />
                            </Tooltip>
                            Loop
                        </Typography>
                    </div>
                </div>
                {this.state.sourceId === 0 ? (
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
                ) : (
                    <React.Fragment>
                        <CustomInput
                            labelText="Value"
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
                        <CustomInput
                            labelText="Folder Path"
                            id="folderPath"
                            required="required"
                            formControlProps={{
                                fullWidth: true,
                                onChange: (event) => this.handleInputChange(event),
                            }}
                            inputProps={{
                                value: this.state.folderPath,
                                type: "text",
                            }}
                        />
                        <CustomInput
                            labelText="File Extension (e.g. mov, mp4)"
                            id="fileExtension"
                            required="required"
                            formControlProps={{
                                fullWidth: true,
                                onChange: (event) => this.handleInputChange(event),
                            }}
                            inputProps={{
                                value: this.state.fileExtension,
                                type: "text",
                            }}
                        />
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(VideoModule);
