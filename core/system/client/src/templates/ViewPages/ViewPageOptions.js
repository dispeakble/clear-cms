import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CustomInput from "../../components/CustomInput/CustomInput";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import {DeleteForever} from "@material-ui/icons";
import {DropzoneArea} from "material-ui-dropzone";
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import {Checkbox, TextField} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import clsx from "clsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "../../components/CustomButtons/Button";
import React from "react";

const filter = createFilterOptions()

class ViewPageOptions extends React.PureComponent{
    render(){
        return (
            <Dialog
                open={this.props.data.showPageOptionsModal}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="page-options-modal-slide-title"
                aria-describedby="page-options-modal-slide-description"
                classes={{
                    root: this.props.classes.center,
                    paper: this.props.classes.modalPageOptions
                }}
            >
                <DialogTitle
                    id="page-options-modal-slide-title"
                    disableTypography
                    className={this.props.classes.modalHeader}
                >
                    <h4 className={this.props.classes.modalTitle}>
                        Page options
                    </h4>
                </DialogTitle>
                <DialogContent
                    id="page-options-modal-slide-description"
                    className={this.props.classes.modalBodyPageOptions}
                >
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
                                inputRef:this.props.pageTitleRef,
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
                            <h4>Background</h4>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div style={{ display: "block" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h5 style={{ marginRight: "15px" }}>Color</h5>

                                        <Tooltip title="Compose a background gradient instead of a solid color">
                                            {this.props.createColorPicker(
                                                "bgColorStyles",
                                                "showBgColorPicker",
                                                "bgColor"
                                            )}
                                        </Tooltip>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h5 style={{ marginRight: "15px" }}>Gradient</h5>

                                        <Tooltip title="Compose a background gradient instead of a solid color">
                                            {this.props.createGradientColorPicker(
                                                "bgColorStyles",
                                                "showBgGradientColorPickerModal",
                                                "bgGradientColor"
                                            )}
                                        </Tooltip>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography gutterBottom>
                                            Gradient
                                            <Tooltip title="Compose a background gradient instead of a solid color">
                                                <Switch
                                                    value={this.props.data.pageBackgroundGradient}
                                                    checked={this.props.data.pageBackgroundGradient}
                                                    onChange={() => this.props.handlePageOptions({
                                                        pageBackgroundGradient: !this.props.data
                                                            .pageBackgroundGradient,
                                                    })
                                                    }
                                                />
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography gutterBottom>
                                            Repeat
                                            <Tooltip title="Repeat the background to fit the page">
                                                <Switch
                                                    value={this.props.data.pageBackgroundRepeat}
                                                    checked={this.props.data.pageBackgroundRepeat}
                                                    onChange={() =>
                                                        this.props.handlePageOptions({
                                                            pageBackgroundRepeat: !this.props.data
                                                                .pageBackgroundRepeat,
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
                                        }}
                                    >
                                        <Typography gutterBottom>
                                            Stretch
                                            <Tooltip title="Stretch the background to fit the page">
                                                <Switch
                                                    checked={this.props.data.pageBackgroundStretch}
                                                    value={this.props.data.pageBackgroundStretch}
                                                    onChange={() =>
                                                        this.props.handlePageOptions({
                                                            pageBackgroundStretch: !this.props.data
                                                                .pageBackgroundStretch,
                                                        })
                                                    }
                                                />
                                            </Tooltip>
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <h5>Background Image</h5>
                                {(this.props.data.backgroundImage ||
                                    this.props.data.pageBase64Image) && (
                                    <Tooltip title="Delete background image">
                                        <DeleteForever
                                            onClick={() =>
                                                this.props.handlePageOptions({
                                                    backgroundImage: "",
                                                    backgroundImageFile: "",
                                                })
                                            }
                                            style={{
                                                color: this.props.defaultTheme.secondary.main,
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </div>
                            <div className={this.props.classes.dropzoneAreaWrapper}>
                                <DropzoneArea
                                    maxFileSize={Math.pow(1024, 3)}
                                    filesLimit={1}
                                    onChange={this.props.handleBgImage.bind(this)}
                                    onDelete={this.props.handleBackgroundDelete.bind(this)}
                                />
                            </div>
                        </div>
                        <p />
                        <div
                            className={
                                this.props.classes.column +
                                " " +
                                this.props.classes.columnSeparator
                            }
                        >
                            <h4>Font </h4>
                            <div style={{ marginTop: "15px" }}>
                                <Autocomplete
                                    id="fontFamilyDropdown"
                                    onChange={this.props.handleFontFamily}
                                    className={this.props.classes.option}
                                    options={this.props.data.fontFamilies}
                                    autoHighlight
                                    getOptionLabel={(option) => option.label}
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
                        <p />
                        <div
                            className={clsx(
                                this.props.classes.column,
                                this.props.classes.helper
                            )}
                        >
                            <h4>Miscellaneous</h4>
                            <div style={{ marginTop: "15px" }}>
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
                                                style={{ textAlign: "center" }}
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
                                { !this.props.data.isTemplate &&
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
                                <div style={{ marginLeft: "-10px" }}>
                                    <Checkbox
                                        checked={this.props.data.isTemplate}
                                        disabled={this.props.location.state && this.props.location.state.templateMode}
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

                </DialogContent>

                <DialogActions className={this.props.classes.modalFooter}>
                    <Button
                        color="primary"
                        simple
                        onClick={() => {
                            this.props.closePageOptionsModal();
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
    getFontFamilyItem(name) {
        return this.props.data.fontFamilies[
            this.props.data.fontFamilies.findIndex((font) => {
                return font.label === name;
            })
            ];
    }
}

export  default ViewPageOptions