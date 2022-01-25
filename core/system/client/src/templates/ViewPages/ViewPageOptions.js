import React, {createRef} from "react";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";

import Typography from "@material-ui/core/Typography";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {FormControlLabel, FormGroup, TextField, Slider, Switch} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {ToggleButtonGroup} from "@material-ui/lab";

import clsx from "clsx";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
import {withStyles} from "@material-ui/core/styles";

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
        isHome: false,
        active: false,
        isTemplate: false,
        templateId: 0,

        seoTitle: "",
        description: "",
        useWebsiteTitle: false,

        hasBackgroundImage: false,
        hasBackgroundRepeat: false,
        hasBackgroundStretch: false,

        hasBackgroundColor: false,
        hasBackgroundGradient: false,
        backgroundColor: "",
        backgroundGradient: "",
        backgroundImageFile: "",

        textColor: "#000000",
        fontFamily: "Roboto",
        fontUnit: "px",
        fontSize: 11,
        categories: [],

        layoutBoxSpacing: [10, 10],
        layoutBoxPadding: {
            lg: [0, 0],
            md: [0, 0],
            sm: [0, 0],
            xs: [0, 0],
            xxs: [0, 0],
        },

        //ignore from here down

        contentType: "general",
        dialogTitleError: false,

        flatCategories: [],
        showNewCategoryModal: false,
        uniqueCategory: false,
        newCategoryData: {
            title: "",
            description: ""
        },

        showTextColorPicker: false,
        showBoxTextColorPicker: false,
        showTemplateWarning: false,
        showBoxesFromTemplate: false,
        openNewCategory: false,

        templates: [],
    };



    imageUploader = null;
    titleRef = createRef()

    async componentDidMount() {

        let tpl = this.props.control.listTemplates();

        let templates = [];

        if (tpl && tpl.count) {
            templates = tpl.rows.map((template) => {
                return {
                    id: template.id, label: template.title,
                };
            });
        }

        this.setState({
            title: this.props.data.title,
            link: this.props.data.link,

            isHome: !!this.props.data.isHome,
            active: !!this.props.data.active,
            hasBackgroundColor: !!this.props.data.hasBackgroundColor,
            hasBackgroundGradient: !!this.props.data.hasBackgroundGradient,
            hasBackgroundImage: !!this.props.data.hasBackgroundImage,
            hasBackgroundRepeat: !!this.props.data.hasBackgroundRepeat,
            hasBackgroundStretch: !!this.props.data.hasBackgroundStretch,
            backgroundColor: this.props.data.backgroundColor,
            textColor: this.props.data.textColor,
            fontFamily: this.props.data.fontFamily,
            fontSize: this.props.data.fontSize,
            isTemplate: !!this.props.data.isTemplate,
            templateId: this.props.data.templateId,
            layoutBoxPadding: this.props.data.layoutBoxPadding,
            layoutBoxSpacing: this.props.data.layoutBoxSpacing,
            templates,
            categories: this.props.data.categories,

            seoTitle: this.props.data.seoTitle,
            description: this.props.data.description,
            useWebsiteTitle: !!this.props.data.useWebsiteTitle
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

        const currentCategories = this.state.categories;

        currentCategories.push(newCategory.id);

        this.onUpdate({
            categories: currentCategories
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
            this.onUpdate({
                categories: categories.map(cat => cat.id)
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

    onUpdateAsync(data) {
        this.props.onSave(data, true);
        this.setState(data);
    }

    renderPageOptions() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.props.editing ? "Edit " : "Add"} {this.state.title || " page"}</title>
                </Helmet>
                <FormGroup style={{flex: 1}}>
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
                            {!this.state.isTemplate && <div style={{paddingLeft: "5px", flex: 1}}>
                                <CustomInput
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
                                />
                            </div>}
                        </div>
                        <div>
                            {!this.state.isTemplate &&
                                <div>
                                    <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Pick multiple categories or add new ones by typing</Typography>
                                    <Autocomplete
                                        id="categoryDropdown"
                                        multiple
                                        disableCloseOnSelect
                                        onChange={this.handleCategory.bind(this)}
                                        className={this.props.classes.option}
                                        value={this.state.categories.map(catId => this.state.flatCategories.find(flatCat => catId === flatCat.id))}
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
                                                label="Select categories"
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
                        {!this.state.isTemplate &&
                        <div>
                            <div>
                                <Typography variant="caption" style={{display: 'block', marginTop: '2rem'}}>Publish this page for the public or leave it as a draft</Typography>
                                <div>
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
                                </div>
                            </div>
                            <div>
                                <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Make this the Home Page</Typography>
                                <div>
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
                                </div>
                            </div>
                        </div>}
                    </div>}
                    {"appearance" === this.state.contentType && (
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 1}}>
                                <h4>Background Options</h4>

                                <Typography variant="caption" style={{display: 'block', marginTop: '2rem'}}>Solid color for the page background</Typography>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    {this.state.hasBackgroundColor && <div>
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
                                        <Typography>
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

                                <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Gradient composition for the page background</Typography>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    {this.state.hasBackgroundGradient &&
                                        <div>
                                            <GradientColorPicker
                                                color={this.state.backgroundGradient}
                                                onChange={(color) => {
                                                    this.onUpdate({
                                                        backgroundGradient: color
                                                    })
                                                }}/>
                                        </div>}
                                    <div>
                                        <Typography>
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
                                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Custom image for the page background</Typography>
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
                                            <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Repeat the image throughout the
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
                                            <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Stretch the image to fill the
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
                                    <Typography variant="caption" style={{display: 'block', marginTop: '2rem'}}>Select a text color</Typography>
                                    <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                        <ColorPicker
                                            color={this.state.textColor}
                                            label="Text Color"
                                            onChange={(color) => {
                                                this.setState({
                                                    textColor: color
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Select a font for the text</Typography>
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
                                    <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Select a text size</Typography>
                                    <Autocomplete
                                        id="fontSizeDropdown"
                                        onChange={this.handleFontSize}
                                        className={this.props.classes.option}
                                        options={this.props.fontSizes}
                                        getOptionLabel={(option) => {
                                            if(option && option.label) {
                                                return option.label;
                                            } else {
                                                return String(option);
                                            }
                                        }}
                                        freeSolo
                                        autoHighlight
                                        disableClearable
                                        defaultValue={this.state.fontSize}
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
                            </div>
                        </div>
                    )}
                    {"template" === this.state.contentType && <div>
                        <div>
                            <h4>Template</h4>
                            <div style={{marginTop: "15px"}}>
                                <div>
                                    <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Save this page as a template and reuse it for other pages</Typography>
                                    <div>
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
                                    </div>
                                </div>
                                {!this.state.isTemplate && (
                                    <div>
                                        <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Select a template for this page. The selected template will replace the current boxes</Typography>
                                        <Autocomplete
                                            id="templateDropdown"
                                            onChange={this.handleTemplateChange}
                                            className={this.props.classes.option}
                                            options={this.state.templates}
                                            autoHighlight
                                            getOptionLabel={(option) => option.label}
                                            value={this.state.templateId}
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

                                {this.state.isTemplate && this.props.editing &&
                                    <div style={{marginBottom: "15px"}}>
                                        Template used:{" "}
                                        <strong>
                                            {this.state.template?.label || "none"}
                                        </strong>
                                    </div>
                                }

                                <div>
                                    <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Adjust the spacing between the boxes</Typography>
                                    <Slider
                                        className={this.props.classes.pageOptionsSlider}
                                        onChange={this.handleBoxSpacing}
                                        value={this.state.layoutBoxSpacing[0]}
                                        getAriaValueText={() =>
                                            this.state.layoutBoxSpacing[0] + " pixels"
                                        }
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={150}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>}

                    {"seo" === this.state.contentType &&
                        <div className={clsx(
                            this.props.classes.column,
                            this.props.classes.helper
                        )}>
                            <h4>SEO Settings (Search Engine Optimization)</h4>
                            <div style={{marginTop: "27px"}}>
                                <div>
                                    <Typography gutterBottom variant="caption" style={{display: 'block', marginTop: '1rem'}}>Add the website title before the page title (e.g. My Website - Home Page)</Typography>
                                    <div>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.useWebsiteTitle}
                                                onChange={async (event, checked) => {
                                                    this.onUpdate({
                                                        useWebsiteTitle: checked,
                                                    })
                                                }}
                                            />} label="Include Website Name in the Title"/>
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Type in the SEO page title. This will be used for the public and search engines</Typography>
                                    <div>
                                        <CustomInput
                                            labelText="Page Title"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: (event) => {
                                                    this.onUpdate({
                                                        seoTitle: event.target.value
                                                    })
                                                },
                                            }}
                                            inputProps={{
                                                value: this.state.seoTitle,
                                                type: "text",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="caption" style={{display: 'block', marginTop: '1rem'}}>Type in the SEO page description. The description is highly recommended for Search Engine Optimization.</Typography>
                                    <div>
                                        <CustomInput
                                            labelText="Page Description"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: (event) => {
                                                    this.onUpdate({
                                                        description: event.target.value
                                                    })
                                                },
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                value: this.state.description,
                                                type: "text",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </FormGroup>
            </React.Fragment>
        )
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
                    <ToggleButton value="template" onClick={() => this.toggleContentType("template")}>
                        Template
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
            showModal: this.props.open || false,
            modalSize: "normal",
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

    getFontSizeItem(value) {
        return this.props.fontSizes[
            this.props.fontSizes.findIndex((font) => {
                return font.value === value;
            })
        ];
    }

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "title":
                this.onUpdate({title: event.target.value});
                break;
            case "link":
                this.onUpdate({link: event.target.value});
                break;
            default:
                break;
        }
    };

    handleBoxSpacing = async (event, newValue) => {
        this.onUpdate({
            layoutBoxSpacing: [newValue, newValue],
            layoutBoxPadding: {
                "lg": [0, 0],
                "md": [0, 0],
                "sm": [0, 0],
                "xs": [0, 0],
                "xxs": [0, 0]
            }
        });
    };

    handleBgImage = async (event) => {
        const fileClone = new File([event.target.files[0]], event.target.files[0].name);
        const imageBase64 = await imageHelper.toBase64(event.target.files[0]);
        this.onUpdate({
            pageBase64Image: imageBase64,
            backgroundImageFile: fileClone,
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
        if(typeof newValue === 'string') {
            this.onUpdate({
                fontSize: Number(newValue),
            });
        } else if(newValue && newValue.value) {
            this.onUpdate({
                fontSize: newValue.value,
            });
        }
    };

    handleFontFamily = async (event, newValue) => {
        await this.onUpdateAsync({
            fontFamily: newValue.family,
        });
        this.props.setUsedGoogleFonts();
    };
    handleTemplateChange = async (event, newValue) => {
        this.onUpdate({
            template: newValue || {},
        });
        if (newValue) {
            await this.fetchAndSet(newValue?.id, true);
        } else {
            this.onUpdate({
                boxes: [],
                //pageConfig: {},//TODO CHANGE THIS TO ACTUAL PROPS
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
    defaultTheme: PropTypes.object,
    fontFamilies: PropTypes.array,
    setUsedGoogleFonts: PropTypes.func,
    fontSizes: PropTypes.array,
};