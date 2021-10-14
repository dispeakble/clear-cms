import React from "react";
import {withStyles, createTheme} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pageBoxEdit.js";
import {
    DeleteForever,
} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import {withRouter} from "react-router-dom";

import Tooltip from "@material-ui/core/Tooltip";

// for speed dial
import Switch from "@material-ui/core/Switch";

// for the dropdown inside each field
import {Accordion, AccordionDetails, AccordionSummary, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for accordion
import {DropzoneArea} from "material-ui-dropzone";

// for the new color picker
import {SketchPicker} from "react-color";
import reactCSS from "reactcss";
import GradientPicker from "../../../components/GradientColorPicker/GradientColorPicker";
import Modal from "../../../components/Modal/Modal";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class ViewBoxAppearance extends React.PureComponent {

    state = {
        FontSizeShow: false,
        FontFamilyShow: false,
        TextColorShow: false,
        BorderColorShow: false,
        BackgroundColorShow: false,
        BackgroundGradientColorShow: false,
        BgString: "",
        BgImage: "",
        BgImageFile: "",
        BorderRadius: null,
        BorderWidth: null,
        BorderColor: "",
        BackgroundColor: "",
        GradientBackgroundColor: "",
        FontSize: null,
        FontFamily: -1,
        FontFamilyOption: null,
        TextColor: "",
        backgroundImageString: "",
        fontFamilies: [
            {label: "Arial"},
            {label: "Calibri"},
            {label: "Cambria"},
            {label: "Times New Roman"},
            {label: "Verdana"}
        ],
        modalPositions: [
            {label: "Top", value: "top"},
            {label: "Center", value: "center"},
            {label: "Bottom", value: "bottom"}
        ],
        displayItemTextColorPicker: false,
        displayItemBgColorPicker: false,
        displayItemBorderColorPicker: false,
        showBgGradientColorPickerModal: false,
        fontUnit: "rem",
        Scrollbars: false,
        BgRepeat: false,
        BgStretch: false,
        itemTextColorStyles: {},
        itemBgColorStyles: {},
        itemBorderColorStyles: {},
        displayColorPicker: false,
        bgGradientColorPickerModal: {
            name: "bgGradientColorPickerModal",
            title: "Gradient Color Picker",
            content: <GradientPicker selectColor={(color) => this.setState({
                gradientColor: color
            })}/>,
            closeButton: {
                callback: () => {
                    this.setState({showBgGradientColorPickerModal: false});
                },
                label: "Cancel",
            },
            confirmButton: {
                show: true,
                callback: async () => {
                    await this.setAsyncState((prevState) => {
                        return {
                            ...prevState,
                            showBgGradientColorPickerModal: false,
                            BackgroundGradientColor: prevState.gradientColor
                        }
                    });
                    this.saveChangedStyle()
                },
                label: "Save",
            },
        },
    };

    defaultTheme = {};
    muiTheme = {};

    async componentDidMount() {
        await this.setAsyncState({
            itemTextColorStyles: this.sendStyles(this.state.TextColor),
            itemBgColorStyles: this.sendStyles(this.state.BackgroundColor),
            itemBorderColorStyles: this.sendStyles(this.state.BorderColor),
        });

        const item = this.props.item;
        await this.setAsyncState({
            muiTheme: this.createDefaultTheme(),
            Scrollbars: item.showScrollbars,
            Title: item.title,
            BorderRadius: item.borderRadius || 0,
            BorderWidth: item.borderWidth || 0,
            BorderColor: item.borderColor,
            BorderColorShow: !!item.borderColor,
            BorderStyle: item.borderStyle,
            FontSize: item.fontSize || 5,
            BackgroundColor: item.backgroundColor || "",
            BackgroundGradientColor: item.backgroundGradientColor || "",
            BgString: item.BgString || "",
            BgImage: item.bgimage || "",
            BgImageFile: item.backgroundImageFile,
            BgRepeat: item.backgroundRepeat,
            BgStretch: item.backgroundStretch,
            FontFamily: this.getFontFamilyIndex(item.fontFamily) || -1,
            TextColor: item.textColor || "",
            BackgroundColorShow: !!item.backgroundColor,
            BackgroundGradientColorShow: !!item.backgroundGradient,
            FontSizeShow: !!item.fontSize,
            FontFamilyShow: !!item.fontFamily,
            TextColorShow: !!item.textColor,
            FontFamilyOption: item.fontFamily ? this.state.fontFamilies[this.getFontFamilyIndex(item.fontFamily)] : null
        });
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    getFontFamilyIndex(name) {
        return this.state.fontFamilies.findIndex((font) => {
            return font.label === name;
        });
    }

    getFontFamilyItem(name) {
        return this.state.fontFamilies[this.state.fontFamilies.findIndex((font) => {
            return font.label === name;
        })];
    }

    handleBorderWidth = async (event, newValue) => {
        await this.setAsyncState({BorderWidth: newValue});
        this.saveChangedStyle();
    };

    handleBorderRadius = async (event, newValue) => {
        await this.setAsyncState({BorderRadius: newValue});
        this.saveChangedStyle();
    };

    handleItemFontSize = async (event, newValue) => {
        await this.setAsyncState({
            FontSize: newValue,
        });
        this.saveChangedStyle();
    };

    handleItemFontFamily = async (event, newValue) => {
        const fontFamily = newValue ? this.getFontFamilyIndex(newValue.label) : "";

        await this.setAsyncState({
            FontFamily: +fontFamily
        });
        this.saveChangedStyle();
    };

    toBase64(file) {//TODO MOVE TO HELPERS
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    handleItemBgImage = async (event) => {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));

            await this.setAsyncState({
                backgroundImageString: strings[0],
                BgImageFile: event[0]
            });

            this.saveChangedStyle();
        }
    };

    handleItemBgRepeat = async () => {
        await this.setAsyncState({
            BgRepeat: !this.state.BgRepeat,
        });

        this.saveChangedStyle();
    };

    handleItemBgStretch = async () => {
        await this.setAsyncState({
            BgStretch: !this.state.BgStretch,
        });

        this.saveChangedStyle();
    };

    saveChangedStyle = () => {
        let item = this.props.item;

        item.title = this.state.Title;
        item.backgroundImageString = this.state.backgroundImageString;
        item.bgimage = this.state.BgImage;
        item.backgroundImageFile = this.state.BgImageFile;
        item.backgroundRepeat = this.state.BgRepeat;
        item.backgroundStretch = this.state.BgStretch;
        item.backgroundGradient = this.state.BackgroundGradientColorShow;

        if (this.state.BackgroundColorShow) {
            item.backgroundColor = this.state.BackgroundColor;
        } else {
            delete item.backgroundColor;
        }

        if (this.state.BackgroundGradientColorShow) {
            item.backgroundGradientColor = this.state.BackgroundGradientColor;
        } else {
            delete item.backgroundGradientColor;
        }

        if (this.state.FontSizeShow) {
            item.fontSize = this.state.FontSize;
        } else {
            delete item.fontSize;
        }

        if (this.state.FontFamilyShow) {
            item.fontFamily = this.state.fontFamilies[
                this.state.FontFamily
                ];

            item.fontFamily = item.fontFamily
                ? item.fontFamily.label
                : "";

            if (!item.fontFamily) {
                delete item.fontFamily;
            }
        } else {
            delete item.fontFamily;
        }

        if (this.state.TextColorShow) {
            item.textColor = this.state.TextColor;
        } else {
            delete item.textColor;
        }

        if (this.state.Scrollbars) {
            item.showScrollbars = this.state.Scrollbars;
        } else {
            delete item.showScrollbars;
        }

        if (Number(this.state.BorderWidth)) {
            item.borderColor = this.state.BorderColor;
            item.borderWidth = this.state.BorderWidth;
            item.borderRadius = this.state.BorderRadius;
            item.borderStyle = "solid";
        } else {
            delete item.borderColor;
            delete item.borderWidth;
            delete item.borderRadius;
            delete item.borderStyle;
        }

        this.props.onUpdate(item);
    };

    handleBgImage(acceptedFiles) {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                // Do whatever you want with the file contents
                //const binaryStr = reader.result;
            };
            reader.readAsArrayBuffer(file);
        });
    }

    // for color pickers

    async handleColorPickerClick (displayColorPicker) {
        await this.setAsyncState({[displayColorPicker]: !this.state.displayColorPicker});
        this.saveChangedStyle();
    }

    async handleColorPickerClose (displayColorPicker) {
        await this.setAsyncState({[displayColorPicker]: false});
        this.saveChangedStyle();
    }

    // for MuiThemeProvider

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiFormControl: {
                    root: {
                        backgroundColor: "white",
                    },
                },
                MuiInputBase: {
                    root: {
                        width: "100%",
                        margin: "0 auto",
                    },
                },
                MuiInputLabel: {
                    formControl: {
                        // width: "90%",
                        marginLeft: "1%",
                    },
                },

                MuiFormLabel: {
                    root: {
                        marginLeft: "5%",
                    },
                },

                MuiAutocomplete: {
                    endAdornment: {
                        position: "absolute",
                        top: "calc(50% - 14px)",
                        right: "0px !important",
                    },
                },
                MuiOutlinedInput: {
                    root: {
                        borderRadius: "",
                        width: "100%",
                        backgroundColor: "white",
                        margin: "0 auto",
                        height: "50px",
                    },
                },
                MuiDropzoneArea: {
                    root: {
                        height: "145px",
                        minHeight: "145px",
                    },
                    text: {
                        fontSize: "1rem",
                    },
                },
                MuiDialog: {
                    paper: {
                        width: "100%",
                    },
                    paperWidthSm: {
                        maxWidth: "100vw",
                    },
                },
            },
        });
    };

    sendStyles = (targetedColor) => {
        return reactCSS({
            default: {
                color: {
                    width: "36px",
                    height: "14px",
                    borderRadius: "2px",
                    background: targetedColor,
                },
                swatch: {
                    padding: "5px",
                    background: "#fff",
                    borderRadius: "1px",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    display: "inline-block",
                    cursor: "pointer",
                    height: "26px"
                },
                popover: {
                    position: "absolute",
                    zIndex: "2",
                },
                cover: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                },
            },
        });
    };


    createColorPicker = (styles, displayColorPicker, targetedColor) => {
        if (!this.state[styles]) {
            return;
        }

        let pickerColor = Object.assign({}, this.state[styles].color);

        pickerColor.background = this.state[targetedColor];

        return (
            <div>
                <div style={{
                    ...this.state[styles].swatch,
                    verticalAlign: "middle"
                }} onClick={() => {
                    this.handleColorPickerClick(displayColorPicker)
                }}>
                    <div style={pickerColor}/>
                </div>
                {this.state[displayColorPicker] ? (
                    <div style={this.state[styles].popover}>
                        <div
                            style={this.state[styles].cover}
                            onClick={() => this.handleColorPickerClose(displayColorPicker)}
                        />
                        <SketchPicker
                            color={this.state[targetedColor]}
                            onChange={async (color) => {
                                await this.setAsyncState({
                                    [targetedColor]: color.hex,
                                });
                                this.saveChangedStyle();
                            }}
                        />
                    </div>
                ) : null}
            </div>
        );
    };

    createGradientColorPicker = (styles, displayColorPicker, targetedColor) => {
        if (!this.state[styles]) {
            return;
        }

        let pickerColor = Object.assign({}, this.state[styles].color);

        pickerColor.background = this.state[targetedColor];

        return (
            <div>
                <div style={this.state[styles].swatch} onClick={() => {
                    this.handleColorPickerClick(displayColorPicker)
                }}>
                    <div style={pickerColor}/>
                </div>
            </div>
        );
    };

    render() {
        return (
            <React.Fragment>
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
                                Font Options
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={this.props.classes.accordionDetails}>
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    <span>Text Color</span>

                                </Typography>
                                <Tooltip title="Enable Custom Text Color">
                                    <Switch
                                        checked={this.state.TextColorShow}
                                        onChange={async () => {
                                            await this.setAsyncState({
                                                TextColor: "#000000",
                                                TextColorShow: !this.state
                                                    .TextColorShow,
                                            });
                                            this.saveChangedStyle();
                                        }}
                                    />
                                </Tooltip>

                            </div>
                            {this.state.TextColorShow && this.createColorPicker(
                                "itemTextColorStyles",
                                "displayItemTextColorPicker",
                                "TextColor"
                            )}
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    <span>Font Size</span>
                                </Typography>
                                <Tooltip title="Enable Custom Font Size">
                                    <Switch
                                        checked={this.state.FontSizeShow}
                                        onChange={async () => {
                                            await this.setAsyncState({
                                                FontSizeShow: !this.state
                                                    .FontSizeShow,
                                            });
                                        }}
                                    />
                                </Tooltip>
                            </div>
                            {this.state.FontSizeShow && <Slider
                                value={this.state.FontSize}
                                onChange={this.handleItemFontSize.bind(this)}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                min={0.1}
                                max={10}
                                step={0.1}
                            />}
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    <span>Font Family</span>
                                </Typography>
                                <Tooltip title="Enable Custom Font Family">
                                    <Switch
                                        checked={this.state.FontFamilyShow}
                                        onChange={async () => {
                                            await this.setAsyncState({
                                                FontFamily: -1,
                                                FontFamilyShow: !this.state
                                                    .FontFamilyShow,
                                            });
                                            this.saveChangedStyle();
                                        }}
                                    />
                                </Tooltip>
                            </div>
                            {this.state.FontFamilyShow &&
                            <div>
                                <Autocomplete
                                    onChange={this.handleItemFontFamily.bind(this)}
                                    className={this.props.classes.option}
                                    value={
                                        this.state.FontFamilyOption
                                    }
                                    options={this.state.fontFamilies}
                                    autoHighlight
                                    getOptionLabel={(option) => option && option.hasOwnProperty('label') ? option.label : ""}
                                    renderInput={(params) => (
                                        <TextField
                                            className={this.props.classes.textfield}
                                            {...params}
                                            label="Select a Font Family"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>}

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
                                Background options
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={this.props.classes.accordionDetails}>
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    Use Scrollbars
                                </Typography>
                                <Tooltip title="This box will have scrollbars if the content is larger">
                                    <Switch
                                        checked={this.state.Scrollbars}
                                        onChange={async () => {
                                            await this.setAsyncState({
                                                Scrollbars: !this.state.Scrollbars,
                                            });
                                            this.saveChangedStyle();
                                        }}
                                    />
                                </Tooltip>
                            </div>
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    <span>Background Color</span>

                                </Typography>
                                <Tooltip title="Enable Custom Text Color">
                                    <Switch
                                        checked={this.state.BackgroundColorShow}
                                        onChange={async () => {
                                            await this.setAsyncState({
                                                BackgroundColorShow: !this.state
                                                    .BackgroundColorShow,
                                            });

                                            this.saveChangedStyle();
                                        }}

                                    />
                                </Tooltip>
                            </div>
                            {this.state.BackgroundColorShow && this.createColorPicker(
                                "itemBgColorStyles",
                                "displayItemBgColorPicker",
                                "BackgroundColor"
                            )}
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    <span>Gradient Color</span>

                                </Typography>
                                <Tooltip title="Enable Gradient Background">
                                    <Switch
                                        checked={this.state.BackgroundGradientColorShow}
                                        onChange={async () => {
                                            await this.setAsyncState({
                                                BackgroundGradientColorShow: !this.state
                                                    .BackgroundGradientColorShow,
                                            });
                                            this.saveChangedStyle();
                                        }}

                                    />
                                </Tooltip>
                            </div>
                            {this.state.BackgroundGradientColorShow && this.createGradientColorPicker(
                                "itemBgColorStyles",
                                "showBgGradientColorPickerModal",
                                "BackgroundGradientColor"
                            )}
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    <span>Background Repeat</span>
                                </Typography>
                                <Tooltip title="Background Repeat">
                                    <Switch
                                        checked={this.state.BgRepeat}
                                        onChange={this.handleItemBgRepeat.bind(this)}
                                    />
                                </Tooltip>
                            </div>
                            <div className={this.props.classes.optionGroup}>
                                <Typography>
                                    Background Stretch
                                </Typography>
                                <Tooltip title="Background Stretch">
                                    <Switch
                                        checked={this.state.BgStretch}
                                        onChange={this.handleItemBgStretch.bind(this)}
                                    />
                                </Tooltip>
                            </div>
                            <div>
                                <Typography>Background Image</Typography>
                                {((this.state.BgImage && this.state.BgImage.length && this.state.BgImage.indexOf('__delete__') === -1)
                                    || (this.state.backgroundImageString && this.state.backgroundImageString.length))
                                && <DeleteForever onClick={async () => {
                                    await this.setAsyncState({
                                        BgImage: `__delete__${this.state.BgImage}`,
                                        BgImageFile: ""
                                    })
                                    this.saveChangedStyle();
                                }} style={{color: this.props.defaultTheme.secondary.main}}/>}
                            </div>
                            <div>
                                <DropzoneArea
                                    maxFileSize={Math.pow(1024, 3)}
                                    filesLimit={1}
                                    className={this.props.classes.dropzone}
                                    onChange={this.handleItemBgImage.bind(this)}
                                />
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
                                Border options
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={this.props.classes.accordionDetails}>
                            <div>
                                <div className={this.props.classes.optionGroup}>
                                    <Typography>
                                        <span>Border Color </span>
                                    </Typography>
                                    <Tooltip title="Enable border color">
                                        <Switch
                                            checked={this.state.BorderColorShow}
                                            onChange={async () => {
                                                await this.setAsyncState({
                                                    TextColor: "#000000",
                                                    BorderColorShow: !this.state
                                                        .BorderColorShow,
                                                });
                                                this.saveChangedStyle();
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                                {this.state.BorderColorShow && this.createColorPicker(
                                    "itemBorderColorStyles",
                                    "displayItemBorderColorPicker",
                                    "BorderColor"
                                )}
                            </div>
                            <div>
                                <Typography><span>Border Width</span></Typography>
                                <Slider
                                    value={this.state.BorderWidth}
                                    className={this.props.classes.sideMenuSlider}
                                    onChange={this.handleBorderWidth.bind(this)}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={10}
                                />
                            </div>
                            <div>
                                <Typography>Border Radius</Typography>
                                <Slider
                                    value={this.state.BorderRadius}
                                    className={this.props.classes.sideMenuSlider}
                                    onChange={this.handleBorderRadius.bind(this)}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={30}
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                <Modal
                    showModal={this.state.showBgGradientColorPickerModal}
                    {...this.state.bgGradientColorPickerModal}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ViewBoxAppearance));

ViewBoxAppearance.propTypes = {
    item: PropTypes.object,
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
    defaultTheme: PropTypes.object
};
