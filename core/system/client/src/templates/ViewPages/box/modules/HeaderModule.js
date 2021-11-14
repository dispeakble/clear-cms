import React, {Component} from "react";
import {DropzoneArea} from "material-ui-dropzone";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Tooltip from "@material-ui/core/Tooltip";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";
import {DeleteForever} from "@material-ui/icons";
import PropTypes from "prop-types";
import {FormControlLabel, FormGroup} from "@material-ui/core";

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
                files: moduleOptions.files
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
        }
        this.handleSave();
    }

    async handleLogo(event) {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            await this.setAsyncState({
                logoImage: strings[0],
                logoImageFile: event[0]
            });
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

    render() {
        const classes = this.props.classes;

        return (
            <div style={{ textAlign: "center" }}>
                <FormGroup row>
                    <div style={{ display: "flex" }}>
                        <div style={{
                                margin: "0 20px",
                                width: "calc(50% - 10px)",
                            }} >
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
                        <div style={{ margin: "0 20px", width: "calc(50% - 10px)" }} >
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div><Typography gutterBottom>Upload Logo Image</Typography></div>
                            {this.state.logoImageFile && <DeleteForever onClick={async () => {
                                await this.setAsyncState({
                                    backgroundImage: "",
                                    logoImageFile: ""
                                })
                                this.props.onUpdate(this.state);
                            }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                        </div>
                        <DropzoneArea
                            maxFileSize={Math.pow(1024, 3)}
                            filesLimit={1}
                            className={classes.dropzone}
                            onChange={this.handleLogo.bind(this)}
                        />
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div><Typography gutterBottom>Upload Background Image</Typography></div>
                            {this.state.backgroundImageFile && <DeleteForever onClick={async () => {
                                await this.setAsyncState({
                                    backgroundImage: "",
                                    backgroundImageFile: ""
                                })
                                this.props.onUpdate(this.state);
                            }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                        </div>
                        <DropzoneArea
                            maxFileSize={Math.pow(1024, 3)}
                            filesLimit={1}
                            className={classes.dropzone}
                            onChange={this.handleBackground.bind(this)}
                        />
                    </div>
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
                </FormGroup>
            </div>
        );
    }
}

export default withStyles(styles)(HeaderModule);

HeaderModule.propTypes = {
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};
