import React, {Component} from "react";

import {withStyles, createTheme} from "@material-ui/core/styles";
import {MuiThemeProvider} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import {DropzoneDialog} from "material-ui-dropzone";

import Typography from "@material-ui/core/Typography";
import CustomInput from "components/CustomInput/CustomInput.js";

import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import Button from "components/CustomButtons/Button";

class BannerModule extends Component {
    state = {
        bannerTitle: "",
        bannerLink: "",
        bannerSizes: [
            {label: "250 x 250"},
            {label: "200 x 200"},
            {label: "468 x 60"},
            {label: "728 x 90"},
            {label: "300 x 250"},
            {label: "336 x 280"},
            {label: "120 x 600"},
            {label: "160 x 600"},
            {label: "300 x 600"},
            {label: "970 x 90"},
        ],
        bannerSize: 0,
        linkNav: 0,
        linkNavs: [{label: "On Page"}, {label: "New Tab"}],
        files: [],
        banner: "",
        bannerBinary: "",
        showFileUploader: false,
    };

    componentDidMount() {
        if (this.props.moduleOptions) {
            let {moduleOptions} = this.props;
            this.setState({
                bannerTitle: moduleOptions.bannerTitle,
                bannerLink: moduleOptions.bannerLink,
                bannerSize: moduleOptions.bannerSize,
                linkNav: moduleOptions.linkNav,
                files: moduleOptions.files,
                bannerBinary: moduleOptions.bannerBinary,
            });
        }
    }

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

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,

            overrides: {
                MuiDropzoneArea: {
                    root: {
                        height: "145px",
                        minHeight: "145px",
                    },
                    text: {
                        fontSize: "1rem",
                    },
                },
            },
        });
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "bannerTitle":
                this.handleUpdate({
                    bannerTitle: event.target.value
                })

                break;
            case "bannerLink":
                this.handleUpdate({
                    bannerLink: event.target.value
                })

                break;
            default:
                break;
        }


    };

    getBannerSizeLabel(index) {
        const item = this.state.bannerSizes[index];
        return item.label;
    }

    getBannerSizeIndex(name) {
        return Number(
            this.state.bannerSizes.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleBannerSize = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        this.handleUpdate({
            bannerSize: this.getBannerSizeIndex(newValue.label),
        })

    };

    getLinkNavLabel(index) {
        const item = this.state.linkNavs[index];
        return item.label;
    }

    getLinkNavIndex(name) {
        return Number(
            this.state.linkNavs.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleLinkNav = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        this.handleUpdate({
            linkNav: this.getLinkNavIndex(newValue.label),
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

    async handleFile(event) {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));
            this.handleUpdate({
                banner: strings[0],
                bannerBinary: event[0],
                showFileUploader: false

            })

        }

        let files = [];
        if (this.state.bannerBinary) {
            files.push({
                sel: 'banner',
                name: `banner.${this.fileExtension(this.state.bannerBinary.name)}`,
                file: this.state.bannerBinary
            });
        }
        this.handleUpdate({
            files
        })




    }

    closeFileUploader() {
        this.setState({
            showFileUploader: false
        });
    }
    
    // handleUpdate = async () => {
    //     this.props.onUpdate({
    //         bannerTitle: this.state.bannerTitle,
    //         bannerLink: this.state.bannerLink,
    //         bannerSize: this.state.bannerSize,
    //         linkNav: this.state.linkNav,
    //         files: this.state.files
    //     })
    // }
    
    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    handleUpdate(params) {
        const payload = Object.assign({}, {
            bannerTitle: this.state.bannerTitle,
            bannerLink: this.state.bannerLink,
            bannerSizes: this.state.bannerSizes,
            bannerSize: this.state.bannerSize,
            linkNav: this.state.linkNav,
            linkNavs: this.state.linkNavs,
            files: this.state.files,
            banner: this.state.banner,
            bannerBinary: this.state.bannerBinary,
            showFileUploader: this.state.showFileUploader,

        }, params);

        this.props.onUpdate(payload);

        this.setState(params);
    }
    render() {
        const classes = this.props.classes;
        return (
            <MuiThemeProvider theme={this.createDefaultTheme}>
                <div style={{ textAlign: "center" }}>
                    <h4 className={classes.modalTitle}>
                        Edit Banner Module
                    </h4>
                    <CustomInput
                        labelText="Title"
                        id="bannerTitle"
                        required="required"
                        formControlProps={{
                            fullWidth: true,
                            onChange: this.handleInputChange.bind(this),
                        }}
                        inputProps={{
                            value: this.state.bannerTitle,
                            type: "text",
                        }}
                    />
                    <Autocomplete
                        style={{margin: "5% 0"}}
                        id="moduleDropdown"
                        onChange={this.handleBannerSize}
                        className={classes.option}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        value={this.state.bannerSizes[this.state.bannerSize] || null}
                        options={this.state.bannerSizes}
                        renderInput={(params) => (
                            <TextField
                                className={classes.textfield}
                                {...params}
                                label="Size"
                                variant="outlined"
                            />
                        )}
                    />{" "}
                    <CustomInput
                        labelText="Link"
                        id="bannerLink"
                        required="required"
                        formControlProps={{
                            fullWidth: true,
                            onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                            value: this.state.bannerLink,
                            type: "text",
                        }}
                    />
                    <Autocomplete
                        style={{margin: "5% 0"}}
                        id="moduleDropdown"
                        onChange={this.handleLinkNav}
                        className={classes.option}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        value={this.state.linkNavs[this.state.linkNav] || null}
                        options={this.state.linkNavs}
                        renderInput={(params) => (
                            <TextField
                                className={classes.textfield}
                                {...params}
                                label="Link Navigation"
                                variant="outlined"
                            />
                        )}
                    />{" "}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <Typography id="discrete-slider" gutterBottom>
                                <span>Image</span>
                            </Typography>
                        </div>
                    </div>
                    <Button onClick={() => {
                        this.setState({
                            showFileUploader: true
                        });
                    }} color="primary">Upload Banner Image</Button>
                    <DropzoneDialog
                        open={this.state.showFileUploader}
                        onSave={this.handleFile.bind(this)}
                        onClose={this.closeFileUploader.bind(this)}
                        filesLimit={1}
                        maxFileSize={Math.pow(1024, 3)}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(BannerModule);

BannerModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    defaultTheme: PropTypes.object,
    onUpdate: PropTypes.func
};
