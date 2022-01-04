import React, {Component} from "react";
import {DropzoneDialog} from 'material-ui-dropzone'
// import {Accordion, AccordionDetails, AccordionSummary, FormControlLabel, FormGroup} from "@material-ui/core";
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
import Button from "../../../../components/CustomButtons/Button";
import PropTypes from "prop-types";

class VideoModule extends Component {
    state = {
        url: "",
        sourceTypes: [{label: "Exact URL"}, {label: "Query String Variable"}, {label: 'Upload Video'}],
        mute: null,
        controls: false,
        loop: false,
        sourceId: 0,
        enablePlayer: true,
        volume: 50,
        showDropZone: false,
        showUploadButton: false,
        video: '',
        videoFile: {},
        files: []
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
        const {moduleOptions} = this.props;
        const newState = {
            url: moduleOptions.url,
            mute: moduleOptions.mute,
            controls: moduleOptions.controls,
            loop: moduleOptions.loop,
            volume: moduleOptions.volume,
            files: moduleOptions.files || [],
            videoFile: moduleOptions.videoFile || {},
        }
        this.setState(newState);
    }

    getIndex(name) {
        return Number(
            this.state.sourceTypes.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleSourceType = async (event, newValue) => {
        if (newValue.label === 'Upload Video') {
            this.handleUpdate({
                showUploadButton: true,
            })
        } else if (newValue.label !== 'Upload Video' && this.state.showUploadButton) {
            this.handleUpdate({
                showUploadButton: false,
            })
        }
        if (!newValue || !newValue.label) {
            return;
        }

        this.handleUpdate({
            sourceId: this.getIndex(newValue.label),
        })
    };

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    handleEdit = async (id) => {
        this.handleUpdate({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
            editGalleryType: this.state.editGalleryType,

        })

    };

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    handleVolume = async (event, newValue) => {
        this.handleUpdate({
            volume: newValue,
            mute: false,

        })
    };

    showDropZone = () => {
        this.setState({
            showDropZone: true,
        });
    }

    closeDropZone = () => {
        this.setState({
            showDropZone: false,
        });
    }

    handleVideoUpload = async (event) => {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            this.setState({
                url:strings
            })
            this.handleUpdate({
                video: strings[0],
                videoFile: event[0],
                showDropZone: false

            })
            let files = this.state.files;
            const videoIndex = files.findIndex(i => i && i.sel === 'video');
            if (this.state.videoFile) {
                const videoPayload = {
                    sel: 'video',
                    name: `video.${this.fileExtension(this.state.videoFile.name)}`,
                    file: this.state.videoFile,
                };

                if (videoIndex >= 0) {
                    files = [];
                    files.push(videoPayload);
                } else{
                    files.push(videoPayload);
                }
            }
        }
        this.props.onUpdate(this.state);
    }

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "url":
                let url = this.state.url;
                url = event.target.value;

                this.handleUpdate({
                    url, enablePlayer: false, files: []

                })


                setTimeout(async () => {

                    this.handleUpdate({
                        url, enablePlayer: true

                    })
                }, 30);
                break;

            case "folderPath":
                let folderPath = this.state.folderPath;
                folderPath = event.target.value;
                this.handleUpdate({
                    folderPath, enablePlayer: false

                })
                setTimeout(async () => {
                    this.handleUpdate({
                        enablePlayer: true

                    })
                }, 30);
                break;
                case "fileExtension":
                let fileExtension = this.state.fileExtension;
                fileExtension = event.target.value;

                this.handleUpdate({
                    fileExtension, enablePlayer: false

                })
                setTimeout(async () => {
                    this.handleUpdate({
                        enablePlayer: true

                    })
                }, 30);
                break;
            default:
                break;
        }
    };

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }



    handleUpdate(params) {
        const payload = Object.assign({}, {
            url: this.state.url,
            sourceType: this.state.sourceType,
            volume: this.state.volume,
            mute:this.state.mute,
            controls: this.state.controls,
            loop:this.state.loop,
            sourceId:this.state.sourceId,
            enablePlayer:this.state.enablePlayer,
            showDropZone:this.state.showDropZone,
            showUploadButton:this.state.showUploadButton,
            video:this.state.video,
            videoFile:this.state.videoFile,
            files:this.state.files
        }, params);
        this.props.onUpdate(payload);
        this.setState(params);
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
                                        this.handleUpdate({
                                            enablePlayer: false,
                                            mute: this.state.mute ? null : true
                                        })


                                        if (this.state.mute) {

                                            this.setState({
                                                volume: 0,
                                            });
                                        } else {
                                            this.setState({
                                                volume: 50,
                                            });
                                        }


                                        this.handleUpdate({
                                            enablePlayer: false
                                        })
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
                                    onChange={ () => {

                                        this.handleUpdate({
                                            controls: !this.state.controls,
                                            enablePlayer: false,
                                        })


                                        setTimeout(() => {
                                            this.handleUpdate({
                                                enablePlayer: true,
                                            })

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
                                        this.handleUpdate({
                                            loop: !this.state.loop,
                                            enablePlayer: false,
                                        })

                                        setTimeout(() => {
                                            this.handleUpdate({
                                                enablePlayer: true,
                                            })

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
                ) : this.state.showUploadButton ? (
                    <div>
                        <Button onClick={() => {
                            this.showDropZone()
                        }} color="primary">Upload Video</Button>
                        <DropzoneDialog
                            open={this.state.showDropZone}
                            onSave={this.handleVideoUpload.bind(this)}
                            onClose={this.closeDropZone.bind(this)}
                            acceptedFiles={['video/mp4', 'video/webm', 'video/quicktime']}
                            filesLimit={1}
                            maxFileSize={Math.pow(1024, 3)}
                        />
                    </div>
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

VideoModule.propTypes = {
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func,
}

export default withStyles(styles)(VideoModule);
