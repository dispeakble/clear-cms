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

import Button from "../../../../components/CustomButtons/Button";
import {Publish} from "@material-ui/icons";
import imageHelper from "../../../../helpers/image.helper";
import Divider from "@material-ui/core/Divider";

class AudioModule extends Component {
    sourceTypes = [{label: "Exact URL"}, {label: "Query String Variable"}, {label: "Upload audio file"}];
    state = {
        url: "",
        sourceType: 0,
        volume: 0.1,
        sliderVolume: 0,
        autoplay: false,
        isPreviewEnabled: false,
        files: [],
        index: '',
        audio: '',
        audioFile: {}
    };
    audioUploader = null;
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

    componentDidMount() {

        let {
            autoplay,
            sourceType,
            url,
            variableName,
            sliderVolume,
            volume,
            audio,
            audioFile,
            files
        } = this.props.moduleOptions;

        autoplay = !!autoplay; //if 0 !! === false; if 1 !! === true; !0 === true; !1 === false
        sourceType = sourceType || '';
        url = url || '';
        variableName = variableName || '';
        sliderVolume = (undefined === sliderVolume ? 1 : sliderVolume) * 100;
        volume = undefined === volume ? 1 : volume;
        audio = audio || '';
        audioFile = audioFile || {};
        files = files || [];

        if (files?.length > 0) {
            url = `/files/pages/page-${this.props.pageId}/box-${this.props.boxId}/module/${files[0]?.name}`;
        }
        this.setState({
            autoplay,
            sourceType,
            url,
            variableName,
            sliderVolume,
            volume,
            audio,
            audioFile,
            files,
            isPreviewEnabled: true
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
        this.onUpdate({
            sourceType: this.getIndex(newValue.label),
        })
    };

    handleVolume = async (newValue) => {
        this.onUpdate({
            sliderVolume: newValue * 100,
            volume: newValue
        });
    };

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "url":
                this.onUpdate({
                    url: event.target.value
                })
                break;

            case "variableName":
                this.onUpdate({
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
        if (!event.target.files || !event.target.files.length) {
            return;
        }

        const fileClone = new File([event.target.files[0]], event.target.files[0].name);
        const audioBase64 = await imageHelper.toBase64(event.target.files[0]);

        const files = this.state.files;

        let bgIndex = files.findIndex(file => file.sel === 'audio');

        bgIndex = bgIndex > -1 ? bgIndex : (files.length ? files.length : 0);

        files[bgIndex] = {
            sel: 'audio',
            file: fileClone,
            string: audioBase64
        }
        this.setState({
            audio: audioBase64
        })

        this.onUpdate({
            files: files
        });

    }

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    onUpdate(params) {
        this.props.onUpdate({...this.state, ...params})
        this.setState(params)
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
            <React.Fragment>
                <div style={{flex: 1, display: "flex"}}>
                    <div style={{flex: 1, paddingRight: '6px'}}>
                        <div>
                            <h4>Audio settings</h4>
                            <div style={{marginTop: 12}}>
                                <Typography gutterBottom variant="caption">
                                    Enable autoplay
                                </Typography>
                            </div>
                            <div>
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.autoplay}
                                        onChange={async () => {
                                            this.onUpdate({
                                                autoplay: !this.state.autoplay,
                                            })
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />}
                                    label="Autoplay"/>
                            </div>
                        </div>
                        <div>
                            <Typography gutterBottom variant="caption">
                                Adjust the volume settings
                            </Typography>
                            <div>
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
                            </div>
                        </div>

                    </div>
                    <div style={{flex: 1, paddingLeft: '6px'}}>
                        <h4>Audio source file settings</h4>
                        <div style={{margin: '12px 0'}}>
                            <Typography gutterBottom variant="caption">
                                Insert source of the file
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
                        />
                        {
                            this.state.sourceType === 2 ? (
                                <div style={{marginTop: 12}}>
                                    <Button color={"primary"} onClick={() => {
                                        this.audioUploader.click();
                                    }}><Publish/> Upload Audio File</Button>
                                    <input
                                        type="file"
                                        multiple={true}
                                        ref={(ref) => this.audioUploader = ref}
                                        style={{display: 'none'}}
                                        onChange={(event) => this.handleAudio(event)}
                                    />
                                </div>
                            ) : (
                                <div style={{marginTop: 12}}>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            Insert the URL source of the file
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                        </div>
                                    </div>
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

                                    {this.state.sourceType === 1 && (<div style={{marginTop: 12}}>
                                            <Typography gutterBottom variant="caption">
                                                Insert the query string variable for the audio file
                                            </Typography>
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
                                        </div>)

                                    }
                                </div>
                            )
                        }
                        <Divider style={{marginTop: 24, background: 'none'}}/>
                    </div>
                </div>
                <div>
                    <Typography gutterBottom variant="caption">
                        Use the preview to listen to the selected file
                    </Typography>
                    <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                    </div>
                </div>
                {this.state.isPreviewEnabled && <AudioPlayer {...audioProps} />}
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(AudioModule);

AudioModule.propTypes = {
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
    moduleOptions: PropTypes.object,
    defaultTheme: PropTypes.object,
    pageOptions: PropTypes.object,
    boxId: PropTypes.number,
    pageId: PropTypes.number,
};