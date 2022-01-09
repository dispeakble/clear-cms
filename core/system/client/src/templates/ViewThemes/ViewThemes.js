import React, {Component} from "react";
import {withStyles, createTheme} from "@material-ui/core/styles";

import Editor from "./themeEditor/src/screen/editor";

import styles from "assets/jss/clear-crm/views/themes.js";
import Button from "components/CustomButtons/Button.js";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/Icon";
import {
    DeleteForever,
    Edit,
    Add as AddIcon,
    Image,
    FontDownload,
    ShoppingCart,
    Book,
    Announcement, Share, AlternateEmail
} from "@material-ui/icons";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// for 'new theme' modal
import Switch from "@material-ui/core/Switch";

// for the new color picker
import reactCSS from "reactcss";

import {DropzoneArea} from "material-ui-dropzone";
import Slider from "@material-ui/core/Slider";

// for the dropdown inside each field
import {FormControlLabel, FormGroup, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import {Helmet} from "react-helmet";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";

import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import ColorEditionSquare from "./themeEditor/src/component/color-edition-square";
import Modal from "../../components/Modal/Modal";

class ViewThemes extends Component {
    state = {
        id: "",
        side: 0,
        themes: [],
        createModal: false,
        showDeleteModal: false,
        data: {
            title: "",
            bgColor: "",
            bgImage: "",
            bgRepeat: false,
            bgStretch: false,
            bgGradient: false,
            fontSize: 13,
            textColor: "#000000",
            fontFamily: "Arial",
            isDefault: false,
            thumbnail: "",
            boxSpacing: 10
        },
        defaults: {
            title: "",
            bgColor: "",
            bgImage: "",
            bgRepeat: false,
            bgStretch: false,
            bgGradient: false,
            fontSize: 13,
            textColor: "#000000",
            fontFamily: "Arial",
            isDefault: false,
            thumbnail: "",
            boxSpacing: 10
        },
        onPublic: false,
        onAdmin: false,
        editMode: false,
        displayBgColorPicker: false,
        displayTextColorPicker: false,
        fontFamilies: [
            {label: "Arial, sans-serif, serif"},
            {label: "Calibri, sans-serif, serif"},
            {label: "Cambria, serif"},
            {label: "Times New Roman, serif"},
            {label: "Verdana, sans-serif"},
        ],
        showRemoveThemeModal: false,
        itemToRemoveId: 0,

        fontFamilyIndex: 0,
        fullEditorData: {},
        showEmptyTitleMessage: false,
        publicType: 0,
        preview: false,
        colorPickerAnchor: null
    };

    deleteModal = {
        name: "deleteModal",
        title: "Delete Theme",
        content: <div>Are you sure you want delete this theme?</div>,
        closeButton: {
            callback: () => this.closeRemoveThemeModal(),
            label: "Cancel",
        },
        confirmButton: {
            callback: () => this.onRemoveItem(),
            label: "Proceed",
        },
    }

    colorPickerAnchorOrigin = {
        vertical: "bottom",
        horizontal: "left",
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => {
            return this.setState(newState, resolve);
        });

    async componentDidMount() {
        let path = this.props.hist.location.pathname.split("/");
        let side = path[2] === "public" ? 0 : 1;

        await this.setAsyncState({side});

        this.getThemes();

    }

    getThemes = async () => {
        const themes = await this.props.control.list({type: this.state.side ? "admin" : "public"});

        if (themes && Array.isArray(themes)) {
            this.setState({themes});
        }
    }

    showRemoveThemeModal = (id) => {
        this.setState({showDeleteModal: true, itemToRemoveId: id});
    };

    closeRemoveThemeModal = () => {
        this.setState({showDeleteModal: false});
    };

    onRemoveItem = async () => {
        await this.props.control.rem({
            type: this.state.side ? "admin" : "public",
            data: {"id": this.state.itemToRemoveId}
        });

        this.setState({
            itemToRemoveId: 0
        });

        this.closeRemoveThemeModal();
        await this.getThemes();
    };

    enableAddMode = () => {
        this.setState({
            data: Object.assign({}, this.state.defaults),
        });
    };
    data;

    enableEditMode = async (id) => {

        const theme = await this.props.control.get({
            type: this.state.side ? 'admin' : 'public',
            data: {id: id}
        });

        theme.isDefault = !!theme.isDefault;
        theme.id = id;

        const data = theme;

        let fullEditorData = createTheme({
            palette: this.state.side ? JSON.parse(data.data) : JSON.parse(data.mui),
        });

        if (fullEditorData) {
            await this.setAsyncState({
                fullEditorData,
            });
        }

        await this.setAsyncState({
            data,
        });

        if (this.state.side === 0) {
            await this.setAsyncState({
                fontFamilyIndex: this.getFontFamilyIndex(theme.fontfamily)
            })
        }

        await this.setAsyncState({
            editMode: true,
            createModal: true,
        });
    };

    disableEditMode = () => {
        this.setAsyncState({editMode: false});
    };

    adminThemeList = () => {
        const createTheme = (theme) => {
            return (
                <React.Fragment key={theme.id}>
                    <Card
                        className={this.props.classes.root}
                    >
                        <CardActionArea>
                            <CardMedia
                                onClick={() => this.enableEditMode(theme.id)}
                                style={{backgroundSize: "contain"}}
                                className={this.props.classes.media}
                                image={theme.thumbnail}
                            />
                            <CardContent style={{textAlign: "center"}}>
                                {theme.title}
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={{justifyContent: "flex-end"}}>
                            <Tooltip title="Edit Theme" arrow={true} placement="top">
                                <IconButton
                                    onClick={() => this.enableEditMode(theme.id)}
                                    style={{cursor: "pointer"}}
                                    color="primary"
                                    size="medium"
                                >
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Theme" arrow={true} placement="top">
                                <IconButton
                                    onClick={() => {
                                        this.showRemoveThemeModal(theme.id);
                                    }}
                                    style={{cursor: "pointer"}}
                                    color="error"
                                    size="medium"
                                >
                                    <DeleteForever/>
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                </React.Fragment>
            );
        };

        return (
            <div className={this.props.classes.outerWrapper}>
                <div className={this.props.classes.themesWrapper}>
                    {this.state.themes.map((theme) => createTheme(theme))}
                </div>
            </div>
        );
    };

    closeColorPicker = () => {
        this.setState({
            colorPickerAnchor: null
        })
    };

    openColorPicker = (event) => {
        this.setState({colorPickerAnchor: event.currentTarget});
    };

    changeColorPicker = (name, value) => {
        let data = this.state.data;
        data[name] = `rgba(${value.rgb.r}, ${value.rgb.g}, ${value.rgb.b}, ${value.rgb.a})`;
        this.setState({
            data: data
        });
    };

    createColorPicker = (targetedColor, icon) => {
        return (
            <ColorEditionSquare
                customIcon={icon}
                name={targetedColor}
                onChange={this.changeColorPicker}
                value={this.state.data[targetedColor]}
            />
        );
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

    handleFontSize = (event, newValue) => {
        return newValue;
    };

    handleFontFamily = (event, newValue) => {
        let data = this.state.data;
        data.fontFamily = newValue.label;

        let fontFamilyIndex = this.getFontFamilyIndex(newValue.label);

        this.setState({data, fontFamilyIndex});
    };

    getFontFamilyIndex(name) {
        return this.state.fontFamilies.findIndex((font) => {
            return font.label === name;
        });
    }

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    handleBgImage = async (event) => {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toBase64(file)));

            let data = this.state.data;
            data.bgImage = strings[0];

            await this.setAsyncState({data});
        }
    };

    capturePreview = async () => {
        const previewEl = document.getElementById(this.state.side ? "adminPreviewElement" : "previewElement");
        return html2canvas(previewEl);
    }

    save = async () => {

        if (!this.state.data.title || !this.state.data.title.length) {
            await this.setAsyncState({
                showEmptyTitleMessage: true,
            });
            return;
        } else {
            this.setAsyncState({
                showEmptyTitleMessage: false,
            });
        }

        if (!this.state.side) {
            let data = this.state.data;

            data.bgRepeat = this.state.data.bgRepeat;
            data.bgStretch = this.state.data.bgStretch;
            data.bgGradient = this.state.data.bgGradient;
            data.fontSize = this.state.data.fontSize;
            data.fontFamily = this.state.data.fontFamily;
            data.boxSpacing = this.state.data.boxSpacing;
            await this.setAsyncState({data});
            await this.setAsyncState({publicType: this.state.side});
        }
        const previewEl = document.getElementById(this.state.side ? "adminPreviewElement" : "previewElement");
        if (this.state.side) {
            previewEl.style.flex = "none";
            previewEl.style.width = "auto";
            previewEl.style.whiteSpace = "nowrap";
            await this.setAsyncState({
                preview: true
            })
        } else {
            previewEl.style.width = '564px';//magic number :)
        }

        const canvas = await html2canvas(previewEl);
        let base64image;

        const oc = document.createElement('canvas'),
            octx = oc.getContext('2d');
        oc.height = 400;
        oc.width = (oc.height / canvas.height) * canvas.width;
        octx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
            0, 0, oc.width, oc.height);
        base64image = oc.toDataURL("image/png");
        const data = JSON.stringify(this.themeEditor.state.theme.palette);

        this.setState({
            createModal: false,
            preview: false,
            fullEditorData: {}
        })

        if (this.state.side) {//admin
            if (this.state.editMode) {
                await this.props.control.set({
                    type: "admin",
                    where: {id: this.state.data.id},
                    data: {
                        title: this.state.data.title,
                        isDefault: this.state.data.isDefault ? 1 : 0,
                        thumbnail: base64image,
                        data: data
                    }
                })
            } else {
                console.log("entered FIRST")
                await this.props.control.add({
                    type: "admin", data: {
                        title: this.state.data.title,
                        isDefault: this.state.data.isDefault ? 1 : 0,
                        thumbnail: base64image,
                        data: data
                    }
                })
            }
        } else {

            const theme = {
                title: this.state.data.title,
                isDefault: this.state.data.isDefault ? 1 : 0,
                bgColor: this.state.data.bgColor,
                bgImage: this.state.data.bgImage,
                fontSize: this.state.data.fontSize,
                textColor: this.state.data.textColor,
                fontFamily: this.state.data.fontFamily,
                boxSpacing: this.state.data.boxSpacing,
                bgRepeat: this.state.data.bgRepeat ? 1 : 0,
                bgStretch: this.state.data.bgStretch ? 1 : 0,
                bgGradient: this.state.data.bgGradient ? 1 : 0,
                thumbnail: base64image,
                mui: data
            };

            if (this.state.editMode) {
                await this.props.control.set({
                    type: "public",
                    where: {id: this.state.data.id},
                    data: theme
                })
            } else {
                await this.props.control.add({
                    type: "public",
                    data: theme
                })
            }
        }

        if (this.state.data.isDefault) {
            window.location.reload();
        } else {
            await this.getThemes();
        }
    };

    cancel = async () => {
        this.disableEditMode();
        this.setState({
            createModal: false,
            showEmptyTitleMessage: false,
        });
    }

    getFontFamilyItem(name) {
        return this.state.fontFamilies[
            this.state.fontFamilies.findIndex((font) => {
                return font.label === name;
            })
            ];
    }

    openEditor() {

        let a13yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                "aria-controls": `simple-tabpanel-${index}`,
            };
        };

        return (
            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                onMouseEnter={() => {
                    let data = this.state.data;
                    data.isDefault = !!data.isDefault;
                    this.setState({data});
                }}
                style={{width: "100%"}}
                onBackdropClick={() => "false"}
                classes={{
                    root: this.props.classes.center,
                    paper: this.props.classes.themeModal,
                }}
                open={true}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={this.props.classes.modalHeader}
                >
                    <h4 style={{textAlign: "center"}}>
                        {this.state.editMode ? "Edit Theme" : "New Theme"}
                    </h4>
                </DialogTitle>
                <DialogContent
                    style={{overflow: "auto"}}
                    id="classic-modal-slide-description"
                    className={this.props.classes.modalBody}
                >

                    {this.state.side ? (
                        <React.Fragment>
                            <FormGroup>
                                <div className={this.props.classes.modalHeadWrapper}>
                                    <div>
                                        {this.state.showEmptyTitleMessage ? (
                                            <div style={{fontWeight: 900, color: "red"}}>
                                                Please type in a title for this theme
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <CustomInput
                                            labelText="Theme Title"
                                            id="themeTitle"
                                            required="required"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: (event) => {
                                                    let data = this.state.data;
                                                    data.title = event.target.value;
                                                    this.setState({data});
                                                },
                                            }}
                                            inputProps={{
                                                inputProps: {
                                                    minLength: "3",
                                                    maxLength: "50",
                                                },
                                                defaultValue: this.state.data.title,

                                                type: "text",
                                            }}
                                        />
                                    </div>
                                </div>
                                <Editor
                                    preview={this.state.preview}
                                    currentTheme={
                                        this.state.editMode ? this.state.fullEditorData : {}
                                    }
                                    style={{height: "100%", display: "block"}}
                                    ref={(editor) => {
                                        this.themeEditor = editor;
                                    }}
                                />
                            </FormGroup>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className={this.props.classes.modalHeadWrapper}>
                                <div>
                                    <AppBar position="static" style={{width: "100%"}}>
                                        <Tabs
                                            value={this.state.publicType}
                                            onChange={this.togglePublicType}
                                        >
                                            <Tab label="Basic Editor" {...a13yProps(0)} />
                                            <Tab label="Material UI Theme Editor" {...a13yProps(1)} />
                                        </Tabs>
                                    </AppBar>
                                </div>

                                {this.state.showEmptyTitleMessage ? (
                                    <div style={{fontWeight: 900, color: "red"}}>
                                        Please type in a title for this theme
                                    </div>
                                ) : (
                                    ""
                                )}

                                <div style={{display: "flex"}}>
                                    <div style={{flex: 1}}>
                                        <CustomInput
                                            labelText="Theme Title"
                                            id="themeTitle"
                                            required="required"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: (event) => {
                                                    let data = this.state.data;
                                                    data.title = event.target.value;
                                                    this.setState({data});
                                                },
                                            }}
                                            inputProps={{
                                                inputProps: {
                                                    minLength: "3",
                                                    maxLength: "50",
                                                },
                                                defaultValue: this.state.data.title,

                                                type: "text",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{height: "100%", display: this.state.publicType === 1 ? "block" : "none"}}>
                                <Editor
                                    currentTheme={
                                        this.state.editMode ? this.state.fullEditorData : {}
                                    }
                                    classes={{
                                        root: {
                                            backgroundColor: this.props.theme?.palette.background.paper
                                        }
                                    }}
                                    style={{
                                        height: "100%",
                                        backgroundColor: this.props.theme?.palette.paper.main
                                    }}
                                    ref={(editor) => {
                                        this.themeEditor = editor;
                                    }}
                                />
                            </div>

                            <div style={{display: this.state.publicType === 0 ? "block" : "none"}}>
                                <div className={this.props.classes.newThemeStylesWrapper}>
                                    <div className={this.props.classes.column}>
                                        <div style={{display: "flex"}}>

                                            <Tooltip title="Set the default font family for the whole page" arrow={true}
                                                     placement="top">
                                                <Autocomplete
                                                    id="fontFamilyDropdown"
                                                    onChange={this.handleFontFamily}
                                                    style={{flex: 1}}
                                                    options={this.state.fontFamilies}
                                                    autoHighlight
                                                    getOptionLabel={(option) => option.label}
                                                    value={
                                                        this.state.fontFamilies[this.state.fontFamilyIndex]
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            className={this.props.classes.textfield}
                                                            {...params}
                                                            label="Font Family"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Tooltip>
                                            <span style={{flex: 1, textAlign: "center"}}>
                                                <Tooltip title="Set the default text color for the whole page"
                                                         arrow={true} placement="top">
                                                <FormControlLabel
                                                    control={
                                                        this.createColorPicker(
                                                            "textcolor",
                                                            FontDownload
                                                        )
                                                    }
                                                    label="Text color"
                                                />
                                            </Tooltip>
                                            </span>


                                            <Tooltip title="Set the default text size for the whole page" arrow={true}
                                                     placement="top">
                                                <FormControlLabel
                                                    style={{flex: 1}}
                                                    control={
                                                        <Slider
                                                            key={`slider-font-size`}
                                                            className={this.props.classes.pageOptionsSlider}
                                                            onChange={(event, newValue) => {
                                                                let data = this.state.data;
                                                                data.fontSize = newValue;
                                                                this.setState({data});
                                                            }}
                                                            value={this.state.data.fontSize}
                                                            aria-labelledby="discrete-slider"
                                                            valueLabelDisplay="auto"
                                                            min={5}
                                                            max={50}
                                                        />
                                                    }
                                                    labelPlacement="top"
                                                    label="Text size"
                                                />
                                            </Tooltip>
                                        </div>

                                    </div>
                                    <div
                                        className={this.props.classes.column + " " + this.props.classes.columnSeparator}>
                                        <div style={{display: "flex"}}>
                                            <Tooltip title="Set the default background color" arrow={true}
                                                     placement="top">
                                                <FormControlLabel
                                                    style={{flex: 1}}
                                                    control={
                                                        this.createColorPicker("bgcolor", Image)
                                                    }
                                                    label="Background Color"
                                                />
                                            </Tooltip>

                                            <Tooltip title="Repeats the background image on the whole page" arrow={true}
                                                     placement="top">
                                                <FormControlLabel
                                                    style={{flex: 1}}
                                                    control={
                                                        <Switch
                                                            checked={!this.state.side && this.state.data.bgRepeat}
                                                            onChange={(event) => {
                                                                let data = this.state.data;
                                                                data.bgRepeat = event.target.checked;
                                                                this.setState({data});
                                                            }}
                                                        />
                                                    }
                                                    label="Background Repeat"
                                                />
                                            </Tooltip>
                                            <Tooltip title="Stretches the background image on the whole page"
                                                     arrow={true} placement="top">
                                                <FormControlLabel
                                                    style={{flex: 1}}
                                                    control={
                                                        <Switch
                                                            checked={!this.state.side && this.state.data.bgStretch}
                                                            onChange={(event) => {
                                                                let data = this.state.data;
                                                                data.bgStretch = event.target.checked;
                                                                this.setState({data});
                                                            }}
                                                        />
                                                    }
                                                    label="Background Stretch"
                                                />
                                            </Tooltip>

                                        </div>
                                        <div className={this.props.classes.dropzoneAreaWrapper}>
                                            <Tooltip title="Select the background image" arrow={true} placement="top">
                                                <DropzoneArea onChange={this.handleBgImage.bind(this)}/>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div
                                        className={this.props.classes.column + " " + this.props.classes.columnSeparator}>
                                        <Tooltip title="Adjust the spacing between boxes or modules" arrow={true}
                                                 placement="top">
                                            <FormControlLabel
                                                style={{display: "flex"}}
                                                control={
                                                    <Slider
                                                        key={`slider-box-spacing`}
                                                        className={this.props.classes.pageOptionsSlider}
                                                        onChange={(event, newValue) => {
                                                            let data = this.state.data;
                                                            data.boxSpacing = newValue;
                                                            this.setState({
                                                                data
                                                            });
                                                        }}
                                                        value={this.state.data.boxSpacing}
                                                        aria-labelledby="discrete-slider"
                                                        valueLabelDisplay="auto"
                                                        min={0}
                                                        max={150}
                                                    />
                                                }
                                                labelPlacement="top"
                                                label="Box spacing"
                                            />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div>
                                    <h4 className={this.props.classes.previewHead}>Preview</h4>
                                    <div id="previewElement" style={{
                                        minWidth: "350px"
                                    }}>
                                        <div style={{
                                            minWidth: "350px",
                                            margin: "0 auto",
                                            padding: "10px",
                                            backgroundColor: this.state.data.bgColor,
                                            backgroundImage: `url(${this.state.data.bgImage})`,
                                            color: this.state.data.textColor,
                                            fontSize: this.state.data.fontSize,
                                            fontFamily: this.state.data.fontFamily,
                                            backgroundRepeat: this.state.data.bgRepeat
                                                ? "repeat"
                                                : "no-repeat",
                                            backgroundSize: this.state.data.bgStretch
                                                ? "cover"
                                                : "auto",
                                        }}>
                                            <AppBar
                                                style={{
                                                    backgroundColor: this.state.data.bgColor,
                                                    color: "inherit",
                                                    fontSize: "inherit",
                                                    fontFamily: "inherit",
                                                    paddingLeft: "10px",
                                                    marginBottom: this.state.data.boxSpacing,
                                                    boxShadow: "none",
                                                    border: "1px solid grey"
                                                }}
                                                position="static"
                                            >
                                                <p style={{fontSize: "inherit", fontFamily: "inherit"}}>Home page</p>
                                            </AppBar>

                                            <div className={this.props.classes.previewBodyWrapper}>
                                                <List
                                                    style={{
                                                        backgroundColor: this.state.data.bgColor,
                                                        fontSize: "inherit",
                                                        fontFamily: this.state.data.fontFamily,
                                                        minWidth: "150px"

                                                    }}
                                                    className={this.props.classes.previewList}
                                                    component="nav"
                                                    aria-label="main mailbox folders"
                                                >
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <InboxIcon/>
                                                        </ListItemIcon>
                                                        <ListItemText className={this.props.classes.previewMenu}
                                                                      primary="Home"/>
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <ShoppingCart/>
                                                        </ListItemIcon>
                                                        <ListItemText className={this.props.classes.previewMenu}
                                                                      primary="Products"/>
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <Book/>
                                                        </ListItemIcon>
                                                        <ListItemText className={this.props.classes.previewMenu}
                                                                      primary="Blog"/>
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <Announcement/>
                                                        </ListItemIcon>
                                                        <ListItemText className={this.props.classes.previewMenu}
                                                                      primary="Newsletter"/>
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <Share/>
                                                        </ListItemIcon>
                                                        <ListItemText className={this.props.classes.previewMenu}
                                                                      primary="Social"/>
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <AlternateEmail/>
                                                        </ListItemIcon>
                                                        <ListItemText className={this.props.classes.previewMenu}
                                                                      primary="Contact us"/>
                                                    </ListItem>
                                                </List>
                                                <div id="publicPreview" className={this.props.classes.previewText}
                                                     style={{
                                                         marginLeft: this.state.data.boxSpacing,
                                                         backgroundColor: this.state.data.bgColor,
                                                         padding: "10px"
                                                     }}>
                                                    <h4>
                                                        <b>Web Design</b>
                                                    </h4>
                                                    &nbsp;&nbsp; Web design encompasses many different
                                                    skills and disciplines in the production and maintenance
                                                    of websites. The different areas of web design include
                                                    web graphic design; user interface design (UI design);
                                                    authoring, including standardised code and proprietary
                                                    software; user experience design (UX design); and search
                                                    engine optimization. Often many individuals will work in
                                                    teams covering different aspects of the design process,
                                                    although some designers will cover them all.[1] The term
                                                    &quot;web design&quot; is normally used to describe the design
                                                    process relating to the front-end (client side) design
                                                    of a website including writing markup. Web design
                                                    partially overlaps web engineering in the broader scope
                                                    of web development. Web designers are expected to have
                                                    an awareness of usability and if their role involves
                                                    creating markup then they are also expected to be up to
                                                    date with web accessibility guidelines.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </DialogContent>

                <DialogActions className={this.props.classes.modalFooter}>
                    <Tooltip title="Set as default theme for all pages" arrow={true} placement="top">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.data.isDefault}
                                    onChange={(event) => {
                                        let data = this.state.data;
                                        data.isDefault = event.target.checked;
                                        this.setState({data});
                                    }}
                                />
                            }
                            label="Default Theme"
                        />
                    </Tooltip>
                    <Button color="primary" onClick={this.save}>Save</Button>
                    <Button color="danger" onClick={this.cancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

    togglePublicType = (event, newValue) => {
        this.setState({publicType: newValue, showEmptyTitleMessage: false});
    };

    render() {
        let a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                "aria-controls": `simple-tabpanel-${index}`,
            };
        };

        return (
            <React.Fragment>
                <Helmet>
                    <title>Themes</title>
                </Helmet>
                <AppBar position="static" style={{marginTop: "52px"}}>
                    <Tabs
                        value={this.state.side}
                        indicatorColor="secondary"
                    >
                        <Tab label="Public" href="/themes/public" component="a" onClick={(event) => {
                            setTimeout(() => {
                                this.props.hist.push("/themes/public")
                            }, 250);

                            event.preventDefault();
                        }} {...a11yProps(0)} />
                        <Tab label="Admin" href="/themes/admin" component="a" onClick={(event) => {
                            setTimeout(() => {
                                this.props.hist.push("/themes/admin")
                            }, 250);
                            event.preventDefault();
                        }} {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <div style={{display: "flex", "& > :lastChild": {marginRight: "0px"}}}>
                    {this.adminThemeList()}
                </div>
                <div
                    style={{
                        position: "fixed",
                        bottom: "1rem",
                        right: "1rem",
                    }}
                >
                    <Tooltip title="Add new theme" arrow={true} placement="top">
                        <Fab
                            onClick={() => {
                                this.enableAddMode();

                                this.setState({createModal: true});
                            }}
                            color="primary"
                            aria-label="add"
                        >
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </div>
                {this.state.createModal ? this.openEditor() : ""}
                <Modal
                    showModal={this.state.showDeleteModal}
                    {...this.deleteModal}
                />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ViewThemes);

ViewThemes.propTypes = {
    classes: PropTypes.object,
    hist: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    control: PropTypes.object,
    theme: PropTypes.object,
};