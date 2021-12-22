import React, {Component} from "react";
import {DropzoneDialog} from 'material-ui-dropzone'

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";
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
        enabledBackground: false,
        enabledLogo: false,
        backgroundPosition: 'center center',
        temporaryDeleted: [],
        files: []
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        if (this.props.moduleOptions) {
            let {moduleOptions} = this.props;
            this.setState({
                isModuleSticky: !!moduleOptions.isModuleSticky,
                backgroundRepeat: !!moduleOptions.backgroundRepeat,
                backgroundStretch: !!moduleOptions.backgroundStretch,
                logoTitle: moduleOptions.logoTitle,
                logoLink: moduleOptions.logoLink,
                files: moduleOptions.files,
                logoWidth: moduleOptions.logoWidth || 100,
                backgroundPosition: moduleOptions.backgroundPosition || this.state.backgroundPosition,
                logoPosition: moduleOptions.logoPosition || this.state.logoPosition,
                enabledBackground: !!moduleOptions.enabledBackground,
                enabledLogo: !!moduleOptions.enabledLogo,
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

            let files = this.state.files;

            const bgIndex = files.findIndex(i => i && i.sel === 'bg');

            if (this.state.backgroundImageFile && this.state.enabledBackground) {
                const bgPayload = {
                    sel: 'bg',
                    name: `background.${this.fileExtension(this.state.backgroundImageFile.name)}`,
                    file: this.state.backgroundImageFile
                };

                if(bgIndex && bgIndex > -1) {
                    files[bgIndex] = bgPayload;
                } else {
                    files.push(bgPayload);
                }
            }

            this.handleSave({files});
        }
    }

    async handleLogoSize(event, newValue) {
        this.handleSave({logoWidth: Number(newValue)});
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
        const tempFiles = this.state.temporaryDeleted || [];
        const tempFileIndex = tempFiles.findIndex(i => i && i.sel === type);
        const fileIndex = files.findIndex(i => i && i.sel === type);

        if (fileIndex >= 0) {
            if (tempFileIndex >= 0) {
                tempFiles.splice(tempFileIndex, 1, files[fileIndex]);
            } else {
                tempFiles.push(files[fileIndex]);
            }
            files.splice(fileIndex, 1);
        }

        if (type === 'logo') {
            //very fishy
            await this.setAsyncState({enabledLogo: !this.state.enabledLogo});
        }
        if (type === 'bg') {
            //very fishy
            await this.setAsyncState({enabledBackground: !this.state.enabledBackground});
        }

        if (type === 'bg' && this.state.enabledBackground) {
            if (tempFileIndex >= 0 && fileIndex >= 0) {
                files.splice(fileIndex, 1, tempFiles[tempFileIndex]);
            } else if (tempFileIndex >= 0) {
                files.push(tempFiles[tempFileIndex]);
            }
        }

        if (type === 'logo' && this.state.enabledLogo) {
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

        this.handleSave({files});

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


            let files = this.state.files;

            const logoIndex = files.findIndex(i => i && i.sel === 'logo');

            if (this.state.logoImageFile && this.state.enabledLogo) {
                const logoPayload = {
                    sel: 'logo',
                    name: `logo.${this.fileExtension(this.state.logoImageFile.name)}`,
                    file: this.state.logoImageFile
                };

                if(logoIndex && logoIndex > -1) {
                    files[logoIndex] = logoPayload;
                } else {
                    files.push(logoPayload);
                }
            }

            this.handleSave({files});

        }
    }

    async handleInputChange(event) {
        switch (event.target.id) {
            case "logoTitle":
                this.handleSave({logoTitle: event.target.value});
                break;
            case "logoLink":
                this.handleSave({logoLink: event.target.value});
                break;
            default:
                break;
        }
    }

    handleSave(params) {
        this.props.onUpdate(Object.assign({}, {
            isModuleSticky: this.state.isModuleSticky,
            files: this.state.files,

            enabledLogo: this.state.enabledLogo,
            logoTitle: this.state.logoTitle,
            logoLink: this.state.logoLink,
            logoPosition: this.state.logoPosition,
            logoWidth: this.state.logoWidth,

            enabledBackground: this.state.enabledBackground,
            backgroundRepeat: this.state.backgroundRepeat,
            backgroundStretch: this.state.backgroundStretch,
            backgroundPosition: this.state.backgroundPosition,
        }, params));

        this.setState(params);
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
            this.handleSave({backgroundPosition: pos});
        }
        if (type === 'logo') {
            this.handleSave({logoPosition: pos});
        }
    }

    positionButtons = (type) => {

        const vert = ["top", "center", "bottom"];
        const horiz = ["left", "center", "right"];

        let buttons = [];

        vert.map((v, vi) => {
            horiz.map((h, hi) => {
                buttons.push(<button key={`${type}-${hi}-${vi}`} onClick={() => {
                    this.setImgPosition(type, `${h} ${v}`)
                }} className={this.imgPosStateClass(type, `${h} ${v}`)}>
                    {h !== v ? `${h} ${v}` : h }
                </button>)
                return h;
            })
            return v;
        })

        return buttons;
    }

    render() {
        const classes = this.props.classes;

        return (
            <div>
                <FormGroup column="true">
                    <div style={{display: "flex", alignItems: "stretch", justifyContent: "space-between"}}>
                        <Typography gutterBottom>
                            <Tooltip title="Make the header permanently visible">
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.isModuleSticky}
                                        onChange={async () => {
                                            this.handleSave({
                                                isModuleSticky: !this.state.isModuleSticky,
                                            });
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />}
                                    label="Sticky Header"/>
                            </Tooltip>
                        </Typography>
                        <Typography gutterBottom>
                            <Tooltip title="Logo Enabled">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.enabledLogo}
                                            onChange={async () => this.handleImageDelete('logo')}
                                            inputProps={{'aria-label': 'controlled'}}
                                        />}
                                    label="Logo Enabled"/>
                            </Tooltip>
                        </Typography>
                        <Typography gutterBottom>
                            <Tooltip title="Background Enabled">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.enabledBackground}
                                            onChange={async () => this.handleImageDelete('bg')}
                                            inputProps={{'aria-label': 'controlled'}}
                                        />}
                                    label="Background Enabled"/>
                            </Tooltip>
                        </Typography>
                    </div>
                    { this.state.enabledBackground && (
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
                            <>
                                <div style={{textAlign: "center"}}>
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
                                <div style={{display: "grid", gridGap: "12px", gridTemplateColumns: "repeat(3, 1fr)"}}>
                                    <Typography gutterBottom>
                                        <Tooltip title="Background Repeat">
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.backgroundRepeat}
                                                    onChange={async () => {
                                                        this.handleSave({
                                                            backgroundRepeat: !this.state.backgroundRepeat,
                                                        });
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
                                                            this.handleSave({
                                                                backgroundStretch: !this.state.backgroundStretch,
                                                            });
                                                        }}
                                                        inputProps={{'aria-label': 'controlled'}}
                                                    />}
                                                label="Background Stretch"/>
                                        </Tooltip>
                                    </Typography>
                                </div>
                                <div className={classes.buttonsPosition}>
                                    {this.positionButtons('bg')}
                                </div>
                            </>

                        </AccordionDetails>
                    </Accordion>
                    )}
                    { this.state.enabledLogo && (
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
                            <>
                                <div style={{
                                    display: "flex", justifyContent: "center", alignItems: 'center'
                                }}>
                                    <div>
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
                                        Logo position
                                    </Typography>
                                </div>
                                <div className={classes.buttonsPosition}>
                                    {this.positionButtons('logo')}
                                </div>
                            </>
                        </AccordionDetails>
                    </Accordion>)
                    }
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
