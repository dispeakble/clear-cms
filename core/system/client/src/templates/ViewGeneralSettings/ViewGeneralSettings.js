import React, {Component} from "react";
import classNames from "classnames";
import {withStyles} from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import {Helmet} from "react-helmet";

import CustomInput from "components/CustomInput/CustomInput.js";
import AddAlert from "@material-ui/icons/AddAlert";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/clear-crm/views/generalSettings";

import {FormControlLabel, TextField} from "@material-ui/core";
import moment from "moment-timezone";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";
import {ToggleButtonGroup} from "@material-ui/lab";
import ToggleButton from "@material-ui/lab/ToggleButton";
import imageHelper from "../../helpers/image.helper";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";

class ViewGeneralSettings extends Component {
    state = {
        websiteName: "",
        websiteDomain: "",
        websiteOwner: "",
        websiteAdminEmail: "",
        applicationVersion: "",
        websiteTimezone: "",
        validation: {
            websiteName: {valid: false, empty: true},
            websiteDomain: {valid: false, empty: true},
            websiteOwner: {valid: false, empty: true},
            websiteAdminEmail: {valid: false, empty: true},
            applicationVersion: {valid: false, empty: true},
            websiteTimezone: {valid: false, empty: true},
            defaultMetaTitle: {valid: false, empty: true},
            defaultMetaDescription: {valid: false, empty: true},
            defaultFavicon: {valid: false, empty: true},
            faviconName: {valid: false, empty: true},
            includeWebsiteTitle: {valid: false, empty: true},
        },
        errors: "",
        messages: "",
        notification: "",
        contentType: "general",
        defaultMetaTitle: "",
        defaultMetaDescription: "",
        defaultFavicon: "",
        faviconName: "",
        includeWebsiteTitle: false,
        timezones: moment.tz.names()
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {

        const generalSettingsData = await this.props.control.get();

        if(generalSettingsData) {
            let validation = this.state.validation;
            validation.websiteName = {
                valid: true,
                empty: false
            };
            validation.websiteDomain = {
                valid: true,
                empty: false
            };
            validation.websiteOwner = {
                valid: true,
                empty: false
            };
            validation.websiteAdminEmail = {
                valid: true,
                empty: false
            };
            validation.applicationVersion = {
                valid: true,
                empty: false
            };
            validation.websiteTimezone = {
                valid: true,
                empty: false
            };
            validation.defaultMetaTitle = {
                valid: true,
                empty: false
            };
            validation.defaultMetaDescription = {
                valid: true,
                empty: false
            };
            validation.defaultFavicon = {
                valid: true,
                empty: false
            };
            validation.includeWebsiteTitle = {
                valid: true,
                empty: false
            };

            this.setState({
                websiteName: generalSettingsData.websiteName,
                websiteDomain: generalSettingsData.websiteDomain,
                websiteOwner: generalSettingsData.websiteOwner,
                websiteAdminEmail: generalSettingsData.websiteAdminEmail,
                applicationVersion: generalSettingsData.applicationVersion,
                defaultMetaTitle: generalSettingsData.defaultMetaTitle,
                defaultMetaDescription: generalSettingsData.defaultMetaDescription,
                defaultFavicon: generalSettingsData.defaultFavicon,
                faviconName: generalSettingsData.faviconName,
                includeWebsiteTitle: generalSettingsData.includeWebsiteTitle,
                websiteTimezone: generalSettingsData.websiteTimezone
            })
        }
    }

    help = {
        between: (params) => {
            return (params.value > params.min) && (params.value < params.max);
        }
    };

    handleInputChange = async (event) => {
        let errors = this.state.errors;
        if (errors) {
            this.setState({
                errors: ""
            })
        }
        let newState = {};
        let validation = this.state.validation;
        let saveDisabled = false;
        newState[event.target.id] = event.target.value;
        validation[event.target.id].valid = this.help.between({value: event.target.value.length, min: 3, max: 30});
        validation[event.target.id].empty = event.target.value.length === 0;
        switch (event.target.id) {
            case "websiteAdminEmail":
                validation["websiteAdminEmail"].valid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) &&
                    event.target.value.length <= 30;
                break;
            default:
                break;
        }

        newState.validation = validation;

        await this.setAsyncState(newState);

        this.setState({
            saveDisabled: saveDisabled
        });
    };

