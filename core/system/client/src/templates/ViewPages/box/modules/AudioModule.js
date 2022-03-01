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

import {DropzoneDialog} from 'material-ui-dropzone';
import Button from "../../../../components/CustomButtons/Button";

class AudioModule extends Component {
    sourceTypes = [{label: "Exact URL"}, {label: "Query String Variable"}, {label: "Uplode"}];
    state = {
        url: "",
        sourceType: 0,
        volume: 0.1,
        sliderVolume: 0,
        autoplay: false,
        enabled: false,
        showDropZone: false ,
        files: [],
        index:'',
        audio: '',
        audioFile: {},
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
        const newState = {
            autoplay: this.props.moduleOptions.autoplay,
            sourceType: this.props.moduleOptions.sourceType,
            url: this.props.moduleOptions.url,
            variableName: this.props.moduleOptions.variableName || "",
            sliderVolume: this.props.moduleOptions.volume * 100,
            volume: this.props.moduleOptions.volume,
            enabled: true,
            audio:  this.props.moduleOptions.audio || '' ,
            audioFile: this.props.moduleOptions.audioFile || {},
            files: this.props.moduleOptions.files || []
        }

        if(newState.files?.length > 0){
            newState.url = `/files/pages/page-${this.props.pageId}/box-${this.props.boxId}/module/${newState.files[0]?.name}`;
        }
        this.setState(newState);
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


    showLogoUploader() {
        this.setState({
            showDropZone: true,
            enabled:true,

        });
    }
    closeLogoUploader() {
        this.setState({
            showDropZone: false
        });
    }

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


    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async handleAudio(event) {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            await this.setAsyncState({
                audio: strings[0],
                audioFile: event[0]
            });

            this.setState({
                showDropZone: false
            });

            let files = this.state.files;
            const audioFile = !!files[0];
            
            if (this.state.audioFile) {
                const audioPayload = {
                    sel: 'audio',
                    name: `audio.${this.fileExtension(this.state.audioFile.name)}`,
                    file: this.state.audioFile
                };

                if(audioFile) {
                    files[0] = audioPayload;
                } else {
                    files.push(audioPayload);
                }
                await this.setAsyncState({files: files, url: `/files/pages/page-${this.props.pageId}/box-${this.props.boxId}/module/${files[0].name}`});
                this.props.onUpdate(this.state);
            }

        }
    }

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    render() {
        const audioProps = {
            src: this.state.audio || this.state.url,
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
                    <div>

                        <DropzoneDialog
                            open={this.state.showDropZone}
                            onSave={this.handleAudio.bind(this)}
                            onClose={this.closeLogoUploader.bind(this)}
                            filesLimit={1}
                            acceptedFiles={['audio/*']}
                            maxFileSize={Math.pow(1024, 3)}
                        />
                    </div>
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
                {
                    this.state.sourceType === 2 ?(
                        <Button onClick={() => {
                            this.showLogoUploader()
                        }} color="primary">Upload Logo Image</Button>

                    ):(
                        <>
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
                        </>
                    )
                }

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
    pageOptions:PropTypes.object,
    pageId:PropTypes.object,
    boxId:PropTypes.object
};