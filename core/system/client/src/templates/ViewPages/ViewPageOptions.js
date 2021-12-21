import CustomInput from "../../components/CustomInput/CustomInput";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import {DropzoneArea} from "material-ui-dropzone";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {Button, FormControlLabel, FormGroup, MuiThemeProvider, TextField} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import clsx from "clsx";
import React, {createRef} from "react";
import {Helmet} from "react-helmet";
import Modal from "../../components/Modal/Modal";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {createTheme, withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {ToggleButtonGroup} from "@material-ui/lab";


const filter = createFilterOptions()

class ViewPageOptions extends React.PureComponent {

    state = {
        contentType: "general",
        dialogTitleError: false,
        showNewCategoryModal: false
    };

    addNewCategoryModalProps = {
        id: "newCategory",
        name: "newCategory",
        resize: true,
        title: "Add a new category",
        content: (<div>
            <form onSubmit={this.props.handleNewCategory}>
                <div style={{
                    display: "flex"
                }}>
                    <div style={{
                        flex: 1,
                        marginRight: "10px"
                    }}>
                        <TextField
                            disabled
                            value={this.props.data.dialogValue.title}
                            label="title"
                            type="text"
                        />
                    </div>
                    <div style={{
                        flex: 1,
                        marginLeft: "10px"
                    }}>
                        <TextField
                            autoFocus
                            onChange={(event) =>
                                this.props.handlePageOptions({
                                    dialogValue: {
                                        ...this.props.data.dialogValue,
                                        description: event.target.value,
                                    },
                                })
                            }
                            label="description"
                            type="text"
                        />
                    </div>
                </div>
                <div>
                    {this.props.data.dialogErr && (
                        <Typography color="error">Category Already Exist Please Check again</Typography>
                    )}
                </div>
            </form>
        </div>),
        modalSize: "small",
        defaultTheme: this.props.defaultTheme,
        closeButton: {
            callback: () => {
                this.props.handlePageOptions({
                    dialogValue: {
                        title: "",
                        description: "",
                    },
                    openNewCategory: false,
                })
            },
            label: "Cancel",
        },
        confirmButton: {
            show: true,
            callback: () => {
                this.deleteCallback()
            },
            label: "Add",
        },
    }

    muiTheme = {};

    pageTitleRef = createRef()

    componentDidMount() {
        this.muiTheme = this.createDefaultTheme();
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    toggleContentType(type) {
        this.setState({
            contentType: type
        })
    }

    handleTabChange(event, nextView) {
        if (nextView) {
            this.setState({
                contentType: nextView
            })
        }
    }

    toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    renderPageOptions() {
        return (
            <MuiThemeProvider theme={this.muiTheme}>
                <Helmet>
                    <title>{this.props.data.editing ? "Edit " : "Add"} {this.props.data.pageTitle || " page"}</title>
                </Helmet>
                <FormGroup>
                    {"general" === this.state.contentType && <div>
                        <div style={{display: "flex"}}>
                            <div style={{paddingRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText={this.props.data.isTemplate ? "Template Title" : "Page Title"}
                                    id="pageTitle"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => {
                                            this.setState({
                                                dialogTitleError: false
                                            })
                                            this.props.handleInputChange(event)
                                        }
                                    }}
                                    inputProps={{
                                        onKeyDown: (evt) => {
                                            if (evt.key === "Enter") {
                                                this.props.closePageOptionsModal();
                                                console.log(evt.key);
                                            }

                                        },
                                        autoFocus: true,
                                        inputProps: {
                                            minLength: "1",
                                        },
                                        inputRef: this.pageTitleRef,
                                        value: this.props.data.pageTitle,
                                        type: "text",
                                    }}
                                    error={this.state.dialogTitleError}
                                    style={{marginRight: "5px"}}
                                />
                            </div>
                            <div style={{paddingLeft: "5px", flex: 1}}>
                                {!this.props.data.isTemplate && <CustomInput
                                    labelText="Page Link"
                                    id="pageLink"
                                    required="required"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.props.handleInputChange(event),
                                    }}
                                    inputProps={{
                                        required: true,
                                        inputProps: {
                                            minLength: "3",
                                            maxLength: "50",
                                        },
                                        value: this.props.data.pageLink,
                                        type: "text",
                                    }}
                                    style={{marginLeft: "5px"}}
                                />}
                            </div>
                        </div>
                        <div>
                            {!this.props.data.isTemplate &&
                                <div>
                                    <Autocomplete
                                        id="categoryDropdown"
                                        onChange={this.props.handleCategory}
                                        onInputChange={this.props.handleCategoryUniqueness}
                                        className={this.props.classes.option}
                                        value={this.props.data.currentCategory}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);
                                            if (
                                                params.inputValue !== "" &&
                                                this.props.data.isUniqueTitle
                                            ) {
                                                filtered.push({
                                                    value: params.inputValue,
                                                    label: `Add "${params.inputValue}"`,
                                                });
                                            }
                                            return filtered;
                                        }}
                                        options={this.props.data.flatCategories}
                                        autoHighlight
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField
                                                className={this.props.classes.textfield}
                                                label="Select a category"
                                                {...params}
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                    <Modal
                                        showModal={this.props.data.openNewCategory}
                                        {...this.addNewCategoryModalProps}
                                    />
                                </div>}
                        </div>
                        <div>
                            {!this.props.data.isTemplate &&
                                <>
                                    <div>
                                        <Typography
                                            gutterBottom
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Enable Publishing">
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.props.data.publish}
                                                        onChange={() =>
                                                            this.props.handlePageOptions({
                                                                publish: !this.props.data.publish,
                                                            })
                                                        }
                                                    />}
                                                    label="Publish"/>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Tooltip title="Set as default page">
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.props.data.defaultPage}
                                                    onChange={() =>
                                                        this.props.handlePageOptions({
                                                            defaultPage: !this.props.data.defaultPage,
                                                        })
                                                    }
                                                />}
                                                label="Default Page"/>
                                        </Tooltip>
                                    </div>
                                </>}
                            <div style={{marginTop: "20px"}}>
                                <div>
                                    <h4>Upload a favicon (browser icon) :</h4>
                                    <label htmlFor="contained-button-file">
                                        <input style={{display: "none"}} accept="image/*" id="contained-button-file" multiple type="file"
                                               onChange={async (e) =>
                                                   this.props.handlePageOptions({
                                                       pageFavicon : await this.toBase64(e.target.files[0])
                                                   })
                                               } />
                                        <Button variant="contained" component="span">
                                            Upload
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {"appearance" === this.state.contentType && <div>
                        <div style={{flex: 1}}>
                            <h4>Background Color</h4>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div style={{display: "block"}}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        {this.props.data.pageBackgroundColor && <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Pick a background color">
                                                <FormControlLabel
                                                    control={this.props.createColorPicker(
                                                        "bgColorStyles",
                                                        "showBgColorPicker",
                                                        "bgColor"
                                                    )} label=""/>
                                            </Tooltip>
                                        </div>}
                                        <div>
                                            <Typography gutterBottom>
                                                <Tooltip title="Pick a background color">
                                            <span>
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.props.data.pageBackgroundColor}
                                                        onChange={() => this.props.handlePageOptions({
                                                            pageBackgroundGradient: false,
                                                            pageBackgroundColor: !this.props.data.pageBackgroundColor
                                                        })
                                                        }
                                                    />}
                                                    label="Color"/>
                                            </span>
                                                </Tooltip>
                                            </Typography>
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        {this.props.data.pageBackgroundGradient && <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip title="Pick gradient colors">
                                                {this.props.createGradientColorPicker(
                                                    "bgColorStyles",
                                                    "showBgGradientColorPickerModal",
                                                    "bgGradientColor"
                                                )}
                                            </Tooltip>
                                        </div>}
                                        <div>
                                            <Typography gutterBottom>
                                                <Tooltip
                                                    title="Compose a background gradient instead of a solid color">
                                            <span>
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.props.data.pageBackgroundGradient}
                                                        onChange={() => this.props.handlePageOptions({
                                                            pageBackgroundColor: false,
                                                            pageBackgroundImage: false,
                                                            pageBackgroundGradient: !this.props.data
                                                                .pageBackgroundGradient,
                                                        })
                                                        }
                                                    />}
                                                    label="Gradient"/>
                                            </span>
                                                </Tooltip>
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h4>Background Image</h4>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography gutterBottom>

                                        <Tooltip title="This page will have a background image">
                                        <span>
                                           <FormControlLabel
                                               control={<Switch
                                                   checked={this.props.data.pageBackgroundImage}
                                                   onChange={() =>
                                                       this.props.handlePageOptions({
                                                           pageBackgroundGradient: false,
                                                           pageBackgroundImage: !this.props.data.pageBackgroundImage
                                                       })
                                                   }
                                               />}
                                               label="Enabled"/>
                                        </span>
                                        </Tooltip>
                                    </Typography>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {this.props.data.pageBackgroundImage && <Typography gutterBottom>

                                        <Tooltip title="Repeat the background to fit the page">
                                        <span>
                                           <FormControlLabel
                                               control={<Switch
                                                   checked={this.props.data.pageBackgroundRepeat}
                                                   onChange={() =>
                                                       this.props.handlePageOptions({
                                                           pageBackgroundRepeat: !this.props.data
                                                               .pageBackgroundRepeat,
                                                       })
                                                   }
                                               />}
                                               label="Repeat"/>
                                        </span>
                                        </Tooltip>
                                    </Typography>}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {this.props.data.pageBackgroundImage && <Typography gutterBottom>

                                        <Tooltip title="Stretch the background to fit the page">
                                        <span>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.props.data.pageBackgroundStretch}
                                                    onChange={() =>
                                                        this.props.handlePageOptions({
                                                            pageBackgroundStretch: !this.props.data
                                                                .pageBackgroundStretch,
                                                        })
                                                    }
                                                />}
                                                label="Stretch"/>
                                        </span>
                                        </Tooltip>
                                    </Typography>}
                                </div>
                            </div>
                            {this.props.data.pageBackgroundImage &&
                                <div className={this.props.classes.dropzoneAreaWrapper}>
                                    <DropzoneArea
                                        maxFileSize={Math.pow(1024, 3)}
                                        filesLimit={1}
                                        onChange={this.props.handleBgImage.bind(this)}
                                        onDelete={this.props.handleBackgroundDelete.bind(this)}
                                    />
                                </div>}
                        </div>
                        <div style={{flex: 1}}>
                            <div>
                                <h4>Font </h4>
                                <div style={{marginTop: "15px"}}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Tooltip title="Chose the default text color">
                                            <Typography gutterBottom>
                                                <FormControlLabel
                                                    control={
                                                        this.props.createColorPicker(
                                                            "textColorStyles",
                                                            "showTextColorPicker",
                                                            "textColor"
                                                        )} label="Text color"/>
                                            </Typography>

                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Autocomplete
                                            id="fontFamilyDropdown"
                                            onChange={this.props.handleFontFamily}
                                            className={this.props.classes.option}
                                            options={this.props.data.fontFamilies}
                                            autoHighlight
                                            getOptionLabel={(option) => option.family}
                                            value={this.getFontFamilyItem(
                                                this.props.data.fontFamily
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    className={this.props.classes.textfield}
                                                    {...params}
                                                    label="Select a Font Family"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </div>

                                    <Typography gutterBottom>Font Size</Typography>
                                    <Slider
                                        className={this.props.classes.pageOptionsSlider}
                                        onChange={(event, newValue) => {
                                            this.props.handleFontSize(event, newValue);
                                        }}
                                        value={this.props.data.fontSize}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        min={0.1}
                                        max={10}
                                        step={0.1}
                                    />
                                </div>
                            </div>
                            <div>
                                <Typography gutterBottom>Box Spacing</Typography>
                                <Slider
                                    className={this.props.classes.pageOptionsSlider}
                                    onChange={this.props.handleBoxSpacing}
                                    value={this.props.data.config.layoutBoxSpacing[0]}
                                    getAriaValueText={() =>
                                        this.props.data.config.layoutBoxSpacing[0] + " pixels"
                                    }
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={150}
                                />
                            </div>
                        </div>
                    </div>}
                    {"advanced" === this.state.contentType && <div>
                        <div
                            className={clsx(
                                this.props.classes.column,
                                this.props.classes.helper
                            )}
                        >
                            <h4>Miscellaneous</h4>
                            <div style={{marginTop: "15px"}}>

                                <div>
                                    <Tooltip title="This page will be saved as a template">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.props.data.isTemplate || this.props.location?.state?.templateMode}
                                                disabled={this.props.location?.state?.templateMode}
                                                onChange={(event, checked) =>
                                                    this.props.handlePageOptions({
                                                        isTemplate: checked,
                                                    })
                                                }
                                            />} label="Save as template"/>
                                    </Tooltip>
                                </div>

                                {!this.props.data.isTemplate && (
                                    <div>
                                        <Autocomplete
                                            id="templateDropdown"
                                            onChange={this.props.handleTemplateChange}
                                            className={this.props.classes.option}
                                            options={this.props.data.templates}
                                            autoHighlight
                                            getOptionLabel={(option) => option.label}
                                            // value={this.props.data.template}
                                            renderInput={(params) => (
                                                <TextField
                                                    className={this.props.classes.textfield}
                                                    {...params}
                                                    label="Select a template"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </div>
                                )}

                                {this.props.data.isTemplate && (
                                    <div style={{marginBottom: "15px"}}>
                                        Template used:{" "}
                                        <strong>
                                            {this.props.data.template?.label || "none"}
                                        </strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>}

                    {"seo" === this.state.contentType &&
                        <div className={clsx(
                            this.props.classes.column,
                            this.props.classes.helper
                        )}>
                            <h4>SEO meta attributes:</h4>
                            <div style={{marginTop: "25px"}}>

                                <div>
                                    <TextField
                                        className={this.props.classes.textfield}
                                        value={this.props.data.pageMetaTitle}
                                        onChange={(e) =>
                                            this.props.handlePageOptions({
                                                pageMetaTitle: e.target.value
                                            })}
                                        label="meta title"
                                        variant="outlined"
                                    />
                                </div>
                                <div>
                                    <Tooltip title="add website title alongside the title">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.props.data.useWebsiteTitle}

                                                onChange={(event, checked) =>
                                                    this.props.handlePageOptions({
                                                        useWebsiteTitle: checked,
                                                    })
                                                }
                                            />} label="include site title in the meta title (ex: Facebook - Index)"/>
                                    </Tooltip>
                                </div>
                            </div>
                            <div style={{marginTop: "15px"}}>
                                <div>
                                    <TextField
                                        className={this.props.classes.textfield}
                                        label="meta description"
                                        value={this.props.data.pageMetaDescription}
                                        onChange={(e) =>
                                            this.props.handlePageOptions({
                                                pageMetaDescription: e.target.value
                                            })}
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                        </div>
                    }

                </FormGroup>
            </MuiThemeProvider>
        )
    }

    createDefaultTheme() {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiSwitch: {
                    switchBase: {
                        color: this.props?.defaultTheme?.primary?.main
                    }
                },
                MuiDropzoneArea: {
                    root: {
                        height: "auto",
                        minHeight: "145px",
                    },
                    text: {
                        fontSize: "1rem",
                        margin: "0 !important",
                    },
                    textContainer: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }
                },
                MuiDropzonePreviewList: {
                    removeButton: {
                        display: "none"
                    },
                    root: {
                        width: "100%",
                        margin: "0 !important",
                    },
                    image: {
                        height: "auto !important",
                    },
                    imageContainer: {
                        maxWidth: "100%",
                        flexBasis: "100%",
                        padding: "0 !important",
                        width: "100% !important",
                    }
                }
            }
        });
    }

    render() {

        const classes = this.props.classes;

        const header = (
            <div className={classes.boxOptionsHeader}>
                <div>{this.props.data.isTemplate ? "Template Options" : "Page Options"}</div>
                <ToggleButtonGroup
                    onChange={this.handleTabChange.bind(this)}
                    value={this.state.contentType}
                    exclusive
                >
                    <ToggleButton value="general" onClick={() => this.toggleContentType("general")}>
                        General
                    </ToggleButton>
                    <ToggleButton value="appearance" onClick={() => this.toggleContentType("appearance")}>
                        Appearance
                    </ToggleButton>
                    <ToggleButton value="advanced" onClick={() => this.toggleContentType("advanced")}>
                        Advanced
                    </ToggleButton>
                    <ToggleButton value="seo" onClick={() => this.toggleContentType("seo")}>
                        SEO
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

        )

        const modalProps = {
            id: "pageOptions",
            name: "pageOptions",
            resize: true,
            title: header,
            content: this.renderPageOptions(),
            showModal: this.props.data.showPageOptionsModal,
            modalSize: "large",
            defaultTheme: this.props.defaultTheme,
            closeButton: {
                callback: async (reason) => {
                    if (reason !== 'backdropClick') {
                        if (this.props.data.pageTitle.length === 0) {
                            await this.setAsyncState({
                                dialogTitleError: true,
                                contentType: "general"
                            });
                            this.pageTitleRef.current.focus();
                            return;
                        }

                        this.props.closePageOptionsModal()
                    }
                },
                label: "Close",
            }
        }

        return (
            <Modal {...modalProps} />
        )
    }

    getFontFamilyItem(name) {
        return this.props.data.fontFamilies[
            this.props.data.fontFamilies.findIndex((font) => {
                return font.family === name;
            })
            ];
    }
}

export default withStyles(styles)(ViewPageOptions);

ViewPageOptions.propTypes = {
    data: PropTypes.object,
    classes: PropTypes.object,
    location: PropTypes.object,
    closePageOptionsModal: PropTypes.func,
    handleInputChange: PropTypes.func,
    handlePageOptions: PropTypes.func,
    handleBoxSpacing: PropTypes.func,
    handleTemplateChange: PropTypes.func,
    handleNewCategory: PropTypes.func,
    handleCategoryUniqueness: PropTypes.func,
    createColorPicker: PropTypes.func,
    handleCategory: PropTypes.func,
    handleFontSize: PropTypes.func,
    handleFontFamily: PropTypes.func,
    handleBackgroundDelete: PropTypes.func,
    handleBgImage: PropTypes.func,
    createGradientColorPicker: PropTypes.func,
    defaultTheme: PropTypes.object
};