import React, {Component} from "react";
import classNames from "classnames";
import tinycolor from 'tinycolor2'
import {SketchPicker} from "react-color";
import {createTheme, withStyles} from "@material-ui/core/styles";
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
import {AddCircle, Check, Clear, DeleteForever, Edit} from "@material-ui/icons";
import MaterialTable from "material-table";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";

class ViewGeneralSettings extends Component {
    state = {
        tableRef: React.createRef(),
        websiteName: "",
        websiteDomain: "",
        websiteOwner: "",
        websiteAdminEmail: "",
        applicationVersion: "",
        websiteTimezone: "",
        emailSender: "",
        emailPassword: "",
        contactEmail: "",
        selectedTheme: "v1",
        colorScheme: {
            primaryColor: { colorName: "Primary Color",slug:"", hex: "#DC6B03" },
            primaryColorRBG: { colorName: "Primary Color RBG",slug:"", hex: { r: 220, g: 107, b: 3 } },
            primaryColorFadedRBG: { colorName: "Primary Color Faded RBG",slug:"", hex: { r: 252, g: 232, b: 221 } },
            primaryDark: { colorName: "Primary Dark",slug:"", hex: "orange" },
            primaryLight: { colorName: "Primary Light",slug:"", hex: "#FF9F5A" },
            primaryColorHover: { colorName: "Primary Color Hover",slug:"", hex: "#FC8C25" },
            primaryRed: { colorName: "Primary Red",slug:"", hex: "#DC0303" },
            secondaryColor: { colorName: "Secondary Color",slug:"", hex: "#FF0000" },
            accentColor: { colorName: "Accent Color",slug:"", hex: "#f39200" },
            darkRed: { colorName: "Dark Red",slug:"", hex: "#E90000" },
            jetBlack: { colorName: "Jet Black",slug:"", hex: "#333" },
            black: { colorName: "Black",slug:"", hex: "#000" },
            offWhite: { colorName: "Off White",slug:"", hex: "#f5f5f5" },
            white: { colorName: "White",slug:"", hex: "#fff" },
            gray: { colorName: "Gray",slug:"", hex: "#505050" },
            mainBackground: { colorName: "Main Background",slug:"", hex: "#E5E5E5" },
            footerLinks: { colorName: "Footer Links",slug:"", hex: "#868484" },
            greyBorder: { colorName: "Grey Border",slug:"", hex: "#ACACAC" },
            borderOutline: { colorName: "Border Outline",slug:"", hex: "#DBDBDB" }
        },
        colorPickerIsOpen: "",
        validation: {
            websiteName: { valid: false, empty: true },
            websiteDomain: { valid: false, empty: true },
            websiteOwner: { valid: false, empty: true },
            websiteAdminEmail: { valid: false, empty: true },
            applicationVersion: { valid: false, empty: true },
            websiteTimezone: { valid: false, empty: true },
            defaultMetaTitle: { valid: false, empty: true },
            defaultMetaDescription: { valid: false, empty: true },
            defaultFavicon: { valid: false, empty: true },
            faviconName: { valid: false, empty: true },
            defaultWebsiteLogo: { valid: false, empty: true },
            websiteLogo: { valid: false, empty: true },
            includeWebsiteTitle: { valid: false, empty: true },
            emailSender: { valid: false, empty: true },
            emailPassword: { valid: false, empty: true },
            contactEmail: { valid: false, empty: true },
            selectedTheme: { valid: false, empty: true }
        },
        defaultWebsiteLogo: "",
        websiteLogo: "",
        errors: "",
        messages: "",
        notification: "",
        contentType: "general",
        defaultMetaTitle: "",
        defaultMetaDescription: "",
        defaultFavicon: "",
        faviconName: "",
        includeWebsiteTitle: false,
        themeVersions: ["v1", "v2"],
        colorSchemeAccordionIsOpen: false,
        timezones: moment.tz.names(),
        showErrorModal: false,
        errorModal: {
            name: "error",
            title: "Error",
            content: "",
            closeButton: {
                callback: () => {
                    this.setState({ showErrorModal: false });
                },
                label: "Close"
            }
        }
    };
    help = {
        between: (params) => {
            return (params.value > params.min) && (params.value < params.max);
        }
    };
    pickerStyles = {
        default: {
            picker: {
                width: "200px",
                height: "300px",
            }
        }
    };

