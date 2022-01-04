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
import {FcAudioFile} from "react-icons/all";

class AudioModule extends Component {
    sourceTypes = [{label: "Exact URL"}, {label: "Query String Variable"}, {label: "Upload Audio"}];
    state = {
        url: "",
        sourceType: 0,
        volume: 0.1,
        sliderVolume: 0,
        autoplay: false,
        enabled: false,
        showAudioUploader: false ,
        files: [],
        index:'',
        AudioFile:{}
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
            url: this.props.moduleOptions?.url,
            variableName: this.props.moduleOptions.variableName || "",
            sliderVolume: this.props.moduleOptions.volume * 100,
            volume: this.props.moduleOptions.volume,
            enabled: true,
            files: this.props.moduleOptions.files || [],
            AudioFile: this.props.moduleOptions.AudioFile

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
        this.handleUpdate({
            sourceType: this.getIndex(newValue.label),
        })

    };

    handleVolume =  (newValue) => {
        this.handleUpdate({
            sliderVolume: newValue * 100,
            volume: newValue
        })



    };


    showLogoUploader() {
        this.setState({
            showAudioUploader: true,
            enabled:true,

        });
    }
    closeAudioUploder() {
        this.setState({
            showAudioUploader: false
        });
    }

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "url":
                this.handleUpdate({
                    url: event.target.value
                })

                break;

            case "variableName":
                this.handleUpdate({
                    variableName: event.target.value
                })

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
            this.handleUpdate({
                Audio: strings[0],
                AudioFile: event[0],
                showAudioUploader: false
            })
            let files = this.state.files;
            if (this.state.AudioFile) {

                const logoPayload = {
                    sel: 'audio',
                    name: `audio.${this.fileExtension(this.state.AudioFile.name)}`,
                    file: this.state.AudioFile,
                };
                this.setState({
                    url:strings[0],
                });
                files.push(logoPayload);
            }
            this.handleUpdate({files});
   }
    }
    dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
         }


    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }


    handleUpdate(params) {
        const payload = Object.assign({}, {
            url: this.state.url,
            sourceType: this.state.sourceType,
            volume: this.state.volume,
            sliderVolume: this.state.sliderVolume,
            autoplay: this.state.autoplay,
            enabled: this.state.enabled,
            showAudioUploader: this.state.showAudioUploader,
            files: this.state.files,
            AudioFile:this.state.AudioFile
        }, params);
        this.props.onUpdate(payload);
        this.setState(params);
    }
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
                    <div>

                        <DropzoneDialog
                            open={this.state.showAudioUploader}
                            onSave={this.handleAudio.bind(this)}
                            onClose={this.closeAudioUploder.bind(this)}
                            filesLimit={1}
                            acceptedFiles={['audio/*']}
                            maxFileSize={Math.pow(1024, 3)}
                        />
                    </div>
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.autoplay}
                            onChange={ () => {
                                this.handleUpdate({
                                    autoplay: !this.state.autoplay,
                                })

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
                        }} color="primary">Upload Audio</Button>

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
};