import React from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {
    DeleteForever,
} from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { withRouter } from "react-router-dom";

import Tooltip from "@material-ui/core/Tooltip";

// for speed dial
import Switch from "@material-ui/core/Switch";

// for the dropdown inside each field
import {Paper, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for the styling side-menu
import Drawer from "@material-ui/core/Drawer";

// for accordion
import { DropzoneArea } from "material-ui-dropzone";

// for the new color picker
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

class ViewBoxEditor extends React.PureComponent {

    state = {
        temporaryModuleOptions: {},
        modulesList: [//TODO GET THESE VALUES FROM A LIST IN DB
            { label: "Header Module" },
            { label: "Menu Module" },
            { label: "Text Module" },
            { label: "Gallery Module" },
            { label: "Calendar Module" },
            { label: "Video Module" },
            { label: "Audio Module" },
            { label: "Banner Module" },
            { label: "Chart Module" },
            { label: "Table Module" },
            { label: "Accordion Module" }
        ],
        editItemFontSizeShow: false,
        editItemFontFamilyShow: false,
        editItemTextColorShow: false,
        editItemBackgroundColorShow: false,
        editItemTitle: "",
        editItemModule: "",
        editItemBgString: "",
        backgroundImageString: "",
        editItemBgImage: "",
        editItemBgImageFile: "",
        editItemBorderRadius: null,
        editItemBorderWidth: null,
        editItemBorderColor: "",
        editItemBackgroundColor: "",
        editItemFontSize: null,
        editItemFontFamily: -1,
        editItemFontFamilyOption: null,
        editItemSelectedModule: null,
        editItemTextColor: "",
        itemModuleEditId: "",
        fontFamilies: [
            { label: "Arial" },
            { label: "Calibri" },
            { label: "Cambria" },
            { label: "Times New Roman" },
            { label: "Verdana" }
        ],
        displayItemTextColorPicker: false,
        displayItemBgColorPicker: false,
        displayItemBorderColorPicker: false,
        fontUnit: "px",
        editItemModuleOptions: {},
        editModuleOptions: "",
        editItemScrollbars: false,
        editItemBgRepeat: false,
        editItemBgStretch: false,
        itemTextColorStyles: {},
        itemBgColorStyles: {},
        itemBorderColorStyles: {},
        displayColorPicker: false
    };

    defaultTheme = {};
    muiTheme = {};

    async componentDidMount() {
        await this.setAsyncState({
            itemTextColorStyles: this.sendStyles(this.state.editItemTextColor),
            itemBgColorStyles: this.sendStyles(this.state.editItemBackgroundColor),
            itemBorderColorStyles: this.sendStyles(this.state.editItemBorderColor),
        });


        const item = this.props.data.item;
        await this.setAsyncState({
            editItemScrollbars: item.showScrollbars,
            editItemTitle: item.title,
            editItemModule: this.getModuleIndex(item.module),
            editItemModuleOptions: item.moduleOptions,
            editItemBorderRadius: item.borderRadius || 0,
            editItemBorderWidth: item.borderWidth || 0,
            editItemBorderColor: item.borderColor,
            editItemBorderStyle: item.borderStyle,
            editItemFontSize: item.fontSize || 5,
            editItemBackgroundColor: item.backgroundColor || "",
            editItemBgString: item.editItemBgString || "",
            editItemBgImage: item.bgimage || "",
            editItemBgImageFile: item.backgroundImageFile,
            editItemBgRepeat: item.backgroundRepeat,
            editItemBgStretch: item.backgroundStretch,
            editItemFontFamily: this.getFontFamilyIndex(item.fontFamily) || -1,
            editItemTextColor: item.textColor || "",
            editItemBackgroundColorShow: item.hasOwnProperty("backgroundColor"),
            editItemFontSizeShow: item.hasOwnProperty("fontSize"),
            editItemFontFamilyShow: item.hasOwnProperty("fontFamily"),
            editItemTextColorShow: item.hasOwnProperty("textColor"),
            editItemFontFamilyOption: item.fontFamily ? this.state.fontFamilies[this.getFontFamilyIndex(item.fontFamily)] : null,
            editItemSelectedModule: item.module && item.module.length ? this.state.modulesList[this.getModuleIndex(item.module)] : null
        });
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    setTemporaryModuleOptions = (id, data, isVertical) => {
        let allTempModuleOptions = this.state.temporaryModuleOptions;
        allTempModuleOptions[Number(id)] = { data: data, isVertical: isVertical };
        this.setState({ temporaryModuleOptions: allTempModuleOptions });
    };

    getItemById = (passedId) => {
        return this.state.items.find((item) => item.i === passedId);
    };

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "moduleOptions":
                this.setState({ editModuleOptions: event.target.value });
                break;
            case "itemTitle":
                await this.setAsyncState({ editItemTitle: event.target.value + "" });
                break;
            default:
                break;
        }
    };

    closeDiscardModal() {
        this.setState({ showDiscardModal: false });
    }

    closeModuleOptionsModal() {
        this.setState({ showModuleOptionsModal: false });
    }

    getFontFamilyIndex(name) {
        return this.state.fontFamilies.findIndex((font) => {
            return font.label === name;
        });
    }

    getModuleIndex(name) {
        return this.state.modulesList.findIndex((mod) => {
            return mod.label === name;
        });
    }

    getFontFamilyItem(name) {
        return this.state.fontFamilies[
            this.state.fontFamilies.findIndex((font) => {
                return font.label === name;
            })
            ];
    }

    handleDiscard = () => {
        this.setState({ showDiscardModal: true });
    };

    handleModuleOptions = async (id) => {
        await this.setAsyncState({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };


    saveModuleOptions = async (passedId, data, isVertical) => {
        let items = [...this.state.items];

        let item = this.getItemById(passedId);

        item.moduleOptions = { data: data, isVertical: isVertical };

        let itemIndex = items.findIndex(
            (item) => Number(item.i) === Number(passedId)
        );

        items[itemIndex] = item;

        await this.setAsyncState({ items });
    };

    handleBorderWidth = async (event, newValue) => {
        await this.setAsyncState({ editItemBorderWidth: newValue });
    };

    handleBorderRadius = async (event, newValue) => {
        await this.setAsyncState({ editItemBorderRadius: newValue });
    };

    handleItemFontSize = async (event, newValue) => {
        await this.setAsyncState({
            editItemFontSize: newValue,
        });
    };

    handleItemFontFamily = async (event, newValue) => {
        const fontFamily = newValue ? this.getFontFamilyIndex(newValue.label) : "";

        await this.setAsyncState({
            editItemFontFamily: +fontFamily
        });
    };

    handleItemModule = async (event, newValue) => {
        if (!newValue || !newValue.label) {
            return;
        }
        await this.setAsyncState({
            editItemModule: this.getModuleIndex(newValue.label)
        });
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

            this.setState({
                backgroundImageString: strings[0],
                editItemBgImageFile: event[0]
            });
        }
    };

    handleItemBgRepeat = async (event) => {
        this.setState({
            editItemBgRepeat: !this.state.editItemBgRepeat,
        });
    };

    handleItemBgStretch = async (event) => {
        this.setState({
            editItemBgStretch: !this.state.editItemBgStretch,
        });
    };

    closeEditSideMenu = () => {
        this.props.onCancel();
    };

    saveChangedStyle = () => {
        let item = this.props.data.item;

        item.title = this.state.editItemTitle;
        item.module = this.state.modulesList[this.state.editItemModule];
        item.module = item.module ? item.module.label : "";
        item.backgroundImageString = this.state.backgroundImageString;
        item.bgimage = this.state.editItemBgImage;
        item.backgroundImageFile = this.state.editItemBgImageFile;
        item.backgroundRepeat = this.state.editItemBgRepeat;
        item.backgroundStretch = this.state.editItemBgStretch;

        //foundItem.moduleOptions = this.state.moduleOptions;

        if (this.state.editItemBackgroundColorShow) {
            item.backgroundColor = this.state.editItemBackgroundColor;
        } else {
            delete item.backgroundColor;
        }

        if (this.state.editItemFontSizeShow) {
            item.fontSize = this.state.editItemFontSize;
        } else {
            delete item.fontSize;
        }

        if (this.state.editItemFontFamilyShow) {
            item.fontFamily = this.state.fontFamilies[
                this.state.editItemFontFamily
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

        if (this.state.editItemTextColorShow) {
            item.textColor = this.state.editItemTextColor;
        } else {
            delete item.textColor;
        }

        if (this.state.editItemScrollbars) {
            item.showScrollbars = this.state.editItemScrollbars;
        } else {
            delete item.showScrollbars;
        }

        if (Number(this.state.editItemBorderWidth)) {
            item.borderColor = this.state.editItemBorderColor;
            item.borderWidth = this.state.editItemBorderWidth;
            item.borderRadius = this.state.editItemBorderRadius;
            item.borderStyle = "solid";
        } else {
            delete item.borderColor;
            delete item.borderWidth;
            delete item.borderRadius;
            delete item.borderStyle;
        }

        this.props.onSave(item);

        this.closeEditSideMenu();
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

    // for MuiThemeProvider

    createDefaultTheme = () => {
        return createMuiTheme({
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

    // for color pickers

    handleColorPickerClick = (displayColorPicker) => {
        this.setState({ [displayColorPicker]: !this.state.displayColorPicker });
    };

    handleColorPickerClose = (displayColorPicker) => {
        this.setState({ [displayColorPicker]: false });
    };

    createColorPicker = (styles, displayColorPicker, targetedColor) => {
        if (!this.state[styles]) {
            return;
        }

        let pickerColor = Object.assign({}, this.state[styles].color);

        pickerColor.background = this.state[targetedColor];

        return (
            <React.Fragment>
                <div
                    style={{
                        ...this.state[styles].swatch,
                        verticalAlign: "middle"
                    }}
                    onClick={() => this.handleColorPickerClick(displayColorPicker)}
                >
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
                            onChange={(color) => {
                                this.setState({
                                    [targetedColor]: color.hex,
                                });
                            }}
                        />
                    </div>
                ) : null}
            </React.Fragment>
        );
    };

    render() {
        return (
            <React.Fragment>
                <MuiThemeProvider theme={this.muiTheme}>
                    <Drawer
                        BackdropProps={{ invisible: true }}
                        variant="temporary"
                        anchor={"left"}
                        open={true}
                        onClose={this.handleEditMenu}
                        className={this.props.classes.sideMenu}
                    >
                        <div className={this.props.classes.sideMenuEditor}>
                            <div className={this.props.classes.sideMenuEditorForm}>
                                <div>
                                    <CustomInput
                                        labelText="Title"
                                        id="itemTitle"
                                        required="required"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: (event) => this.handleInputChange(event),
                                        }}
                                        inputProps={{
                                            value: this.state.editItemTitle,
                                            type: "text",
                                        }}
                                    />
                                </div>
                                <div>
                                    <Autocomplete
                                        onChange={this.handleItemModule.bind(this)}
                                        className={this.props.classes.option}
                                        value={
                                            this.state.editItemSelectedModule
                                        }
                                        options={this.state.modulesList}
                                        autoHighlight
                                        getOptionLabel={(option) => option && option.hasOwnProperty('label') ? option.label : ""}
                                        renderInput={(params) => (
                                            <TextField
                                                className={this.props.classes.textfield}
                                                {...params}
                                                label="Select a module"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        <span>Font Size</span>
                                    </Typography>
                                    <Tooltip title="Enable Custom Font Size">
                                        <Switch
                                            checked={this.state.editItemFontSizeShow}
                                            onChange={() => {
                                                this.setState({
                                                    editItemFontSizeShow: !this.state
                                                        .editItemFontSizeShow,
                                                });
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                                <div>
                                    {this.state.editItemFontSizeShow && <Slider
                                        value={this.state.editItemFontSize}
                                        onChange={this.handleItemFontSize.bind(this)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        min={5}
                                        max={50}
                                    />}
                                </div>
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        <span>Font Family</span>
                                    </Typography>
                                    <Tooltip title="Enable Custom Font Family">
                                        <Switch
                                            checked={this.state.editItemFontFamilyShow}
                                            onChange={() => {
                                                this.setState({
                                                    editItemFontFamily: -1,
                                                    editItemFontFamilyShow: !this.state
                                                        .editItemFontFamilyShow,
                                                });
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                                <div>
                                    {this.state.editItemFontFamilyShow &&
                                    <div>
                                        <Autocomplete
                                            onChange={this.handleItemFontFamily.bind(this)}
                                            className={this.props.classes.option}
                                            value={
                                                this.state.editItemFontFamilyOption
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
                                </div>
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        <span>Text Color</span>

                                    </Typography>
                                    <Tooltip title="Enable Custom Text Color">
                                        <Switch
                                            checked={this.state.editItemTextColorShow}
                                            onChange={() => {
                                                this.setState({
                                                    editItemTextColor: "#000000",
                                                    editItemTextColorShow: !this.state
                                                        .editItemTextColorShow,
                                                });
                                            }}
                                        />
                                    </Tooltip>

                                </div>
                                {this.state.editItemTextColorShow && this.createColorPicker(
                                    "itemTextColorStyles",
                                    "displayItemTextColorPicker",
                                    "editItemTextColor"
                                )}
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        <span>Background Color</span>

                                    </Typography>
                                    <Tooltip title="Enable Custom Text Color">
                                        <Switch
                                            checked={this.state.editItemBackgroundColorShow}
                                            onChange={() => {
                                                this.setState({
                                                    editItemBackgroundColorShow: !this.state
                                                        .editItemBackgroundColorShow,
                                                });
                                            }}

                                        />
                                    </Tooltip>

                                </div>
                                {this.state.editItemBackgroundColorShow && this.createColorPicker(
                                    "itemBgColorStyles",
                                    "displayItemBgColorPicker",
                                    "editItemBackgroundColor"
                                )}
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        <span>Border Color </span>
                                    </Typography>
                                    {this.createColorPicker(
                                        "itemBorderColorStyles",
                                        "displayItemBorderColorPicker",
                                        "editItemBorderColor"
                                    )}

                                </div>
                                <div>
                                    <Typography><span>Border Width</span></Typography>
                                    <Slider
                                        value={this.state.editItemBorderWidth}
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
                                        value={this.state.editItemBorderRadius}
                                        className={this.props.classes.sideMenuSlider}
                                        onChange={this.handleBorderRadius.bind(this)}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={30}
                                    />
                                </div>
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        Scrollbars
                                    </Typography>
                                    <Tooltip title="Show scrollbars if the content exceeds the box">
                                        <Switch
                                            checked={this.state.editItemScrollbars}
                                            onChange={() => {
                                                this.setState({
                                                    editItemScrollbars: !this.state
                                                        .editItemScrollbars,
                                                });
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                                <div className={this.props.classes.sideMenuOption}>

                                    <Typography>Background Image</Typography>
                                    {((this.state.editItemBgImage && this.state.editItemBgImage.length && this.state.editItemBgImage.indexOf('__delete__') === -1)
                                        || (this.state.backgroundImageString && this.state.backgroundImageString.length))
                                    && <DeleteForever onClick={() => {this.setState({
                                        editItemBgImage: `__delete__${this.state.editItemBgImage}`,
                                        editItemBgImageFile: ""
                                    })}} style={{color: this.props.defaultTheme.secondary.main}}/>}
                                </div>
                                <div className={this.props.classes.dropzoneAreaWrapper}>
                                    <DropzoneArea
                                        filesLimit={1}
                                        className={this.props.classes.dropzone}
                                        onChange={this.handleItemBgImage.bind(this)}
                                    />
                                </div>
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        <span>Background Repeat</span>
                                    </Typography>
                                    <Tooltip title="Background Repeat">
                                        <Switch
                                            checked={this.state.editItemBgRepeat}
                                            onChange={this.handleItemBgRepeat.bind(this)}
                                        />
                                    </Tooltip>
                                </div>
                                <div className={this.props.classes.sideMenuOption}>
                                    <Typography>
                                        Background Stretch
                                    </Typography>
                                    <Tooltip title="Background Stretch">
                                        <Switch
                                            checked={this.state.editItemBgStretch}
                                            onChange={this.handleItemBgStretch.bind(this)}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <Paper className={this.props.classes.sideMenuActionHolder}>
                            <Button className={this.props.classes.sideMenuSaveBtn} color="primary"
                                onClick={() => {
                                    this.saveChangedStyle();
                                }}
                            >Save</Button>
                            <Button className={this.props.classes.sideMenuCancelBtn} color="danger"
                                onClick={() => {
                                    this.closeEditSideMenu();
                                }}
                            >Cancel</Button>
                        </Paper>
                    </Drawer>
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ViewBoxEditor));