    setAsyncState = (newState) =>
      new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {

        const generalSettingsData = await this.props.control.get();

        if (generalSettingsData) {
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
            validation.emailSender = {
                valid: true,
                empty: false
            };
            validation.emailPassword = {
                valid: true,
                empty: false
            };
            validation.contactEmail = {
                valid: true,
                empty: false
            };
            validation.websiteLogo = {
                valid: true,
                empty: false
            };
            validation.defaultWebsiteLogo = {
                valid: true,
                empty: false
            };

            if (generalSettingsData.colorScheme) {

                try {
                    const dbColors = JSON.parse(generalSettingsData.colorScheme);

                    const currentScheme = this.state.colorScheme;

                    Object.keys(currentScheme).map((color) => {
                        if (dbColors.hasOwnProperty(color)) {
                            currentScheme[color].value = dbColors[color];
                        }
                    });

                    this.setState({
                        colorScheme: currentScheme
                    });

                } catch (err) {
                    console.log(err);
                }
            }

            if (generalSettingsData.selectedTheme) {
                this.setState({
                    selectedTheme: generalSettingsData.selectedTheme
                });
            }

            this.setState({
                websiteName: generalSettingsData.websiteName,
                websiteDomain: generalSettingsData.websiteDomain,
                websiteOwner: generalSettingsData.websiteOwner,
                colorScheme: generalSettingsData.colorScheme,
                websiteAdminEmail: generalSettingsData.websiteAdminEmail,
                applicationVersion: generalSettingsData.applicationVersion,
                defaultMetaTitle: generalSettingsData.defaultMetaTitle,
                defaultMetaDescription: generalSettingsData.defaultMetaDescription,
                defaultFavicon: generalSettingsData.defaultFavicon,
                faviconName: generalSettingsData.faviconName,
                websiteLogo: generalSettingsData.websiteLogo,
                defaultWebsiteLogo: generalSettingsData.defaultWebsiteLogo,
                includeWebsiteTitle: generalSettingsData.includeWebsiteTitle,
                websiteTimezone: generalSettingsData.websiteTimezone,
                emailSender: generalSettingsData.emailSender,
                emailPassword: generalSettingsData.emailPassword,
                contactEmail: generalSettingsData.contactEmail
            });
        }
    }

