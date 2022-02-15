import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";
import PropTypes from "prop-types";
import {FormControlLabel, FormGroup} from "@material-ui/core";
import Button from "../../../../components/CustomButtons/Button";
import { Rnd } from "react-rnd";
import imageHelper from "../../../../helpers/image.helper";
import {Publish} from "@material-ui/icons";
import Positioner from "components/Positioner/Positioner";

class HeaderModule extends Component {
    state = {
        moduleId: "",
        openEditor: false,
        editorTitle: "Header Module Options",
        isModuleSticky: false,
        logoTitle: "",
        logoLink: "",
        logoPosition: [10,10],
        backgroundRepeat: false,
        backgroundStretch: false,
        logoWidth: 120,
        logoHeight: 90,
        backgroundPosition: 'center center',
        files: []
    };

    logoImageUploader = null;
    backgroundImageUploader = null;

    logoPosition = [10, 10];

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        if (this.props.moduleOptions) {
            let {moduleOptions} = this.props;
            await this.setAsyncState({
                isModuleSticky: !!moduleOptions.isModuleSticky,
                backgroundRepeat: !!moduleOptions.backgroundRepeat,
                backgroundStretch: !!moduleOptions.backgroundStretch,
                files: moduleOptions.files || [],
                backgroundPosition: moduleOptions.backgroundPosition || this.state.backgroundPosition,
                logoTitle: moduleOptions.logoTitle || "",
                logoLink: moduleOptions.logoLink || "",
                logoPosition: moduleOptions.position || [10, 10],
                logoWidth: moduleOptions.logoWidth || 120,
                logoHeight: moduleOptions.logoHeight || 90,
            });

            this.onUpdate({});

            this.logoPosition = moduleOptions.logoPosition || [10, 10];
        }
    }

    onUpdate(params) {
        this.props.onUpdate({...this.state, ...params})
        this.setState(params)
    }

    getFile(type) {
        if(this.state.files && this.state.files.length) {
            return this.state.files.find(file => file.sel === type) || {
                string: false,
                name: ""
            }
        }

        return {
            string: false,
            name: ""
        };
    }

    async handleBackgroundUpload(event) {

        if(!event.target.files || !event.target.files.length) {
            return;
        }

        const fileClone = new File([event.target.files[0]], event.target.files[0].name);
        const imageBase64 = await imageHelper.toBase64(event.target.files[0]);

        const files = this.state.files;

        let bgIndex = files.findIndex(file => file.sel === 'bg');

        bgIndex = bgIndex > -1 ? bgIndex : (files.length ? files.length : 0);

        files[bgIndex] = {
            sel: 'bg',
            file: fileClone,
            string: imageBase64
        }

        this.onUpdate({
            files: files
        });
    }

    async handleLogoSize(event, newValue) {
        this.onUpdate({logoWidth: Number(newValue)});
    }

    async handleLogoUpload(event) {

        if(!event.target.files || !event.target.files.length) {
            return;
        }

        const fileClone = new File([event.target.files[0]], event.target.files[0].name);
        const imageBase64 = await imageHelper.toBase64(event.target.files[0]);

        const files = this.state.files;

        let logoIndex = files.findIndex(file => file.sel === 'logo');

        logoIndex = logoIndex > -1 ? logoIndex : (files.length ? files.length : 0);

        files[logoIndex] = {
            sel: 'logo',
            file: fileClone,
            string: imageBase64
        }

        this.onUpdate({
            files: files
        });
    }

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    handleLogoDrag(evt) {

        let x = this.logoPosition[0] + evt.movementX;
        let y = this.logoPosition[1] + evt.movementY;

        if(x < 0) {
            x = 0;
        }

        if(y < 0) {
            y = 0;
        }

        this.logoPosition = [ x, y ];
    }

    handleLogoDragStop() {

        const x = this.logoPosition[0];//todo make this a percentage
        const y = this.logoPosition[1];

        this.props.onUpdate(Object.assign({}, this.state, {logoPosition: [x, y]}));

        this.setState({
            logoPosition: this.logoPosition
        });
    }

    handleLogoResize(evt) {
        this.setState({
            logoWidth: evt.width,
            logoHeight: evt.height,
        })
    }

    render() {
        const classes = this.props.classes;

        const {logoWidth, logoHeight} = this.state;

        let foundBg = this.state.files.find(file => file.sel === 'bg');

        if(foundBg) {
            foundBg = foundBg.string || `/files/pages/page-${this.props.pageId}/box-${this.props.boxId}/module/${foundBg.name}`;
        } else {
            foundBg = "none";
        }

        const {string, name} = this.getFile('logo');

        let logoSrc = "";

        if(string && string.length) {
            logoSrc = string;
        } else if(name) {
            logoSrc = `/files/pages/page-${this.props.pageId}/box-${this.props.boxId}/module/${name}`;
        }

        return (
            <div>
                <FormGroup column="true">

                    <div style={{
                        display: "flex"
                    }}>
                        <div style={{flex: 1, marginRight: 12, marginTop: 12}}>
                            <h4>Background options</h4>
                            <div style={{display: "flex", justifyContent: "center", marginTop: 12}}>
                                <Button color={"primary"} onClick={() => {
                                    this.backgroundImageUploader.click();
                                }}><Publish /> Upload Background</Button>
                                <input
                                    type="file"
                                    multiple={true}
                                    ref={(ref) => this.backgroundImageUploader = ref}
                                    style={{display: 'none'}}
                                    onChange={(event) => this.handleBackgroundUpload(event)}
                                />
                            </div>
                            <div style={{marginTop: 24}}>
                                <Typography variant={"caption"} gutterBottom>Fit the background image or repeat to fit the header</Typography>
                            </div>
                            <div style={{display: "flex", marginTop: 12}}>
                                <div style={{flex: 1, marginRight: 12}}>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={this.state.backgroundRepeat}
                                            onChange={async () => {
                                                this.onUpdate({
                                                    backgroundRepeat: !this.state.backgroundRepeat,
                                                });
                                            }}
                                            inputProps={{'aria-label': 'controlled'}}
                                        />}
                                        label="Repeat"/>
                                </div>
                                <div style={{flex: 1, marginLeft: 12}}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.backgroundStretch}
                                                onChange={async () => {
                                                    this.onUpdate({
                                                        backgroundStretch: !this.state.backgroundStretch,
                                                    });
                                                }}
                                                inputProps={{'aria-label': 'controlled'}}
                                            />}
                                        label="Fit"/>
                                </div>
                            </div>
                            <div style={{marginTop: 12}}>
                                <Typography variant={"caption"} gutterBottom>Select the cropping start for the background</Typography>
                                <div className={classes.buttonsPosition} style={{paddingTop: 12}}>
                                    <Positioner
                                        onChange={(value) => {
                                            this.onUpdate({backgroundPosition: value});
                                        }}
                                        selected={this.state.backgroundPosition}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{flex: 1, marginLeft: 12, marginTop: 12}}>
                            <h4>Logo options</h4>
                            <div style={{
                                display: "flex", justifyContent: "center", marginTop: 12
                            }}>
                                <Button color={"primary"} onClick={() => {
                                    this.logoImageUploader.click();
                                }}><Publish /> Upload Logo</Button>
                                <input
                                    type="file"
                                    multiple={true}
                                    ref={(ref) => this.logoImageUploader = ref}
                                    style={{display: 'none'}}
                                    onChange={(event) => this.handleLogoUpload(event)}
                                />
                            </div>
                            <div style={{marginTop: 24}}>
                                <Typography variant={"caption"} gutterBottom>Give the logo a title</Typography>
                            </div>
                            <CustomInput
                                labelText="Logo Title"
                                id="logoTitle"
                                required="required"
                                formControlProps={{
                                    fullWidth: true,
                                    onChange: (event) => {
                                        this.onUpdate({
                                            logoTitle: event.target.value
                                        })
                                    },
                                }}
                                inputProps={{
                                    value: this.state.logoTitle,
                                    type: "text",
                                }}
                            />

                            <div style={{marginTop: 24}}>
                                <Typography variant={"caption"} gutterBottom>Give the logo a link (e.g. / for home)</Typography>
                            </div>
                            <CustomInput
                                labelText="Logo Link"
                                id="logoLink"
                                required="required"
                                formControlProps={{
                                    fullWidth: true,
                                    onChange: (event) => {
                                        this.onUpdate({
                                            logoLink: event.target.value
                                        })
                                    },
                                }}
                                inputProps={{
                                    value: this.state.logoLink,
                                    type: "text",
                                }}
                            />
                            <div style={{marginTop: 12}}>
                                <Typography variant={"caption"} gutterBottom>The header will stick to the top of the page permanently</Typography>
                                <FormControlLabel
                                    control={<Switch
                                        checked={this.state.isModuleSticky}
                                        onChange={async () => {
                                            this.onUpdate({
                                                isModuleSticky: !this.state.isModuleSticky,
                                            });
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />}
                                    label="Sticky Header"/>
                            </div>
                        </div>
                    </div>
                    <div style={{flex: 1, marginRight: 12, marginTop: 12}}>
                        <h4>Header preview</h4>
                        <div id="preview" style={{
                            width: "100%",
                            height: (this.props.box.h * (this.props.layoutBoxSpacing || 1)) || 250,
                            position: "relative",
                            backgroundColor: "#FFFFFF",
                            userSelect: "none",
                            backgroundImage: `url(${foundBg})`,
                            backgroundPosition: this.state.backgroundPosition,
                            backgroundSize: this.state.backgroundStretch ? "cover" : "auto",
                            backgroundRepeat: this.state.backgroundRepeat ? "repeat" : "no-repeat"
                        }}>
                            {logoSrc && <Rnd style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "solid 1px #CCC",
                                background: "none"
                            }}
                                             bounds="parent"
                                             default={{
                                                 width: logoWidth,
                                                 height: logoHeight
                                             }}
                                             position={{
                                                 x: this.logoPosition[0],
                                                 y: this.logoPosition[1],
                                             }}
                                             onDrag={(evt) => {
                                                 this.handleLogoDrag(evt);
                                             }}
                                             onDragStop={() => {
                                                 this.handleLogoDragStop()
                                             }}><img src={logoSrc} style={{
                                userSelect: "none",
                                width: '100%',
                                height: '100%',
                                WebkitUserDrag: 'none'
                            }} /></Rnd> }
                        </div>
                    </div>

                </FormGroup>
            </div>
        );
    }
}

export default withStyles(styles)(HeaderModule);

HeaderModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    box: PropTypes.object,
    boxId: PropTypes.number,
    pageId: PropTypes.number,
    layoutBoxSpacing: PropTypes.number,
    onUpdate: PropTypes.func
};
