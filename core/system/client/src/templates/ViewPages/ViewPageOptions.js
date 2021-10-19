import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CustomInput from "../../components/CustomInput/CustomInput";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import {DropzoneArea} from "material-ui-dropzone";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {Checkbox, MuiThemeProvider, TextField} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import clsx from "clsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "../../components/CustomButtons/Button";
import React from "react";
import {Helmet} from "react-helmet";
import Modal from "../../components/Modal/Modal";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {createTheme, withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";


const filter = createFilterOptions()

class ViewPageOptions extends React.PureComponent {

    state = {

    };

    muiTheme = {

    };

    componentDidMount() {
        this.muiTheme = this.createDefaultTheme();
    }

    renderPageOptions() {

        return (
            <MuiThemeProvider theme={this.muiTheme}>
                <Helmet>
                    <title>{this.props.data.editing ? "Edit " : "Add"} {this.props.data.pageTitle || " page"}</title>
                </Helmet>
                <div className={this.props.classes.pageTitleInputWrapper}>
                    <CustomInput
                        labelText={this.props.data.isTemplate ? "Template Title" : "Page Title"}
                        id="pageTitle"
                        formControlProps={{
                            fullWidth: true,
                            onChange: (event) => this.props.handleInputChange(event),
                        }}
                        inputProps={{
                            inputProps: {
                                minLength: "1",
                            },
                            inputRef: this.props.pageTitleRef,
                            value: this.props.data.pageTitle,
                            type: "text",
                        }}
                        error={this.props.data.dialogTitleError}
                    />{" "}
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
                    />}
                </div>
                <div className={this.props.classes.pageOptionsDetails}>
                    <div
                        className={
                            this.props.classes.column +
                            " " +
                            this.props.classes.columnSeparator
                        }
                    >
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
                                    { this.props.data.pageBackgroundColor && <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Tooltip title="Pick a background color">
                                            {this.props.createColorPicker(
                                                "bgColorStyles",
                                                "showBgColorPicker",
                                                "bgColor"
                                            )}
                                        </Tooltip>
                                    </div> }
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Pick a background color">
                                            <span>
                                                <Switch
                                                    value={this.props.data.pageBackgroundColor}
                                                    checked={this.props.data.pageBackgroundColor}
                                                    onChange={() => this.props.handlePageOptions({
                                                        pageBackgroundGradient: false,
                                                        pageBackgroundColor: !this.props.data
                                                            .pageBackgroundColor,
                                                    })
                                                    }
                                                />
                                            Color</span>
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    { this.props.data.pageBackgroundGradient && <div
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
                                    </div> }
                                    <div>
                                        <Typography gutterBottom>
                                            <Tooltip title="Compose a background gradient instead of a solid color">
                                            <span>
                                                <Switch
                                                value={this.props.data.pageBackgroundGradient}
                                                checked={this.props.data.pageBackgroundGradient}
                                                onChange={() => this.props.handlePageOptions({
                                                    pageBackgroundColor: false,
                                                    pageBackgroundImage: false,
                                                    pageBackgroundGradient: !this.props.data
                                                        .pageBackgroundGradient,
                                                })
                                                }
                                            />
                                            Gradient</span>
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
                                           <Switch
                                               value={this.props.data.pageBackgroundImage}
                                               checked={this.props.data.pageBackgroundImage}
                                               onChange={() =>
                                                   this.props.handlePageOptions({
                                                       pageBackgroundGradient: false,
                                                       pageBackgroundImage: !this.props.data.pageBackgroundImage
                                                   })
                                               }
                                           /> Enabled
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
                                { this.props.data.pageBackgroundImage && <Typography gutterBottom>

                                    <Tooltip title="Repeat the background to fit the page">
                                        <span>
                                           <Switch
                                               value={this.props.data.pageBackgroundRepeat}
                                               checked={this.props.data.pageBackgroundRepeat}
                                               onChange={() =>
                                                   this.props.handlePageOptions({
                                                       pageBackgroundRepeat: !this.props.data
                                                           .pageBackgroundRepeat,
                                                   })
                                               }
                                           /> Repeat
                                        </span>
                                    </Tooltip>
                                </Typography> }
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                { this.props.data.pageBackgroundImage && <Typography gutterBottom>

                                    <Tooltip title="Stretch the background to fit the page">
                                        <span>
                                            <Switch
                                                checked={this.props.data.pageBackgroundStretch}
                                                value={this.props.data.pageBackgroundStretch}
                                                onChange={() =>
                                                    this.props.handlePageOptions({
                                                        pageBackgroundStretch: !this.props.data
                                                            .pageBackgroundStretch,
                                                    })
                                                }
                                            /> Stretch
                                        </span>
                                    </Tooltip>
                                </Typography> }
                            </div>
                        </div>
                        { this.props.data.pageBackgroundImage && <div className={this.props.classes.dropzoneAreaWrapper}>
                            <DropzoneArea
                                maxFileSize={Math.pow(1024, 3)}
                                filesLimit={1}
                                onChange={this.props.handleBgImage.bind(this)}
                                onDelete={this.props.handleBackgroundDelete.bind(this)}
                            />
                        </div> }
                    </div>
                    <p/>
                    <div
                        className={
                            this.props.classes.column +
                            " " +
                            this.props.classes.columnSeparator
                        }
                    >
                        <h4>Font </h4>
                        <div style={{marginTop: "15px"}}>

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
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h5>Text Color</h5>
                            {this.props.createColorPicker(
                                "textColorStyles",
                                "showTextColorPicker",
                                "textColor"
                            )}
                        </div>
                    </div>
                    <p/>
                    <div
                        className={clsx(
                            this.props.classes.column,
                            this.props.classes.helper
                        )}
                    >
                        <h4>Miscellaneous</h4>
                        <div style={{marginTop: "15px"}}>
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

                                <Dialog
                                    open={this.props.data.openNewCategory}
                                    onClose={() =>
                                        this.props.handlePageOptions({
                                            dialogValue: {
                                                title: "",
                                                description: "",
                                            },
                                            openNewCategory: false,
                                        })
                                    }
                                    aria-labelledby="form-dialog-title"
                                >
                                    <form onSubmit={this.props.handleNewCategory}>
                                        <DialogTitle
                                            style={{textAlign: "center"}}
                                            id="form-dialog-title"
                                        >
                                            Add a new category
                                        </DialogTitle>
                                        <DialogContent
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-evenly",
                                            }}
                                        >
                                            <TextField
                                                autoFocus
                                                disabled
                                                margin="dense"
                                                id="title"
                                                value={this.props.data.dialogValue.title}
                                                label="title"
                                                type="text"
                                            />

                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="description"
                                                value={this.props.data.dialogValue.description}
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
                                        </DialogContent>
                                        <DialogActions>
                                            <Button type="submit" color="primary">
                                                Add
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.props.handlePageOptions({
                                                        dialogValue: {
                                                            title: "",
                                                            description: "",
                                                        },
                                                        openNewCategory: false,
                                                    })
                                                }
                                                style={{color: this.props.defaultTheme.secondary.main}}
                                            >
                                                Cancel
                                            </Button>

                                        </DialogActions>
                                        {this.props.data.dialogErr && (
                                            <p
                                                style={{
                                                    textAlign: "center",
                                                    color: "red",
                                                }}
                                            >
                                                Category Already Exist Please Check again
                                            </p>
                                        )}
                                    </form>
                                </Dialog>
                            </div>}
                            {!this.props.data.isTemplate &&
                            (!this.props.data.editing ? (
                                <div>
                                    <Autocomplete
                                        id="templateDropdown"
                                        onChange={this.props.handleTemplateChange}
                                        disabled={this.props.data.editing}
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
                            ) : (
                                <div style={{marginBottom: "15px"}}>
                                    Template used:{" "}
                                    <strong>
                                        {this.props.data.template?.label || "none"}
                                    </strong>
                                </div>
                            ))
                            }
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
                                        <span>Publish</span>
                                        <Tooltip title="Enable Publishing">
                                            <Switch
                                                checked={this.props.data.publish}
                                                value={this.props.data.publish}
                                                onChange={() =>
                                                    this.props.handlePageOptions({
                                                        publish: !this.props.data.publish,
                                                    })
                                                }
                                            />
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
                                    <Typography gutterBottom>Default Page</Typography>
                                    <Tooltip title="Set as default page">
                                        <Switch
                                            checked={this.props.data.defaultPage}
                                            value={true}
                                            onChange={() =>
                                                this.props.handlePageOptions({
                                                    defaultPage: !this.props.data.defaultPage,
                                                })
                                            }
                                        />
                                    </Tooltip>
                                </div>
                            </>}
                            <div style={{marginLeft: "-10px"}}>
                                <Checkbox
                                    checked={this.props.data.isTemplate || this.props.location?.state?.templateMode}
                                    disabled={this.props.location?.state?.templateMode}
                                    onChange={(event, checked) =>
                                        this.props.handlePageOptions({
                                            isTemplate: checked,
                                        })
                                    }
                                />
                                <span>Save as template</span>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }

    createDefaultTheme() {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiSwitch: {
                    switchBase: {
                        color: this.props.defaultTheme.primary.main
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
                    removeButton:{
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

        const modalProps = {
            id: "pageOptions",
            name: "pageOptions",
            resize: true,
            title: this.props.data.isTemplate ? "Template Options" : "Page Options",
            content: this.renderPageOptions(),
            showModal: this.props.data.showPageOptionsModal,
            modalSize: "large",
            defaultTheme: this.props.defaultTheme,
            closeButton: {
                callback: (reason) => {
                    if(reason !== 'backdropClick') {
                        this.props.closePageOptionsModal()
                    }
                },
                label: "Close",
            }
        }

        return (
            <Modal { ...modalProps } />
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
    pageTitleRef: PropTypes.object,
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