    openErrorModal = (message) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                errorModal: {
                    ...prevState.errorModal,
                    content: message
                },
                showErrorModal: true
            };
        });
    };

    refresh = async () => {
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
    };

    tableOptions = {
        getTheme: () => {
            return createTheme({
                palette: this.props.defaultTheme,
                overrides: {
                    MuiTableCell: {
                        head: {
                            "&:last-child": {
                                width: "1px !important",
                                whiteSpace: "nowrap"
                            }
                        }
                    },
                    MuiTypography: {},
                    MuiIcon: {
                        root: {
                            padding: "3px",
                            "&:hover": {
                                backgroundColor: "transparent"
                            }
                        }
                    }
                }
            });
        },
        actions: {
            getData: (query) => {
                return new Promise((resolve) => {

                    (async () => {

                        const payload = {
                            search: query.search,
                            limit: [query.page * query.pageSize, query.pageSize]
                        };

                        if (query.orderBy) {
                            const orderBy = [query.orderBy.field, query.orderDirection];

                            payload.order = [orderBy];
                        }

                        const result = query.search.length > 0 ?
                            Object.keys(this.state.colorScheme).filter((color) => this.state.colorScheme[color].slug.toLowerCase().includes(query.search.toLowerCase())
                                || this.state.colorScheme[color].colorName.toLowerCase().includes(query.search.toLowerCase()))
                                .filter(Boolean)
                                .map((color) => (
                                    {
                                        ...this.state.colorScheme[color],
                                        hex: tinycolor(this.state.colorScheme[color].hex).toHexString(),
                                    }
                                ))

                            : Object.keys(this.state.colorScheme).map((color) => (
                                {
                                    ...this.state.colorScheme[color],
                                    hex: tinycolor(this.state.colorScheme[color].hex).toHexString(),
                                })
                            )

                        if (result) {
                            resolve({
                                data: result,
                                page: query.page,
                                totalCount: result.length
                            });
                        }
                    })();


                });
            },
            editable: {
                onRowAdd: (data) =>
                    // eslint-disable-next-line no-async-promise-executor
                    new Promise(async (resolve, reject) => {
                        if (!data.hex || !data.colorName || !data.slug) {
                            this.openErrorModal("Please, fill in all the fields and try again!");
                            reject();
                        }

                        if(Object.keys(this.state.colorScheme).filter((slug) => data.slug === slug).length > 0){
                            this.openErrorModal("A color with similar slug already exists, please use a unique slug and try again!");
                            reject();
                        }

                        this.setState(
                            {colorScheme: {
                                    ...this.state.colorScheme, ...{
                                        [data.slug]: {
                                            colorName: data.colorName,
                                            slug: data.slug,
                                            hex: data.hex,
                                        }
                                    }
                            }})
                        await this.setData();
                        await this.refresh();
                        resolve();
                    }),
                onRowUpdate: (data, oldData) =>
                    new Promise(async (resolve, reject) => {
                        if (!data.hex || !data.colorName || !data.slug) {
                            this.openErrorModal("Please, fill in all the fields and try again!");
                            reject();
                        }
                        this.setState(
                            {colorScheme: {
                                    ...this.state.colorScheme, ...{
                                        colorName: data.colorName,
                                        slug: data.slug,
                                        hex: data.hex,
                                    }
                                }})
                        await this.setData();
                        await this.refresh();
                        resolve();
                    }),
                onRowDelete: async (data) =>
                {
                    const temp = this.state.colorScheme
                    delete temp[data.slug]
                    this.setState({
                        colorScheme: temp
                    })

                    await this.setData();
                    await this.refresh();
                }
            }
        },
        props: {
            icons: {
                Add: () => <AddCircle
                    style={{ color: this.props.defaultTheme.primary?.main || "green" }}
                    onClick={() => {
                            window.scrollTo(0, document.body.scrollHeight)
                        }
                    }
                />,
                Check: () => (
                    <Check color="primary" />
                ),
                Clear: () => (
                    <Clear color="error" />
                ),
                Edit: () => (
                    <Edit color="primary" />
                ),
                Delete: () => (
                    <DeleteForever color="error" />
                )
            },
            columns: [
                {
                    field: "",
                    title: "",
                    render: color => {
                        if(color.tableData.editing === "update"){
                            return (
                                <SketchPicker
                                    color={this.state.colorScheme[color.slug].hex}
                                    styles={this.pickerStyles}
                                    onChange={(changedColor) => {
                                        const newColor = {};
                                        newColor[color.slug] = {
                                            colorName: color.colorName,
                                            slug: color.slug,
                                            hex: color.hex
                                        };
                                        newColor[color.slug].hex = changedColor.hex

                                        this.setState({
                                            colorScheme: { ...this.state.colorScheme, [color.slug]: newColor[color.slug]}
                                        });
                                    }}
                                />
                            )
                        } if(color.tableData.editable && color.tableData.editing !== "update"){
                            console.log('here', color)
                        }

                        return (
                            <div style={{
                                width: "60px",
                                height: "40px",
                                backgroundColor: color.hex,
                                cursor: "pointer",
                                position: "relative"
                            }}/>
                        )
                    }
                },
                {
                    type: "string",
                    field: "colorName",
                    title: "Color Name"
                },
                {
                    type: "string",
                    field: "slug",
                    title: "Color Slug"
                },
                {
                    type: "string",
                    field: "hex",
                    title: "Hexadecimal"
                }
            ],
            localization: {
                body: {
                    editRow: {
                        deleteText: "Are you sure you want to delete this color?"
                    }
                }
            },
            options: {
                actionsColumnIndex: -1,
                paging: false,
            }
        }
    };

    showMultipleDeleteModal = (evt, data) => {
        this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
    };

    closeMultipleDeleteModal = () => {
        this.setState({ showMultipleDeleteModal: false });
    };

    multipleDeleteCallback = async () => {
        let ids = [];
        this.state.multipleDeleteData.map((client) => ids.push(client.id));
        await this.props.control.rem({
            id: {
                "or": ids
            }
        });
        this.refresh();
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
        this.closeMultipleDeleteModal();
    };

    handleInputChange = async (event) => {
        let errors = this.state.errors;
        if (errors) {
            this.setState({
                errors: ""
            });
        }
        let newState = {};
        let validation = this.state.validation;
        let saveDisabled = false;
        newState[event.target.id] = event.target.value;
        validation[event.target.id].valid = this.help.between({ value: event.target.value.length, min: 3, max: 30 });
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
            errors.push("Email is not valid or not filled in");
        }

        if (!this.state.validation.emailSender) {
            errors.push("Email sender (no-reply) is not valid.");
        }

        if (!this.state.validation.contactEmail) {
            errors.push("Contact email is not valid.");
        }

        if (errors.length) {
            this.setState({
                errors: errors.join(". ")
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
            });
        }, 5000);
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
                websiteLogo: this.state.websiteLogo,
                defaultWebsiteLogo: this.state.defaultWebsiteLogo,
                includeWebsiteTitle: this.state.includeWebsiteTitle,
                websiteTimezone: this.state.websiteTimezone,
                emailSender: this.state.emailSender,
                emailPassword: this.state.emailPassword,
                contactEmail: this.state.contactEmail,
                colorScheme: this.state.colorScheme,
                selectedTheme: this.state.selectedTheme
            }
        });
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
            });
        }
    }

    toggleContentType(type) {
        this.setState({
            contentType: type
        });
    }

    render() {
        const classes = this.props.classes;

        const content = {
            header: () => {
                return (
                  <div className={classes.grid}
                       style={{ display: "flex", justifyContent: "center", padding: "15px 0" }}>
                      <ToggleButtonGroup
                        onChange={this.handleTabChange.bind(this)}
                        value={this.state.contentType}
                        exclusive
                      >
                          <ToggleButton value="general" className={classes.gridItem}
                                        style={{ minHeight: "40px", padding: "10px 25px" }}
                                        onClick={() => this.toggleContentType("general")}>
                              General Settings
                          </ToggleButton>
                          <ToggleButton value="email" className={classes.gridItem}
                                        style={{ minHeight: "40px", padding: "10px 25px" }}
                                        onClick={() => this.toggleContentType("email")}>
                              Email Settings
                          </ToggleButton>
                          <ToggleButton value="theme" className={classes.gridItem}
                                        style={{ minHeight: "40px", padding: "10px 25px" }}
                                        onClick={() => this.toggleContentType("theme")}>
                              Theme Settings
                          </ToggleButton>
                          <ToggleButton value="seo" className={classes.gridItem}
                                        style={{ minHeight: "40px", padding: "10px 25px" }}
                                        onClick={() => this.toggleContentType("seo")}>
                              SEO Settings
                          </ToggleButton>
                      </ToggleButtonGroup>
                  </div>
                );
            },
            generalSettings: () => {
                return (
                  <div className={classes.container}>

                      <div className={classes.profile}>
                          <div className={classes.name}>
                              <form onSubmit={this.validateForm} autoComplete={"off"}>
                                  <div>
                                      <CustomInput
                                        className={classes.column} labelText="Website Name" id="websiteName"
                                        required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                          value: this.state.websiteName,
                                          type: "text"
                                      }} />

                                      <p style={{ width: "15px" }}></p>

                                      <CustomInput
                                        className={classes.column} labelText="Website Domain" id="websiteDomain"
                                        required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                          value: this.state.websiteDomain,
                                          type: "text"
                                      }} />

                                      <p style={{ width: "15px" }}></p>

                                      <CustomInput
                                        className={classes.column} labelText="Website Owner" id="websiteOwner"
                                        required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                          value: this.state.websiteOwner,
                                          type: "text"
                                      }} />

                                      <p style={{ width: "15px" }}></p>

                                      <CustomInput
                                        className={classes.column} labelText="Website Admin Email"
                                        id="websiteAdminEmail"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                          required: true,
                                          value: this.state.websiteAdminEmail,
                                          type: "email"
                                          // endAdornment: (
                                          //     <InputAdornment position="end">
                                          //         <Icon className={classes.inputIconsColor}> email </Icon>
                                          //     </InputAdornment>
                                          // )
                                      }} />

                                      <CustomInput
                                        className={classes.column} labelText="Application Version"
                                        id="applicationVersion" required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: this.handleInputChange
                                        }} inputProps={{
                                          value: this.state.applicationVersion,
                                          type: "text"
                                      }} />

                                      <p style={{ width: "15px" }}></p>

                                      <Autocomplete
                                        options={this.state.timezones}
                                        autoHighlight
                                        className={this.props.classes.option}
                                        defaultValue={this.state.timezones[this.state.timezones.indexOf("America/Indiana/Winamac")]}
                                        onChange={(ev, value) => {
                                            if (value) {
                                                this.setState(
                                                  {
                                                      websiteTimezone: value
                                                  }
                                                );
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

                                      <p style={{ width: "15px" }}></p>

                                  </div>

                                  <div>
                                      <h4>Upload website logo:</h4>
                                      <label htmlFor="contained-button-file">
                                          <input style={{ display: "none" }} accept="image/*" id="contained-button-file"
                                                 multiple type="file"
                                                 onChange={async (e) =>
                                                   this.setState({
                                                       websiteLogo: e.target.files[0].name,
                                                       defaultWebsiteLogo: await imageHelper.toBase64(e.target.files[0])
                                                   })
                                                 } />
                                          <Button variant="contained" disabled={false} className={classes.button}
                                                  color="primary" size="md" component="span">
                                              Choose logo
                                          </Button>
                                      </label>
                                  </div>

                                  <p style={{ width: "15px" }}></p>

                                  {
                                      this.state.websiteLogo ?
                                        <div style={{ minHeight: "60px", marginTop: "40px" }}>
                                            <img src={this.state.defaultWebsiteLogo} alt={this.state.websiteLogo}
                                                 style={{ height: "30px", width: "30px" }} />
                                            <h5 style={{
                                                fontStyle: "italic",
                                                textDecoration: "underline",
                                                lineHeight: "0"
                                            }}>{this.state.websiteLogo}</h5>
                                        </div>
                                        : <h5 style={{ fontStyle: "italic" }}>no file selected.</h5>
                                  }

                                  <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit"
                                          color="primary" size="lg" className={classes.button}>Save Settings</Button>
                                  <p style={{ height: "15px", margin: 0 }}>&nbsp;</p>
                              </form>
                          </div>
                      </div>
                  </div>
                );
            },
            emailSettings: () => {
                return (
                  <div className={classes.container}>
                      <div className={classes.profile}>
                          <div className={classes.name}>
                              <form onSubmit={this.validateForm} autoComplete={"off"}>

                                  <CustomInput
                                    className={classes.column} labelText="Default email sender (no-reply)"
                                    id="emailSender"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: this.handleInputChange
                                    }} inputProps={{
                                      value: this.state.emailSender,
                                      type: "text"
                                  }} />

                                  <p style={{ width: "15px" }}></p>

                                  <CustomInput
                                    className={classes.column} labelText="Default email sender password"
                                    id="emailPassword"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: this.handleInputChange
                                    }} inputProps={{
                                      value: this.state.emailPassword,
                                      type: "password"
                                  }} />

                                  <p style={{ width: "15px" }}></p>

                                  <CustomInput
                                    className={classes.column} labelText="Default contact email" id="contactEmail"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: this.handleInputChange
                                    }} inputProps={{
                                      value: this.state.contactEmail,
                                      type: "text"
                                  }} />

                                  <p style={{ width: "15px" }}></p>

                                  <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit"
                                          color="primary" size="lg" className={classes.button}>Save Email
                                      Settings</Button>

                                  <p style={{ width: "15px" }}></p>

                              </form>
                          </div>
                      </div>
                  </div>
                );
            },
            themeSettings: () => {
                return (
                  <div className={classes.container}>
                      <div className={classes.profile}>
                          <div className={classes.name}>
                              <form onSubmit={this.validateForm} autoComplete={"off"}>
                                  <Autocomplete
                                    options={this.state.themeVersions}
                                    autoHighlight
                                    className={this.props.classes.option}
                                    defaultValue={this.state.selectedTheme ? this.state.selectedTheme : this.state.themeVersions[0]}
                                    onChange={(ev, value) => {
                                        if (value) {
                                            this.setState(
                                              {
                                                  selectedTheme: value
                                              }
                                            );
                                        }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        className={this.props.classes.textfield}{...params}
                                        label="Select Theme Version"
                                        variant="outlined"
                                      />
                                    )}
                                  />

                                  <p style={{ width: "15px" }}></p>

                                  <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                                      <MaterialTable
                                          title="Color options"
                                          tableRef={this.state.tableRef}
                                          columns={this.tableOptions.props.columns}
                                          data={this.tableOptions.actions.getData.bind(this)}
                                          icons={this.tableOptions.props.icons}
                                          options={this.tableOptions.props.options}
                                          editable={this.tableOptions.actions.editable}
                                          actions={this.tableOptions.actions.customActions}
                                          localization={this.tableOptions.props.localization}
                                      />
                                  </MuiThemeProvider>

                                  <p style={{ width: "15px" }}></p>

                                  <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit"
                                          color="primary" size="lg" className={classes.button}>Save Theme
                                      Settings</Button>

                                  <p style={{ width: "15px" }}></p>

                              </form>
                          </div>
                      </div>
                  </div>
                );
            },
            seoSettings: () => {
                return (
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
                                  }} />

                                  <p style={{ width: "15px" }}></p>

                                  <div>
                                      <Tooltip title="add website title alongside the pages title">
                                          <FormControlLabel
                                            control={<Switch
                                              checked={this.state.includeWebsiteTitle}

                                              onChange={async (event, checked) => {
                                                  this.setState({
                                                      includeWebsiteTitle: checked
                                                  });
                                              }
                                              }
                                            />} label="include site title in the meta title (ex: My Website - Index)" />
                                      </Tooltip>
                                  </div>

                                  <p style={{ width: "15px" }}></p>

                                  <CustomInput
                                    className={classes.column} labelText="Default meta description"
                                    id="defaultMetaDescription"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: this.handleInputChange
                                    }} inputProps={{
                                      value: this.state.defaultMetaDescription,
                                      type: "text"
                                  }} />

                                  <p style={{ width: "15px" }}></p>

                                  <div>
                                      <h4>Upload a favicon (browser icon):</h4>
                                      <label htmlFor="contained-button-file">
                                          <input style={{ display: "none" }} accept="image/*" id="contained-button-file"
                                                 multiple type="file"
                                                 onChange={async (e) =>
                                                   this.setState({
                                                       faviconName: e.target.files[0].name,
                                                       defaultFavicon: await imageHelper.toBase64(e.target.files[0])
                                                   })
                                                 } />
                                          <Button variant="contained" disabled={false} className={classes.button}
                                                  color="primary" size="md" component="span">
                                              Upload
                                          </Button>
                                      </label>
                                  </div>

                                  <p style={{ width: "15px" }}></p>

                                  {
                                      this.state.faviconName ?
                                        <div style={{ minHeight: "60px", marginTop: "40px" }}>
                                            <img src={this.state.defaultFavicon} alt={this.state.faviconName}
                                                 style={{ height: "30px", width: "30px" }} />
                                            <h5 style={{
                                                fontStyle: "italic",
                                                textDecoration: "underline",
                                                lineHeight: "0"
                                            }}>{this.state.faviconName}</h5>
                                        </div>
                                        : <h5 style={{ fontStyle: "italic" }}>no file selected.</h5>
                                  }

                                  <Button disabled={this.state.saveDisabled} onClick={this.validateForm} type="submit"
                                          color="primary" size="lg" className={classes.button}>Save Settings</Button>

                              </form>
                          </div>
                      </div>
                  </div>
                );
            }

        };


        return (
          <div style={{ padding: "15px 0" }}>
              <Helmet>
                  <title>General Settings</title>
              </Helmet>
              <GridContainer className={classes.grid} justifyContent="center">
                  <GridItem lg={6} md={8} sm={10} xs={12} className={classes.gridItem}>
                      <div className={classNames(classes.main, classes.mainRaised)}>
                          {this.state.notification}
                          {this.state.errors.length ? <Snackbar closeNotification={() => {
                              this.setState({ errors: "" });
                          }} open place="tc" color="warning" icon={AddAlert} message={this.state.errors} /> : ""}
                          {content.header()}

                          {this.state.contentType.includes("general") &&
                            content.generalSettings()
                          }
                          {this.state.contentType.includes("email") &&
                            content.emailSettings()
                          }
                          {this.state.contentType.includes("theme") &&
                            content.themeSettings()
                          }
                          {this.state.contentType.includes("seo") &&
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
    defaultTheme: PropTypes.object,
    classes: PropTypes.object
};
