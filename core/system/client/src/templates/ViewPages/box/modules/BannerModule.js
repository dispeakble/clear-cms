import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import Button from "components/CustomButtons/Button";
import imageHelper from "../../../../helpers/image.helper";
import {Publish} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

class BannerModule extends Component {
    state = {
        bannerTitle: "",
        bannerLink: "",
        bannerSize: 0,
        linkNav: 0,
        linkNavs: [{label: "Same Tab"}, {label: "New Tab"}],
        files: [],
        banner: "",
        bannerBinary: "",
        showFileUploader: false,
    };

    bannerSizes = [
        {label: "120 x 600"},
        {label: "160 x 600"},
        {label: "200 x 200"},
        {label: "250 x 250"},
        {label: "300 x 250"},
        {label: "300 x 600"},
        {label: "336 x 280"},
        {label: "468 x 60"},
        {label: "728 x 90"},
        {label: "970 x 90"},
    ];

    imageUploader = null;

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

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "bannerTitle":
                await this.setAsyncState({
                    bannerTitle: event.target.value
                });
                break;
            case "bannerLink":
                await this.setAsyncState({
                    bannerLink: event.target.value
                });
                break;
            default:
                break;
        }

        this.handleUpdate();
    };

    getBannerSizeLabel(index) {
        const box = this.bannerSizes[index];
        return box.label;
    }

    getBannerSizeIndex(name) {
        return Number(
            this.bannerSizes.findIndex((type) => {
                return type.label === name;
            })
        );
    }

    handleBannerSize = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        await this.setAsyncState({
            bannerSize: this.getBannerSizeIndex(newValue.label),
        });

        this.handleUpdate();
    };

    getLinkNavLabel(index) {
        const box = this.state.linkNavs[index];
        return box.label;
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
        await this.setAsyncState({
            linkNav: this.getLinkNavIndex(newValue.label),
        });

        this.handleUpdate();
    };

    closeFileUploader() {
        this.setState({
            showFileUploader: false
        });
    }
    
    handleUpdate = async () => {
        this.props.onUpdate({
            bannerTitle: this.state.bannerTitle,
            bannerLink: this.state.bannerLink,
            bannerSize: this.state.bannerSize,
            linkNav: this.state.linkNav,
            files: this.state.files
        })
    }

    fileExtension = (string) => {
        const p = string.split('.');
        return p[p.length - 1];
    }

    async handleImageUpload(event) {

        if(!event.target.files || !event.target.files.length) {
            return;
        }

        const fileClone = new File([event.target.files[0]], event.target.files[0].name);
        const imageBase64 = await imageHelper.toBase64(event.target.files[0]);

        const files = [{
            sel: 'banner',
            name: fileClone.name,
            file: fileClone,
            string: imageBase64
        }];

        this.onUpdate({
            files: files
        });
    }

    onUpdate(params) {
        this.props.onUpdate({...this.state, ...params})
        this.setState(params)
    }

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <div style={{display: "flex", marginTop: 12}}>
                    <div style={{flex: 1, marginRight: 12}}>
                        <Typography gutterBottom variant="caption">
                            Type in title of this banner for SEO reasons
                        </Typography>
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
                        <Divider style={{marginTop: 24, background: 'none'}}/>
                        <Typography gutterBottom variant="caption">
                            Use the banner size to stretch your image automatically
                        </Typography>
                        <Autocomplete
                            style={{margin: "5% 0"}}
                            onChange={this.handleBannerSize}
                            className={classes.option}
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            value={this.bannerSizes[this.state.bannerSize] || null}
                            options={this.bannerSizes}
                            renderInput={(params) => (
                                <TextField
                                    className={classes.textfield}
                                    {...params}
                                    label="Size"
                                    variant="outlined"
                                />
                            )}
                        />
                    </div>
                    <div style={{flex: 1, marginLeft: 12}}>
                        <Typography gutterBottom variant="caption">
                            Type in the banner link
                        </Typography>
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
                        <Divider style={{marginTop: 24, background: 'none'}}/>
                        <Typography gutterBottom variant="caption">
                            Point the user to a new tab or navigate in the same tab
                        </Typography>
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
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <Typography gutterBottom variant="caption">
                            Select your banner image
                        </Typography>
                    </div>
                    <Button color={"primary"} onClick={() => {
                        this.imageUploader.click();
                    }}><Publish /> Upload Banner Image</Button>
                    <input
                        type="file"
                        multiple={true}
                        ref={(ref) => this.imageUploader = ref}
                        style={{display: 'none'}}
                        onChange={(event) => this.handleImageUpload(event)}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(BannerModule);

BannerModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};
