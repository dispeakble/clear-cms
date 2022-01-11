import React, {createRef} from "react";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";

import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {FormControlLabel, FormGroup, MuiThemeProvider, TextField, Slider, Switch, FormLabel} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {ToggleButtonGroup} from "@material-ui/lab";

import clsx from "clsx";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {createTheme, withStyles} from "@material-ui/core/styles";

import GradientColorPicker from "../../components/GradientColorPicker/GradientColorPicker";
import CustomInput from "../../components/CustomInput/CustomInput";
import Modal from "../../components/Modal/Modal";

import imageHelper from "../../helpers/image.helper";
import ColorPicker from "../../components/ColorPicker/ColorPicker";
import Button from "../../components/CustomButtons/Button";

const filter = createFilterOptions()

class ViewPageOptions extends React.PureComponent {
    state = {
        title: "",
        link: "",
        description: "",
        isHome: false,
        active: false,

        hasBackgroundImage: false,
        hasBackgroundRepeat: false,
        hasBackgroundStretch: false,

        hasBackgroundColor: false,
        hasBackgroundGradient: false,
        backgroundColor: "",
        backgroundGradient: "",
        textColor: "",
        fontFamily: "",
        fontSize: 11,

        contentType: "general",
        dialogTitleError: false,

        flatCategories: [],
        showNewCategoryModal: false,
        uniqueCategory: false,
        selectedCategories: [],
        newCategoryData: {
            title: "",
            description: ""
        },

        showTextColorPicker: false,
        showItemTextColorPicker: false,
        config: {
            layoutBoxSpacing: [10, 10],
            layoutBoxPadding: {
                lg: [0, 0],
                md: [0, 0],
                sm: [0, 0],
                xs: [0, 0],
                xxs: [0, 0],
            },
        },

    };

    imageUploader = null;
    textColorRef = null;
    muiTheme = {};
    titleRef = createRef()

