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
        logoWidth: 100
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
                logoWidth: moduleOptions.logoWidth || 100
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
            })
        }
        this.handleSave();
    }

    handleLogoSize(event, newValue) {
        this.setState({logoWidth: newValue});
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
        let files = [];
        if (this.state.backgroundImageFile) {
            files.push({
                sel: 'bg',
                name: `background.${this.fileExtension(this.state.backgroundImageFile.name)}`,
                file: this.state.backgroundImageFile
            });
        }
        if (this.state.logoImageFile) {
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

    render() {
        const classes = this.props.classes;

        return (
            <div style={{ textAlign: "center" }}>
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
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    {this.state.backgroundImageFile && <DeleteForever onClick={async () => {
                                        await this.setAsyncState({
                                            backgroundImage: "",
                                            backgroundImageFile: ""
                                        })
                                        this.props.onUpdate(this.state);
                                    }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                                </div>
                                <Button onClick={() => {this.showBackgroundUploader()}} color="primary">Upload Background Image</Button>
                                <DropzoneDialog
                                    open={this.state.showBackgroundUploader}
                                    onSave={this.handleBackground.bind(this)}
                                    onClose={this.closeBackgroundUploader.bind(this)}
                                    filesLimit={1}
                                    maxFileSize={Math.pow(1024, 3)}
                                />
                            </div>
                            <div style={{ display: "grid", gridGap: "12px", gridTemplateColumns: "repeat(3, 1fr)" }}>

                                <Typography style={{ flex: '0 1 ~ "calc(33% - 15px)"' }} gutterBottom>
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
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />}
                                            label="Sticky Header" />
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
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />}
                                            label="Background Repeat" />
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
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />}
                                            label="Background Stretch" />
                                    </Tooltip>
                                </Typography>
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
                            <div>
                                <div style={{
                                    display: "flex", justifyContent: "center", alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ display: "flex" }}>
                                            {this.state.logoImageFile && <DeleteForever onClick={async () => {
                                                await this.setAsyncState({
                                                    backgroundImage: "",
                                                    logoImageFile: ""
                                                })
                                                this.props.onUpdate(this.state);
                                            }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                                        </div>
                                        <Button onClick={() => {this.showLogoUploader()}} color="primary">Upload Logo Image</Button>
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
                            <div style={{ display: "grid", gridGap: "12px", gridTemplateColumns: "repeat(2, 1fr)" }}>
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
                                        defaultValue={this.state.logoWidth}
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
                                <button onClick={(evt) => {this.setState({logoPosition: "left top"})}} className={this.logoPosStateClass('left top')}>left top</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "center top"})}} className={this.logoPosStateClass('center top')}>center top</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "right top"})}} className={this.logoPosStateClass('right top')}>right top</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "left center"})}} className={this.logoPosStateClass('left center')}>left center</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "center center"})}} className={this.logoPosStateClass('center center')}>center center</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "right center"})}} className={this.logoPosStateClass('right center')}>right center</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "bottom left"})}} className={this.logoPosStateClass('bottom left')}>bottom left</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "bottom center"})}} className={this.logoPosStateClass('bottom center')}>bottom center</button>
                                <button onClick={(evt) => {this.setState({logoPosition: "bottom right"})}} className={this.logoPosStateClass('bottom right')}>bottom right</button>
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