    validateForm = async (event) => {
        event.preventDefault();

        let errors = [];

        if (!this.state.validation.websiteAdminEmail.valid || this.state.validation.websiteAdminEmail.empty) {
            errors.push('Email is not valid or not filled in')
        }

        if (errors.length) {
            this.setState({
                errors: errors.join('. ')
            });
        } else {
            this.setData();
        }
    };





    openNotification(params) {
        this.setState({
            notification: <Snackbar
                open={params.open}
                place={params.place || "tc"}
                color={params.color}
                icon={params.icon || DoneOutline}
                message={params.message}
            />
        });

        setTimeout(() => {
            this.setState({
                notification: ""
            })
        }, 5000)
    }

    async setData() {
        const result = await this.props.control.set({
        data: {
            websiteName: this.state.websiteName,
            websiteDomain: this.state.websiteDomain,
            websiteOwner: this.state.websiteOwner,
            websiteAdminEmail: this.state.websiteAdminEmail,
            applicationVersion: this.state.applicationVersion,
            defaultMetaTitle: this.state.defaultMetaTitle,
            defaultMetaDescription: this.state.defaultMetaDescription,
            defaultFavicon: this.state.defaultFavicon,
            faviconName: this.state.faviconName,
            includeWebsiteTitle: this.state.includeWebsiteTitle,
            websiteTimezone: this.state.websiteTimezone
        }});
        if (result) {
            if (result.success) {
                this.openNotification({
                    open: true,
                    color: "success",
                    message: result.success
                });
            } else if (result.error) {
                this.openNotification({
                    open: true,
                    color: "error",
                    message: result.error
                });
            }

        } else {
            this.openNotification({
                color: "warning",
                message: "Something went wrong"
            });
        }
    }

    handleTabChange(event, nextView) {
        if (nextView) {
            this.setState({
                contentType: nextView
            })
        }
    }

    toggleContentType(type) {
        this.setState({
            contentType: type
        })
    }

    render() {
        const classes = this.props.classes;

        const content = {
            header: () => {
              return (
                  <div className={classes.grid} style={{display: "flex", justifyContent:"center", padding:"15px 0"}}>
                      <ToggleButtonGroup
                          onChange={this.handleTabChange.bind(this)}
                          value={this.state.contentType}
                          exclusive
                      >
                          <ToggleButton value="general" className={classes.gridItem}  style={{minHeight: "40px", padding: "10px 25px"}} onClick={() => this.toggleContentType("general")}>
                              General Settings
                          </ToggleButton>
                          <ToggleButton value="seo" className={classes.gridItem} style={{minHeight: "40px", padding: "10px 25px"}} onClick={() => this.toggleContentType("seo")}>
                              SEO Settings
                          </ToggleButton>
                      </ToggleButtonGroup>
                  </div>
              )
            },
            generalSettings: () => {
                return (
                    <div className={classes.container}>

                        <div className={classes.profile}>
                            <div className={classes.name}>
                                <form onSubmit={this.validateForm} autoComplete={"off"}>
                                    <div>
                                        <CustomInput
                                            className={classes.column} labelText="Website Name" id="websiteName" required="required"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                            value: this.state.websiteName,
                                            type: "text"
                                        }}/>

                                        <p style={{width: "15px"}}></p>

                                        <CustomInput
                                            className={classes.column} labelText="Website Domain" id="websiteDomain" required="required"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                            value: this.state.websiteDomain,
                                            type: "text",
                                        }}/>

                                        <p style={{width: "15px"}}></p>