    componentDidMount() {
        this.muiTheme = this.createDefaultTheme();

        this.setState({
            title: this.props.data.title,
            link: this.props.data.link,
            description: this.props.data.description,
            isHome: this.props.data.isHome,
            backgroundColor: this.props.data.backgroundColor,
            textColor: this.props.data.textColor,
        });

        this.getAllCategories();
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

    async getAllCategories() {
        let result = [];

        let categoriesFromStorage = await this.props.control.listCategories();

        let categories = [];

        if (categoriesFromStorage?.count) {
            categoriesFromStorage.rows.map((category) => {
                categories.push({
                    label: category.title,
                    id: category.id,
                    parentId: category.parentId,
                });
                return category;
            });
        }

        if (categories.length) {
            categories.map((el) => {
                let catName = el.label;
                if (el.parentId) {
                    catName = this.getNestedCategories(el.parentId) + "/" + el.label;
                }
                result.push({
                    id: el.id,
                    label: catName,
                });
                return el;
            });

            await this.setAsyncState({
                flatCategories: result,
            });
        }
    }

    getNestedCategories(id) {
        let link = this.state.categories.find((el) => el.id === id);
        let result = link.label || "";
        if (link && link.parentId) {
            result = this.getNestedCategories(link.parentId) + "/" + result;
        }
        return result;
    }

    handleNewCategory = async () => {
        const newTitle = `${this.state.newCategoryData.title}`;
        const newDescription = `${this.state.newCategoryData.description}`;

        const newCategory = await this.props.control.addCategory({
            title: newTitle,
            description: newDescription,
        });

        await this.getAllCategories();

        const currentCategories = this.state.selectedCategories;

        currentCategories.push(newCategory.id);

        this.setState({
            selectedCategories: currentCategories
        });

        this.props.onSave({
            categories: this.state.categories
        });

        this.setState({
            openNewCategory: false
        })
    };

    addNewCategoryModalProps = {
        id: "newCategory",
        name: "newCategory",
        resize: true,
        title: "Add a new category",
        modalSize: "small",
        width: "500px",
        defaultTheme: this.props.defaultTheme,
        closeButton: {
            callback: () => {
                this.setState({
                    openNewCategory: false,
                })
            },
            label: "Cancel",
        },
        confirmButton: {
            show: true,
            callback: () => {
                this.handleNewCategory()
            },
            label: "Add",
        },
    }

    async handleCategory(event, categories) {
        if (categories.some(cat => !cat || !cat.id)) {
            await this.setAsyncState({
                newCategoryData: {
                    title: categories.find(cat => !cat.id).value,
                }
            });

            this.setState({
                openNewCategory: true,
            })
        } else {
            this.setState({
                selectedCategories: categories.map(cat => cat.id)
            });
        }
    }

    handleCategoryFilter(options, params) {
        const filtered = filter(options, params);
        if (!filtered.length && params.inputValue.length) {

            const existingCategory = this.props.control.listCategories({
                where: {
                    title: params.inputValue
                }
            });

            if (!existingCategory?.count) {
                filtered.push({
                    value: params.inputValue,
                    label: `Add "${params.inputValue}"`,
                });
            }

        }
        return filtered;
    }

    onUpdate(data) {
        this.setState(data);
        this.props.onSave(data);
    }

    renderPageOptions() {
        return (
            <MuiThemeProvider theme={this.muiTheme}>
                <Helmet>
                    <title>{this.props.editing ? "Edit " : "Add"} {this.state.title || " page"}</title>
                </Helmet>
                <FormGroup>
                    {"general" === this.state.contentType && <div>
                        <div style={{display: "flex"}}>
                            <div style={{paddingRight: "5px", flex: 1}}>
                                <CustomInput
                                    labelText={this.state.isTemplate ? "Template Title" : "Page Title"}
                                    id="title"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => {
                                            this.setState({
                                                dialogTitleError: false
                                            })
                                            this.handleInputChange(event)
                                        }
                                    }}
                                    inputProps={{
                                        onKeyDown: (evt) => {
                                            if (evt.key === "Enter") {
                                                this.props.closePageOptionsModal();
                                            }

                                        },
                                        autoFocus: true,
                                        inputProps: {
                                            minLength: "1",
                                        },
                                        inputRef: this.titleRef,
                                        value: this.state.title,
                                        type: "text",
                                    }}
                                    error={this.state.dialogTitleError}
                                    style={{marginRight: "5px"}}
                                />
                            </div>
                            <div style={{paddingLeft: "5px", flex: 1}}>
                                {!this.state.isTemplate && <CustomInput
                                    labelText="Page Link"
                                    required="required"
                                    id="link"
                                    formControlProps={{
                                        fullWidth: true,
                                        onChange: (event) => this.handleInputChange(event),
                                    }}
                                    inputProps={{
                                        required: true,
                                        inputProps: {
                                            minLength: "3",
                                            maxLength: "50",
                                        },
                                        value: this.state.link,
                                        type: "text",
                                    }}
                                    style={{marginLeft: "5px"}}
                                />}
                            </div>
                        </div>
                        <div>
                            {!this.state.isTemplate &&
                                <div>
                                    <Autocomplete
                                        id="categoryDropdown"
                                        multiple
                                        onChange={this.handleCategory.bind(this)}
                                        className={this.props.classes.option}
                                        value={this.state.selectedCategories.map(catId => this.state.flatCategories.find(flatCat => catId === flatCat.id))}
                                        filterOptions={this.handleCategoryFilter.bind(this)}
                                        options={this.state.flatCategories}
                                        autoHighlight
                                        getOptionLabel={(option) => {
                                            if (option) {
                                                return option.label;
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                className={this.props.classes.textfield}
                                                label="Select a categories"
                                                {...params}
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                    <Modal showModal={this.state.openNewCategory} {...this.addNewCategoryModalProps} >
                                        <form onSubmit={() => this.handleNewCategory()}>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: 1, marginRight: "10px"}}>
                                                    <CustomInput
                                                        labelText="Category Title"
                                                        formControlProps={{
                                                            fullWidth: true,
                                                        }}
                                                        inputProps={{
                                                            value: this.state.newCategoryData.title,
                                                            type: "text",
                                                            disabled: true
                                                        }}
                                                    />
                                                </div>
                                                <div style={{flex: 1, marginLeft: "10px"}}>
                                                    <CustomInput
                                                        labelText="Category Description"
                                                        formControlProps={{
                                                            fullWidth: true,
                                                            onChange: (event) => {
                                                                this.setState({
                                                                    newCategoryData: {
                                                                        title: this.state.newCategoryData.title,
                                                                        description: event.target.value,
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        inputProps={{
                                                            type: "text",
                                                            autoFocus: true
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </Modal>
                                </div>}
                        </div>
                        <div>
                            {!this.state.isTemplate &&
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
                                                        checked={this.state.active}
                                                        onChange={() =>
                                                            this.onUpdate({
                                                                active: !this.state.active,
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
                                        <Tooltip title="Set as the Home Page">
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.isHome}
                                                    onChange={() =>
                                                        this.onUpdate({
                                                            isHome: !this.state.isHome,
                                                        })
                                                    }
                                                />}
                                                label="Home page"/>
                                        </Tooltip>
                                    </div>
                                </>}
                        </div>
                    </div>}
                    {"appearance" === this.state.contentType && (
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 1}}>
                                <h4>Background Options</h4>

                                <Typography variant="caption">Solid color for the page background</Typography>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    {this.state.hasBackgroundColor && <div style={{marginRight: '10px'}}>
                                        <ColorPicker
                                            color={this.state.backgroundColor}
                                            onChange={(color) => {
                                                this.onUpdate({
                                                    backgroundColor: color
                                                })
                                            }}
                                        />
                                    </div>}
                                    <div>
                                        <Typography gutterBottom>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.hasBackgroundColor}
                                                    onChange={() => this.onUpdate({
                                                        hasBackgroundGradient: false,
                                                        hasBackgroundColor: !this.state.hasBackgroundColor
                                                    })
                                                    }
                                                />}
                                                label="Solid Color"/>
                                        </Typography>
                                    </div>
                                </div>

                                <Typography variant="caption">Gradient composition for the page background</Typography>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    {this.state.hasBackgroundGradient &&
                                        <div style={{marginRight: '10px'}}>
                                            <GradientColorPicker
                                                color={this.state.backgroundGradient}
                                                onChange={(color) => {
                                                    this.onUpdate({
                                                        backgroundGradient: color
                                                    })
                                                }}/>
                                        </div>}
                                    <div>
                                        <Typography gutterBottom>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.hasBackgroundGradient}
                                                    onChange={() => this.onUpdate({
                                                        hasBackgroundColor: false,
                                                        hasBackgroundImage: false,
                                                        hasBackgroundGradient: !this.state.hasBackgroundGradient,
                                                    })
                                                    }
                                                />}
                                                label="Gradient Composition"/>
                                        </Typography>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="caption">Custom image for the page background</Typography>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.hasBackgroundImage}
                                                onChange={() =>
                                                    this.onUpdate({
                                                        hasBackgroundGradient: false,
                                                        hasBackgroundImage: !this.state.hasBackgroundImage
                                                    })
                                                }
                                            />}
                                            label="Custom Image"/>
                                    </Typography>
                                </div>

                                {this.state.hasBackgroundImage && (
                                    <div>
                                        <div>
                                            <Typography variant="caption">Repeat the image throughout the
                                                page</Typography>
                                            <Typography gutterBottom>
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.hasBackgroundRepeat}
                                                        onChange={() =>
                                                            this.onUpdate({
                                                                hasBackgroundRepeat: !this.state
                                                                    .hasBackgroundRepeat,
                                                            })
                                                        }
                                                    />}
                                                    label="Repeat Image"/>
                                            </Typography>
                                        </div>

                                        <div>
                                            <Typography variant="caption">Stretch the image to fill the
                                                page</Typography>
                                            <Typography gutterBottom>
                                                <FormControlLabel
                                                    control={<Switch
                                                        checked={this.state.hasBackgroundStretch}
                                                        onChange={() =>
                                                            this.onUpdate({
                                                                hasBackgroundStretch: !this.state
                                                                    .hasBackgroundStretch,
                                                            })
                                                        }
                                                    />}
                                                    label="Stretch Image"/>
                                            </Typography>
                                        </div>
                                        <div>
                                            <Button color={"primary"} onClick={() => {
                                                this.imageUploader.click();
                                            }}>Upload Background</Button>
                                            <input id="imageUploader"
                                                   type="file"
                                                   multiple={true}
                                                   ref={(ref) => this.imageUploader = ref}
                                                   style={{display: 'none'}}
                                                   onChange={(event) => this.handleBgImage(event)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{flex: 1}}>
                                <h4>Text Options</h4>

                                <div>
                                    <Typography variant="caption">Select a text color</Typography>
                                    <div style={{display: 'flex'}}>
                                        <ColorPicker
                                            color={this.state.textColor}
                                            customRef={(ref) => this.textColorRef = ref}
                                            onChange={(color) => {
                                                this.setState({
                                                    textColor: color
                                                })
                                            }}
                                        />
                                        <div style={{cursor: 'pointer', marginLeft: '10px'}} onClick={() => {
                                            this.textColorRef.click()
                                        }}>
                                            <Typography gutterBottom>Text Color</Typography>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Typography gutterBottom variant="caption">Select a font for the text</Typography>
                                    <Autocomplete
                                        id="fontFamilyDropdown"
                                        onChange={this.handleFontFamily}
                                        className={this.props.classes.option}
                                        options={this.props.fontFamilies}
                                        autoHighlight
                                        getOptionLabel={(option) => option.family}
                                        value={this.getFontFamilyItem(
                                            this.state.fontFamily
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                className={this.props.classes.textfield}
                                                {...params}
                                                label="Font Family"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Typography gutterBottom variant="caption">Select a text size</Typography>
                                    <Autocomplete
                                        id="fontSizeDropdown"
                                        onChange={this.handleFontSize}
                                        className={this.props.classes.option}
                                        options={this.props.fontSizes}
                                        getOptionLabel={(option) => option.label}
                                        freeSolo
                                        autoHighlight
                                        value={this.getFontSizeItem(
                                            this.state.fontSize
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                className={this.props.classes.textfield}
                                                {...params}
                                                label="Text Size"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Typography gutterBottom>Box Spacing</Typography>
                                    <Slider
                                        className={this.props.classes.pageOptionsSlider}
                                        onChange={this.props.handleBoxSpacing}
                                        value={this.state.config.layoutBoxSpacing[0]}
                                        getAriaValueText={() =>
                                            this.state.config.layoutBoxSpacing[0] + " pixels"
                                        }
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={150}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
                                                checked={this.state.isTemplate || this.props.location?.state?.templateMode}
                                                disabled={this.props.location?.state?.templateMode}
                                                onChange={(event, checked) =>
                                                    this.onUpdate({
                                                        isTemplate: checked,
                                                    })
                                                }
                                            />} label="Save as template"/>
                                    </Tooltip>
                                </div>

                                {!this.state.isTemplate && (
                                    <div>
                                        <Autocomplete
                                            id="templateDropdown"
                                            onChange={this.props.handleTemplateChange}
                                            className={this.props.classes.option}
                                            options={this.state.templates}
                                            autoHighlight
                                            getOptionLabel={(option) => option.label}
                                            // value={this.state.template}
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

                                {this.state.isTemplate && (
                                    <div style={{marginBottom: "15px"}}>
                                        Template used:{" "}
                                        <strong>
                                            {this.state.template?.label || "none"}
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
                            <h4>SEO Settings (Search Engine Optimization):</h4>
                            <div style={{marginTop: "25px"}}>
                                <div>
                                    <TextField
                                        className={this.props.classes.textfield}
                                        value={this.state.pageMetaTitle}
                                        onChange={(e) =>
                                            this.onUpdate({
                                                pageMetaTitle: e.target.value
                                            })}
                                        label="Page meta title"
                                        variant="outlined"
                                    />
                                </div>
                                <div>
                                    <Tooltip title="add website title alongside the title">
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.useWebsiteTitle}

                                                onChange={async (event, checked) => {
                                                    this.onUpdate({
                                                        useWebsiteTitle: checked,
                                                    })
                                                }
                                                }
                                            />} label="include site title in the meta title (ex: My Website - Index)"/>
                                    </Tooltip>
                                </div>
                            </div>
                            <div style={{marginTop: "15px"}}>
                                <div>
                                    <TextField
                                        className={this.props.classes.textfield}
                                        label="Page meta description"
                                        value={this.state.pageMetaDescription}
                                        onChange={(e) =>
                                            this.onUpdate({
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
                <div>{this.state.isTemplate ? "Template Options" : "Page Options"}</div>
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
                        SEO Settings
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
            showModal: this.props.open,
            modalSize: "large",
            defaultTheme: this.props.defaultTheme,
            closeButton: {
                callback: async (reason) => {
                    if (reason !== 'backdropClick') {
                        if (this.state.title.length === 0) {
                            await this.setAsyncState({
                                dialogTitleError: true,
                                contentType: "general"
                            });
                            this.titleRef.current.focus();
                            return;
                        }

                        this.props.closePageOptionsModal()
                    }
                },
                label: "Close",
            }
        }

        return (
            <div>
                <Modal {...modalProps} />
                <Modal
                    showModal={this.state.showTemplateWarning}
                    {...this.state.templateWarningModal}
                />
                <Modal
                    showModal={this.state.showBoxesFromTemplate}
                    {...this.state.boxesFromTemplate}
                />
            </div>
        )
    }

    getFontFamilyItem(name) {
        return this.props.fontFamilies[
            this.props.fontFamilies.findIndex((font) => {
                return font.family === name;
            })
            ];
    }

    getFontSizeItem(name) {
        return this.props.fontSizes[
            this.props.fontSizes.findIndex((font) => {
                return font.value === name;
            })
        ];
    }

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "title":
                this.setState({title: event.target.value});
                break;
            case "link":
                this.setState({link: event.target.value});
                break;
            default:
                break;
        }
    };

    handleBoxSpacing = async (event, newValue) => {
        if (this.state.config.layoutBoxSpacing[0] !== newValue) {
            this.setState({
                config: {
                    "layoutBoxSpacing": [newValue, newValue],
                    "layoutBoxPadding": {
                        "lg": [0, 0],
                        "md": [0, 0],
                        "sm": [0, 0],
                        "xs": [0, 0],
                        "xxs": [0, 0]
                    }
                },
            });
        }
    };

    handleBgImage = async (event) => {
        let strings = await Promise.all(Array.from(event.target.files).map((file) => imageHelper.toBase64(file)));
        this.onUpdate({
            pageBase64Image: strings[0],
            backgroundImageFile: event[0],
        });
    };

    handleBackgroundDelete() {
        this.setState({
            pageBase64Image: "",
            backgroundImageFile: "",
        });
    }

    getWebsiteData = async () => {
        return (await this.props.control.websiteData())
    }

    handleColorPickerClick = (displayColorPicker) => {
        this.setState({[displayColorPicker]: !this.state.displayColorPicker});
    };

    handleColorPickerClose = (displayColorPicker) => {
        this.setState({[displayColorPicker]: false});
    };

    handleFontSize = (event, newValue) => {
        this.setAsyncState({
            fontSize: newValue.label,
        });
    };

    handleFontFamily = async (event, newValue) => {
        await this.setAsyncState({
            fontFamily: newValue.family,
        });
        this.setUsedGoogleFonts();
    };
    handleTemplateChange = async (event, newValue) => {
        await this.setAsyncState({
            template: newValue || {},
        });
        if (newValue) {
            await this.fetchAndSet(newValue?.id, true);
        } else {
            await this.setAsyncState({
                items: [],
                pageConfig: null,
            })
        }
    };
}

export default withStyles(styles)(ViewPageOptions);

ViewPageOptions.propTypes = {
    open: PropTypes.bool,
    editing: PropTypes.bool,
    control: PropTypes.object,
    data: PropTypes.object,
    classes: PropTypes.object,
    location: PropTypes.object,
    closePageOptionsModal: PropTypes.func,
    onSave: PropTypes.func,
    handleBoxSpacing: PropTypes.func,
    handleTemplateChange: PropTypes.func,
    defaultTheme: PropTypes.object,
    fontFamilies: PropTypes.array,
    fontSizes: PropTypes.array,
};