import React, {Component} from "react";
import {DropzoneDialog} from 'material-ui-dropzone'

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";
import {DeleteForever} from "@material-ui/icons";
import PropTypes from "prop-types";
import {Accordion, AccordionDetails, AccordionSummary, FormControlLabel, FormGroup} from "@material-ui/core";
import Button from "../../../../components/CustomButtons/Button";
import Slider from "@material-ui/core/Slider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class HeaderModule extends Component {
    state = {
        moduleId: "",
        openEditor: false,
        editorTitle: "Header Module Options",
        isModuleSticky: false,
        logoTitle: "",
        logoLink: "",
        backgroundRepeat: false,
        backgroundStretch: false,
        showLogoUploader: false,
        showBackgroundUploader: false,
        logoPosition: "left center",
        logoWidth: 100,
        disableBackground: false,
        disableLogo: false,
        backgroundPosition: 'center center',
        temporaryDeleted: [],
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        if (this.props.moduleOptions) {
            let { moduleOptions } = this.props;
            this.setState({
                isModuleSticky: moduleOptions.isModuleSticky,
                backgroundRepeat: moduleOptions.backgroundRepeat,
                backgroundStretch: moduleOptions.backgroundStretch,
                logoTitle: moduleOptions.logoTitle,
                logoLink: moduleOptions.logoLink,
                files: moduleOptions.files,
                logoWidth: moduleOptions.logoWidth || 100,
                backgroundPosition: moduleOptions.backgroundPosition || this.state.backgroundPosition,
                logoPosition: moduleOptions.logoPosition || this.state.logoPosition,
                disableBackground: moduleOptions.disableBackground,
                disableLogo: moduleOptions.disableLogo,
            });
        }
    }

    closeModuleOptionsModal() {
        this.setState({openEditor: false});
    }

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async handleBackground(event) {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            await this.setAsyncState({
                backgroundImage: strings[0],
                backgroundImageFile: event[0]
            });
            await this.setAsyncState({
                showBackgroundUploader: false
            });
        }
        this.handleSave();
    }

    async handleLogoSize(event, newValue) {

        await this.setAsyncState({logoWidth: Number(newValue)});
        this.props.onUpdate(this.state);
    }

    closeLogoUploader() {
        this.setState({
            showLogoUploader: false
        });
    }

    showLogoUploader() {
        this.setState({
            showLogoUploader: true
        });
    }

    closeBackgroundUploader() {
        this.setState({
            showBackgroundUploader: false
        });
    }

    showBackgroundUploader() {
        this.setState({
            showBackgroundUploader: true
        });
    }

    async handleImageDelete(type) {
        const files = this.state.files || [];
        let tempFiles = this.state.temporaryDeleted || [];
        const tempFileIndex = tempFiles.findIndex(i => i.sel === type);
        const fileIndex = files.findIndex(i => i.sel === type);

        if (fileIndex >= 0) {
            if (tempFileIndex >= 0) {
                tempFiles.splice(tempFileIndex, 1, files[fileIndex]);
            } else {
                tempFiles.push(files[fileIndex]);
            }
            files.splice(fileIndex, 1);
        }


        if (type === 'logo') {
            await this.setAsyncState({disableLogo: !this.state.disableLogo});
        }
        if (type === 'bg') {
            await this.setAsyncState({disableBackground: !this.state.disableBackground});
        }

        if (type === 'bg' && !this.state.disableBackground) {
            if (tempFileIndex >= 0 && fileIndex >= 0) {
                files.splice(fileIndex, 1, tempFiles[tempFileIndex]);
            } else if (tempFileIndex >= 0) {
                files.push(tempFiles[tempFileIndex]);
            }
        }
        if (type === 'logo' && !this.state.disableLogo) {
            if (tempFileIndex >= 0 && fileIndex >= 0) {
                files.splice(fileIndex, 1, tempFiles[tempFileIndex]);
            } else if (tempFileIndex >= 0) {
                files.push(tempFiles[tempFileIndex]);
            }
        }

        if (tempFileIndex >= 0) {
            tempFiles.splice(tempFileIndex, 1, files[fileIndex]);
        } else {
            tempFiles.push(files[fileIndex]);
        }
        this.props.onUpdate(this.state);
    }

    async handleLogo(event) {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            await this.setAsyncState({
                logoImage: strings[0],
                logoImageFile: event[0]
            });
            await this.setAsyncState({
                showLogoUploader: false
            })
        }
        this.handleSave();
    }

    async handleInputChange(event) {
        switch (event.target.id) {
            case "logoTitle":
                await this.setAsyncState({logoTitle: event.target.value});
                break;
            case "logoLink":
                await this.setAsyncState({logoLink: event.target.value});
                break;
            default:
                break;
        }
        this.handleSave();
    }

    handleSave() {
        let files = this.state.files || [];
        const bgIndex = files.findIndex(i => i.sel === 'bg');
        const logoIndex = files.findIndex(i => i.sel === 'logo');

        if (this.state.backgroundImageFile && bgIndex >= 0 && !this.state.disableBackground) {
            files[bgIndex] = {
                sel: 'bg',
                name: `background.${this.fileExtension(this.state.backgroundImageFile.name)}`,
                file: this.state.backgroundImageFile
            };
        } else if (this.state.backgroundImageFile && !this.state.disableBackground) {
            files.push({
                sel: 'bg',
                name: `background.${this.fileExtension(this.state.backgroundImageFile.name)}`,
                file: this.state.backgroundImageFile
            });
        }


        if (this.state.logoImageFile && logoIndex >= 0 && !this.state.disableLogo) {
            files[logoIndex] = {
                sel: 'logo',
                name: `logo.${this.fileExtension(this.state.logoImageFile.name)}`,
                file: this.state.logoImageFile
            }
        } else if (this.state.logoImageFile && !this.state.disableLogo) {
            files.push({
                sel: 'logo',
                name: `logo.${this.fileExtension(this.state.logoImageFile.name)}`,
                file: this.state.logoImageFile
            });
        }

        this.props.onUpdate({
            files: files,
            logoTitle: this.state.logoTitle,
            logoLink: this.state.logoLink,
            isModuleSticky: this.state.isModuleSticky,
            backgroundRepeat: this.state.backgroundRepeat,
            backgroundStretch: this.state.backgroundStretch
        })
    }

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    logoPosStateClass = (pos) => {
        return this.state.logoPosition === pos ? 'selected' : '';
    }

    imgPosStateClass = (type = 'logo', pos) => {
        let posClass = '';
        if (type === 'bg') {
            posClass = this.state.backgroundPosition === pos ? 'selected' : '';
            return posClass;
        }
        if (type === 'logo') {
            posClass = this.state.logoPosition === pos ? 'selected' : '';
            return posClass;
        }

        return posClass;
    }
    setImgPosition = async (type = 'logo', pos) => {
        if (type === 'bg') {
            await this.setAsyncState({backgroundPosition: pos});
            this.props.onUpdate(this.state);
        }
        if (type === 'logo') {
            await this.setAsyncState({logoPosition: pos});
            this.props.onUpdate(this.state);
        }
    }

    render() {
        const classes = this.props.classes;

        return (
            <div style={{textAlign: "center"}}>
                <FormGroup column>
                    <Accordion classes={{root: this.props.classes.accordion}}>
                        <AccordionSummary
                            classes={{
                                root: this.props.classes.accordionSummaryRoot,
                                expanded: this.props.classes.accordionSummaryExpanded,
                                content: this.props.classes.accordionSummaryContent,
                            }}
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1c-content"
                        >
                            <Typography className={this.props.classes.typography}>
                                Background options
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={this.props.classes.accordionDetails}>
                            {
                                !this.state.disableBackground && (
                                    <div>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            {this.state.backgroundImageFile && <DeleteForever onClick={async () => {
                                                await this.setAsyncState({
                                                    backgroundImage: "",
                                                    backgroundImageFile: ""
                                                })
                                                this.props.onUpdate(this.state);
                                            }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                                        </div>
                                        <Button onClick={() => {
                                            this.showBackgroundUploader()
                                        }} color="primary">Upload Background Image</Button>
                                        <DropzoneDialog
                                            open={this.state.showBackgroundUploader}
                                            onSave={this.handleBackground.bind(this)}
                                            onClose={this.closeBackgroundUploader.bind(this)}
                                            filesLimit={1}
                                            maxFileSize={Math.pow(1024, 3)}
                                        />
                                    </div>
                                )
                            }

                            <div style={{display: "grid", gridGap: "12px", gridTemplateColumns: "repeat(3, 1fr)"}}>

                                <Typography style={{flex: '0 1 ~ "calc(33% - 15px)"'}} gutterBottom>
                                    <Tooltip title="Make the header permanently visible">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.isModuleSticky}
                                                onChange={async () => {
                                                    await this.setAsyncState({
                                                        isModuleSticky: !this.state.isModuleSticky,
                                                    });
                                                    this.props.onUpdate(this.state)
                                                }}
                                                inputProps={{'aria-label': 'controlled'}}
                                            />}
                                            label="Sticky Header"/>
                                    </Tooltip>
                                </Typography>
                                <Typography gutterBottom>
                                    <Tooltip title="Background Repeat">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.backgroundRepeat}
                                                onChange={async () => {
                                                    await this.setAsyncState({
                                                        backgroundRepeat: !this.state.backgroundRepeat,
                                                    });
                                                    this.props.onUpdate(this.state)
                                                }}
                                                inputProps={{'aria-label': 'controlled'}}
                                            />}
                                            label="Background Repeat"/>
                                    </Tooltip>
                                </Typography>
                                <Typography gutterBottom>
                                    <Tooltip title="Background Stretch">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.backgroundStretch}
                                                    onChange={async () => {
                                                        await this.setAsyncState({
                                                            backgroundStretch: !this.state.backgroundStretch,
                                                        });
                                                        this.props.onUpdate(this.state)
                                                    }}
                                                    inputProps={{'aria-label': 'controlled'}}
                                                />}
                                            label="Background Stretch"/>
                                    </Tooltip>
                                </Typography>
                                <Typography gutterBottom>
                                    <Tooltip title="Disable Background">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.disableBackground}
                                                    onChange={async () => this.handleImageDelete('bg')}
                                                    inputProps={{'aria-label': 'controlled'}}
                                                />}
                                            label="Disable Background"/>
                                    </Tooltip>
                                </Typography>
                            </div>
                            <div className={classes.buttonsPosition}>
                                <button onClick={() => {
                                    this.setImgPosition('bg', 'left top')
                                }} className={this.imgPosStateClass('bg', 'left top')}>
                                    left top
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "center top");
                                }} className={this.imgPosStateClass('bg', 'center top')}>center top
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "right top");
                                }} className={this.imgPosStateClass('bg', 'right top')}>right top
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "left center");
                                }} className={this.imgPosStateClass('bg', 'left center')}>left center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "center center");
                                }} className={this.imgPosStateClass('bg', 'center center')}>center center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "right center");
                                }} className={this.imgPosStateClass('bg', 'right center')}>right center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "bottom left");
                                }} className={this.imgPosStateClass('bg', 'bottom left')}>bottom left
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "bottom center");
                                }} className={this.imgPosStateClass('bg', 'bottom center')}>bottom center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('bg', "bottom right");
                                }} className={this.imgPosStateClass('bg', 'bottom right')}>bottom right
                                </button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion classes={{root: this.props.classes.accordion}}>
                        <AccordionSummary
                            classes={{
                                root: this.props.classes.accordionSummaryRoot,
                                expanded: this.props.classes.accordionSummaryExpanded,
                                content: this.props.classes.accordionSummaryContent,
                            }}
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1c-content"
                        >
                            <Typography className={this.props.classes.typography}>
                                Logo options
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={this.props.classes.accordionDetails}>
                            {
                                !this.state.disableLogo && (
                                    <div>
                                        <div style={{
                                            display: "flex", justifyContent: "center", alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{display: "flex"}}>
                                                    {this.state.logoImageFile && <DeleteForever onClick={async () => {
                                                        await this.setAsyncState({
                                                            backgroundImage: "",
                                                            logoImageFile: ""
                                                        })
                                                        this.props.onUpdate(this.state);
                                                    }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                                                </div>
                                                <Button onClick={() => {
                                                    this.showLogoUploader()
                                                }} color="primary">Upload Logo Image</Button>
                                                <DropzoneDialog
                                                    open={this.state.showLogoUploader}
                                                    onSave={this.handleLogo.bind(this)}
                                                    onClose={this.closeLogoUploader.bind(this)}
                                                    filesLimit={1}
                                                    maxFileSize={Math.pow(1024, 3)}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )
                            }
                            <div style={{display: "grid", gridGap: "12px", gridTemplateColumns: "repeat(2, 1fr)"}}>
                                <div>
                                    <CustomInput
                                        labelText="Logo Title"
                                        id="logoTitle"
                                        required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: (event) => this.handleInputChange(event),
                                        }}
                                        inputProps={{
                                            value: this.state.logoTitle,
                                            type: "text",
                                        }}
                                    />
                                </div>
                                <div>
                                    <CustomInput
                                        labelText="Logo Link"
                                        id="logoLink"
                                        required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: (event) => this.handleInputChange(event),
                                        }}
                                        inputProps={{
                                            value: this.state.logoLink,
                                            type: "text",
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <Typography gutterBottom>
                                    Logo size
                                </Typography>
                                <div>
                                    <Slider
                                        valueLabelFormat={(value) => {
                                            return `${value}%`;
                                        }}
                                        defaultValue={this.props.moduleOptions.logoWidth || this.state.logoWidth}
                                        className={this.props.classes.sideMenuSlider}
                                        onChangeCommitted={this.handleLogoSize.bind(this)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        min={1}
                                        max={100}
                                    />
                                </div>
                            </div>
                            <div>
                                <Typography gutterBottom>
                                    <Tooltip title="Disable Logo">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.disableLogo}
                                                    onChange={async () => this.handleImageDelete('logo')}
                                                    inputProps={{'aria-label': 'controlled'}}
                                                />}
                                            label="Disable Logo"/>
                                    </Tooltip>
                                </Typography>
                            </div>
                            <div>
                                <Typography gutterBottom>
                                    Logo position
                                </Typography>
                            </div>
                            <div className={classes.buttonsPosition}>
                                <button onClick={() => {
                                    this.setImgPosition('logo', 'left top')
                                }} className={this.imgPosStateClass('logo', 'left top')}>
                                    left top
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "center top");
                                }} className={this.imgPosStateClass('logo', 'center top')}>center top
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "right top");
                                }} className={this.imgPosStateClass('logo', 'right top')}>right top
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "left center");
                                }} className={this.imgPosStateClass('logo', 'left center')}>left center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "center center");
                                }} className={this.imgPosStateClass('logo', 'center center')}>center center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "right center");
                                }} className={this.imgPosStateClass('right center')}>right center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "bottom left");
                                }} className={this.imgPosStateClass('logo', 'bottom left')}>bottom left
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "bottom center");
                                }} className={this.imgPosStateClass('logo', 'bottom center')}>bottom center
                                </button>
                                <button onClick={() => {
                                    this.setImgPosition('logo', "bottom right");
                                }} className={this.imgPosStateClass('logo', 'bottom right')}>bottom right
                                </button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </FormGroup>
            </div>
        );
    }
}

export default withStyles(styles)(HeaderModule);

HeaderModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};