                                        <CustomInput
                                            className={classes.column} labelText="Website Owner" id="websiteOwner" required="required"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                            value: this.state.websiteOwner,
                                            type: "text",
                                        }}/>

                                        <p style={{width: "15px"}}></p>

                                        <CustomInput
                                            className={classes.column} labelText="Website Admin Email" id="websiteAdminEmail"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                            required: true,
                                            value: this.state.websiteAdminEmail,
                                            type: "email",
                                            // endAdornment: (
                                            //     <InputAdornment position="end">
                                            //         <Icon className={classes.inputIconsColor}> email </Icon>
                                            //     </InputAdornment>
                                            // )
                                        }}/>

                                        <CustomInput
                                            className={classes.column} labelText="Application Version" id="applicationVersion" required="required"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: this.handleInputChange
                                            }} inputProps={{
                                            value: this.state.applicationVersion,
                                            type: "text",
                                        }}/>

                                        <p style={{width: "15px"}}></p>

                                        <Autocomplete
                                            options={this.state.timezones}
                                            autoHighlight
                                            className={this.props.classes.option}
                                            defaultValue={this.state.timezones[this.state.timezones.indexOf("America/Indiana/Winamac")]}
                                            onChange={(ev, value) => {
                                                if (value) {
                                                    this.setState(
                                                        {
                                                            websiteTimezone: value,
                                                        }
                                                    )
                                                }
                                            }}
                                            getOptionLabel={(option) => option + " (" + moment.tz(option).format("Z z") + ")"}
                                            renderInput={(params) => (
                                                <TextField
                                                    className={this.props.classes.textfield}{...params}
                                                    label="Select Timezone"
                                                    variant="outlined"
                                                />
                                            )}
                                        />

                                        <p style={{width: "15px"}}></p>

                                    </div>
                                    <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit" color="primary" size="lg" className={classes.button}>Save Settings</Button>
                                    <p style={{height: "15px", margin: 0}}>&nbsp;</p>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            },
            seoSettings: () => {
                return(
                    <div className={classes.container}>
                        <div className={classes.profile}>
                            <div className={classes.name}>
                                <form onSubmit={this.validateForm} autoComplete={"off"}>

                                    <CustomInput
                                        className={classes.column} labelText="Default meta title" id="defaultMetaTitle"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                        value: this.state.defaultMetaTitle,
                                        type: "text"
                                    }}/>

                                    <p style={{width: "15px"}}></p>

                                    <div>
                                        <Tooltip title="add website title alongside the pages title">
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.includeWebsiteTitle}

                                                    onChange={async (event, checked) =>{
                                                        this.setState({
                                                            includeWebsiteTitle: checked,
                                                        })
                                                    }
                                                    }
                                                />} label="include site title in the meta title (ex: My Website - Index)"/>
                                        </Tooltip>
                                    </div>

                                    <p style={{width: "15px"}}></p>

                                    <CustomInput
                                        className={classes.column} labelText="Default meta description" id="defaultMetaDescription"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                        value: this.state.defaultMetaDescription,
                                        type: "text"
                                    }}/>

                                    <p style={{width: "15px"}}></p>

                                    <div>
                                        <h4>Upload a favicon (browser icon):</h4>
                                        <label htmlFor="contained-button-file">
                                            <input style={{display: "none"}} accept="image/*" id="contained-button-file" multiple type="file"
                                                   onChange={async (e) =>
                                                       this.setState({
                                                           faviconName: e.target.files[0].name,
                                                           defaultFavicon: await imageHelper.toBase64(e.target.files[0])
                                                       })
                                                   } />
                                            <Button variant="contained" disabled={false} className={classes.button} color="primary" size="md" component="span">
                                                Upload
                                            </Button>
                                        </label>
                                    </div>

                                    <p style={{width: "15px"}}></p>

                                    {
                                        this.state.faviconName ?
                                        <div style={{minHeight: "60px", marginTop: "40px"}}>
                                            <img src={this.state.defaultFavicon} alt={this.state.faviconName} style={{height: "30px", width:"30px"}} />
                                            <h5 style={{fontStyle: "italic", textDecoration:"underline", lineHeight: "0"}}>{this.state.faviconName}</h5>
                                        </div>
                                        : <h5 style={{fontStyle: "italic"}}>no file selected.</h5>
                                    }

                                    <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit" color="primary" size="lg" className={classes.button}>Save Settings</Button>

                                </form>
                            </div>
                        </div>
                    </div>
                )
            },

        }


        return (
            <div style={{padding: "15px 0"}}>
                <Helmet>
                    <title>General Settings</title>
                </Helmet>
                <GridContainer className={classes.grid} justifyContent="center">
                    <GridItem lg={6} md={8} sm={10} xs={12} className={classes.gridItem}>
                        <div className={classNames(classes.main, classes.mainRaised)}>
                            {this.state.notification}
                            {this.state.errors.length ? <Snackbar closeNotification={() => {
                                this.setState({errors: ""})
                            }} open place="tc" color="warning" icon={AddAlert} message={this.state.errors}/> : ''}
                            {content.header()}

                            { this.state.contentType.includes("general") &&
                                content.generalSettings()
                            }

                            { this.state.contentType.includes("seo") &&
                                content.seoSettings()
                            }
                        </div>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(ViewGeneralSettings);

ViewGeneralSettings.propTypes = {
    control: PropTypes.object,
    classes: PropTypes.object,
};
