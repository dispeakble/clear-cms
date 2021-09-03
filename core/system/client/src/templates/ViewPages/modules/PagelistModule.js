import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ArtTrack from "@material-ui/icons/ArtTrack";

import { withStyles, createTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import {Checkbox, MenuItem, Select, TextField} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import {SketchPicker} from "react-color";
import MaterialTable from "material-table";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";
import reactCSS from "reactcss";
import {AddCircle, Check, Clear, DeleteForever, Edit} from "@material-ui/icons";
import {Autocomplete} from "@material-ui/lab";

class PagelistModule extends Component {
    state = {
        numberOfPagesToDisplayAtOnce: 5,
        showTitle: false,
        showDescription: false,
        truncateDescription: false,
        showMaxWords: 120,
        showThumbnail: false,
        showModifiedDate: false,
        showBorder: false,
        borderWidth: "",
        borderColor: "",
        borderRadius: "",
        showShadow: false,
        shadowColor: "",
        shadowSpread: 5,
        shadowTop: 10,
        shadowLeft: 10,
        padding: 0,
        margin: 0,
        dynamicButtons: false,
        dynamicButtonsList: [],
        borderColorStyles: {},
        shadowColorStyles: {},
        displayBorderColorPicker: false,
        displayShadowColorPicker: false,
        targetTypes: [{
            label: "In Page",
            value: "_self"
        },{
            label: "New Tab",
            value: "_blank"
        }],
        positionTypes: [{
            label: "Up",
            value: "up"
        },{
            label: "Down",
            value: "down"
        },{
            label: "Left",
            value: "left"
        },{
            label: "Right",
            value: "right"
        }]
    };

    getTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiDialogTitle: {
                    root: {
                        padding: "16px 24px 0",
                    },
                },
            },
        });
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        await this.setAsyncState({borderColorStyles: this.sendStyles(this.state.borderColor),
            shadowColorStyles: this.sendStyles(this.state.shadowColor)});
    }

    closeModuleOptionsModal() {
        this.setState({ showModuleOptionsModal: false });
    }

    handleEdit = async (id) => {
        if (this.props.moduleOptions.data) {
            await this.setAsyncState({
                displayType: this.props.moduleOptions.data.displayType,
                numberOfPagesToDisplayAtOnce: this.props.moduleOptions.data.numberOfPagesToDisplayAtOnce,
                showTitle: this.props.moduleOptions.data.showTitle,
                showDescription: this.props.moduleOptions.data.showDescription,
                truncateDescription: this.props.moduleOptions.data.truncateDescription,
                showMaxWords: this.props.moduleOptions.data.showMaxWords,
                showThumbnail: this.props.moduleOptions.data.showThumbnail,
                showModifiedDate: this.props.moduleOptions.data.showModifiedDate,
                showBorder: this.props.moduleOptions.data.showBorder,
                borderWidth: this.props.moduleOptions.data.borderWidth,
                borderColor: this.props.moduleOptions.data.borderColor,
                borderRadius: this.props.moduleOptions.data.borderRadius,
                showShadow: this.props.moduleOptions.data.showShadow,
                shadowColor: this.props.moduleOptions.data.shadowColor,
                shadowSpread: this.props.moduleOptions.data.shadowSpread,
                shadowTop: this.props.moduleOptions.data.shadowTop,
                shadowLeft: this.props.moduleOptions.data.shadowLeft,
                padding: this.props.moduleOptions.data.padding,
                margin: this.props.moduleOptions.data.margin,
                dynamicButtons: this.props.moduleOptions.data.dynamicButtons,
                dynamicButtonsList: this.props.moduleOptions.data.dynamicButtonsList
            });
        }
        await this.setAsyncState({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };

    handleInputChange(event) {
        if (event.target) {
            this.setState({
                textContent: event.target.value,
            });
        } else {
            this.setState({
                richTextContent: event,
            });
        }
    }

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

    handleColorPickerClick = (displayColorPicker) => {
        this.setState({ [displayColorPicker]: !this.state.displayColorPicker });
    };

    handleColorPickerClose = (displayColorPicker) => {
        this.setState({ [displayColorPicker]: false });
    };

    handleBorderWidth = async (event, newValue) => {
        await this.setAsyncState({ borderWidth: newValue });
    };

    handleBorderRadius = async (event, newValue) => {
        await this.setAsyncState({ borderRadius: newValue });
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
                                whiteSpace: "nowrap",
                            },
                        },
                    },
                    MuiTypography: {
                    },
                    MuiIcon: {
                        root: {
                            padding: "3px",
                            "&:hover": {
                                backgroundColor: "transparent",
                            },
                        },
                    },
                },
            });
        },
        actions: {
            getData: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        let payload = {
                            totalCount: this.state.dynamicButtonsList.length,
                            page: 0,
                            data: this.state.dynamicButtonsList,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: async (newData) => {
                    console.log("rowData", newData);
                    await this.setAsyncState(prevState => {
                        return {
                            ...prevState,
                            dynamicButtonsList: [
                                ...prevState.dynamicButtonsList,
                                ...[{
                                    id: prevState.dynamicButtonsList.length + 1,
                                    title: newData.title,
                                    url: newData.url,
                                    text: newData.text,
                                    target: newData.target,
                                    position: newData.position,
                                    showAsLink: newData.showAsLink
                                }]
                            ]
                        }
                    })
                },
                onRowUpdate: async (newData, oldData) =>{
                    const newDynamicButtonsList = this.state.dynamicButtonsList;
                    const oldDataIndex = newDynamicButtonsList.findIndex(button => button.id === oldData.id);
                    newDynamicButtonsList[oldDataIndex] = {
                        id: oldData.id,
                        title: newData.title,
                        url: newData.url,
                        text: newData.text,
                        target: newData.target,
                        position: newData.position,
                        showAsLink: newData.showAsLink
                    }
                    await this.setAsyncState(prevState => {
                        return {
                            ...prevState,
                            dynamicButtonsList: newDynamicButtonsList
                        }
                    })
                },
                onRowDelete: async (oldData) =>{
                    const newDynamicButtonsList = this.state.dynamicButtonsList.filter(button => button.id !== oldData.id);
                    await this.setAsyncState(prevState => {
                        return {
                            ...prevState,
                            dynamicButtonsList: newDynamicButtonsList
                        }
                    })
                },
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Buttons",
                    icon: () => (
                        <DeleteForever />
                    ),
                    onClick: async (evt, data) => {
                        if(data.length > 0) {
                            const deleteIds = data.map(button => button.id);
                            const newDynamicButtonsList = this.state.dynamicButtonsList.filter(button => deleteIds.indexOf(button.id) === -1)
                            await this.setAsyncState(prevState => {
                                return {
                                    ...prevState,
                                    dynamicButtonsList: newDynamicButtonsList
                                }
                            })
                        }
                    },
                },
            ],
        },
        props: {
            icons: {
                Add: () => <AddCircle style={{ color: this.props.defaultTheme.primary?.main || "green" }} />,
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
                ),
            },
            columns: [
                {
                    type: "string",
                    field: "title",
                    title: "Button Title",
                    validate: rowData => rowData.title && rowData.title !== ""
                },
                {
                    type: "string",
                    field: "url",
                    title: "URL",
                    validate: rowData => rowData.url && rowData.url !== ""
                },
                {
                    type: "string",
                    field: "text",
                    title: "Button Text",
                    validate: rowData => rowData.text && rowData.text !== ""
                },
                {
                    type: "string",
                    field: "target",
                    title: "Target",
                    initialEditValue: this.state.targetTypes[0],
                    validate: rowData => rowData.target && rowData.target != "",
                    render: (rowData) => {
                        const type = this.state.targetTypes.find((type) => type.value === rowData.target.value);
                        return <React.Fragment>{type.label}</React.Fragment>;
                    },
                    editComponent: (columnData) => {
                        return (
                            <Autocomplete
                                options={this.state.targetTypes}
                                autoHighlight
                                className={this.props.classes.option}
                                defaultValue={columnData.rowData.target}
                                onChange={(ev, value) => {
                                    if (value && value.label) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            target: value,
                                        });
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}{...params}
                                        label="Target Type"
                                        variant="outlined"
                                    />
                                )}
                            />
                        );
                    }
                },
                {
                    type: "numeric",
                    field: "showAsLink",
                    title: "Show As Link",
                    initialEditValue: 0,
                    render: (rowData) => <Checkbox disabled checked={rowData.showAsLink === 1} />,
                    editComponent: (columnData) => {
                        return (
                            <Checkbox checked={columnData.rowData.showAsLink === 1} onChange={(ev, checked) => {
                                columnData.onRowDataChange({
                                    ...columnData.rowData,
                                    showAsLink: checked ? 1 : 0,
                                });
                            }
                            } />
                        )
                    }
                },
                {
                    type: "string",
                    field: "position",
                    title: "Position",
                    initialEditValue: "right",
                    validate: rowData => rowData.position && rowData.position != "",
                    render: (rowData) => {
                        const type = this.state.positionTypes.find((type) => type.value === rowData.position);
                        return <React.Fragment>{type.label}</React.Fragment>;
                    },
                    editComponent: (columnData) => {
                        return (
                            <Select
                                id={"position-types"}
                                value={columnData.rowData.position}
                                onChange={(ev) => {
                                    if (ev.target) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            position: ev.target.value,
                                        });
                                    }
                                }}
                            >
                                {this.state.positionTypes.map((position, index) => <MenuItem key={index} value={position.value}>{position.label}</MenuItem>)}
                            </Select>
                        );
                    }
                },
            ],
            localization: {
                body: {
                    editRow: {
                        deleteText: "Are you sure you want to delete this button?",
                    },
                }
            },
            options: {
                selection: true,
                selectionStyle: styles.selection,
                actionsColumnIndex: -1,
                actionsCellStyle: styles.tableActions,
                cellStyle: styles.tableCells,
                headerStyle: styles.tableHeader,
            },
        },
    };

    render() {
        const classes = this.props.classes;
        return (
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <IconButton
                    onClick={() => this.handleEdit(this.props.boxId)}
                    color="primary"
                    size="medium"
                >
                    <ArtTrack />
                </IconButton>

                <Dialog
                    onBackdropClick={() => "false"}
                    classes={{
                        root: classes.center,
                        paper: classes.modal,
                    }}
                    open={this.state.showModuleOptionsModal}
                    TransitionComponent={this.transition}
                    keepMounted
                    onClose={() => this.closeModuleOptionsModal()}
                    aria-labelledby="classic-modal-slide-title"
                    aria-describedby="classic-modal-slide-description"
                >
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}
                    >
                        <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
                    </DialogTitle>
                    <DialogContent
                        id="classic-modal-slide-description"
                        className={`${classes.modalBody} ${classes.pageListModuleFields}`}
                    >
                        <div>
                            <Typography>Number of Pages to Display At Once </Typography>
                            <TextField
                                labelText="Number of Pages to Display At Once"
                                id="numnberOfPagesToDisplayAtOnce"
                                onChange={(e) => this.setState({
                                    numberOfPagesToDisplayAtOnce: e.target.value
                                })}
                                InputProps={{
                                    inputProps: {
                                        value: this.state.numberOfPagesToDisplayAtOnce,
                                        type: "number",
                                        min: 5,
                                        max: 20,
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <Typography>Show Title</Typography>
                            <Tooltip title="Show Title">
                                <Switch
                                    value={this.state.showTitle}
                                    checked={this.state.showTitle}
                                    onChange={() => {
                                        this.setState({
                                            showTitle: !this.state
                                                .showTitle,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <Typography>Show Description</Typography>
                            <Tooltip title="Show Description">
                                <Switch
                                    value={this.state.showDescription}
                                    checked={this.state.showDescription}
                                    onChange={() => {
                                        this.setState({
                                            showDescription: !this.state
                                                .showDescription,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <Typography>Truncate Description</Typography>
                            <Tooltip title="Truncate Description">
                                <Switch
                                    value={this.state.truncateDescription}
                                    checked={this.state.truncateDescription}
                                    onChange={() => {
                                        this.setState({
                                            truncateDescription: !this.state
                                                .truncateDescription,
                                        });
                                    }}
                                />
                            </Tooltip>
                            {this.state.truncateDescription &&
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Show Max Words"
                                        id="showMaxWords"
                                        onChange={(e) => this.setState({
                                            showMaxWords: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.showMaxWords,
                                            type: "number",
                                            min: 120,
                                            max: 240,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                            }
                        </div>
                        <div>
                            <Typography>Show Thumbnail</Typography>
                            <Tooltip title="Show Thumbnail">
                                <Switch
                                    value={this.state.showThumbnail}
                                    checked={this.state.showThumbnail}
                                    onChange={() => {
                                        this.setState({
                                            showThumbnail: !this.state
                                                .showThumbnail,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <Typography>Show Modified Date</Typography>
                            <Tooltip title="Show Modified Date">
                                <Switch
                                    value={this.state.showModifiedDate}
                                    checked={this.state.showModifiedDate}
                                    onChange={() => {
                                        this.setState({
                                            showModifiedDate: !this.state
                                                .showModifiedDate,
                                        });
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <Typography>Dynamic Buttons</Typography>
                            <Tooltip title="Allow Dynamic Buttons">
                                <Switch
                                    value={this.state.dynamicButtons}
                                    checked={this.state.dynamicButtons}
                                    onChange={() => {
                                        this.setState({
                                            dynamicButtons: !this.state
                                                .dynamicButtons,
                                        });
                                    }}
                                />
                            </Tooltip>
                            {this.state.dynamicButtons &&
                            <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                                <MaterialTable
                                    title="Dynamic Buttons"
                                    tableRef={this.state.tableRef}
                                    columns={this.tableOptions.props.columns}
                                    data={() => this.tableOptions.actions.getData()}
                                    icons={this.tableOptions.props.icons}
                                    options={this.tableOptions.props.options}
                                    editable={this.tableOptions.actions.editable}
                                    actions={this.tableOptions.actions.customActions}
                                    localization={this.tableOptions.props.localization}
                                />
                            </MuiThemeProvider>
                            }
                        </div>
                        <div>
                            <Typography>
                                <span>Border Color </span>
                            </Typography>
                            {this.createColorPicker(
                                "borderColorStyles",
                                "displayBorderColorPicker",
                                "borderColor"
                            )}

                        </div>
                        <div>
                            <Typography><span>Border Width</span></Typography>
                            <Slider
                                value={this.state.borderWidth}
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
                                value={this.state.borderRadius}
                                className={this.props.classes.sideMenuSlider}
                                onChange={this.handleBorderRadius.bind(this)}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={30}
                            />
                        </div>
                        <div>
                            <Typography>Shadow</Typography>
                            <Tooltip title="Enable Shadow">
                                <Switch
                                    value={this.state.showShadow}
                                    checked={this.state.showShadow}
                                    onChange={() => {
                                        this.setState({
                                            showShadow: !this.state
                                                .showShadow,
                                        });
                                    }}
                                />
                            </Tooltip>
                            {this.state.showShadow &&
                            <>
                                <div>
                                    <Typography>
                                        <span>Shadow Color </span>
                                    </Typography>
                                    {this.createColorPicker(
                                        "shadowColorStyles",
                                        "displayShadowColorPicker",
                                        "shadowColor"
                                    )}
                                </div>
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Shadow Spread"
                                        id="spread"
                                        onChange={(e) => this.setState({
                                            shadowSpread: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.shadowSpread,
                                            type: "number",
                                            min: 5,
                                            max: 20,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Top Shadow"
                                        id="topShadow"
                                        onChange={(e) => this.setState({
                                            shadowTop: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.shadowTop,
                                            type: "number",
                                            min: 5,
                                            max: 20,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Left Shadow"
                                        id="leftShadow"
                                        onChange={(e) => this.setState({
                                            shadowLeft: e.target.value
                                        })}
                                        inputProps={{
                                            value: this.state.shadowLeft,
                                            type: "number",
                                            min: 5,
                                            max: 20,
                                        }}
                                        variant={"outlined"}
                                        size={"small"}
                                    />
                                </div>
                            </>
                            }
                        </div>
                        <div className={classes.numberPicker}>
                            <TextField
                                label="Padding"
                                id="padding"
                                onChange={(e) => this.setState({
                                    padding: e.target.value
                                })}
                                inputProps={{
                                    value: this.state.padding,
                                    type: "number",
                                    min: 0,
                                    max: 20,
                                }}
                                variant={"outlined"}
                                size={"small"}
                            />
                        </div>
                        <div className={classes.numberPicker}>
                            <TextField
                                label="Margin"
                                id="margin"
                                onChange={(e) => this.setState({
                                    margin: e.target.value
                                })}
                                inputProps={{
                                    value: this.state.margin,
                                    type: "number",
                                    min: 0,
                                    max: 20,
                                }}
                                variant={"outlined"}
                                size={"small"}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="primary"
                            onClick={() => {
                                this.props.handleSave(this.state.itemModuleEditId, {
                                    numberOfPagesToDisplayAtOnce: this.state.numberOfPagesToDisplayAtOnce,
                                    showTitle: this.state.showTitle,
                                    showDescription: this.state.showDescription,
                                    truncateDescription: this.state.truncateDescription,
                                    showMaxWords: this.state.showMaxWords,
                                    showThumbnail: this.state.showThumbnail,
                                    showModifiedDate: this.state.showModifiedDate,
                                    showBorder: this.state.showBorder,
                                    borderWidth: this.state.borderWidth,
                                    borderColor: this.state.borderColor,
                                    borderRadius: this.state.borderRadius,
                                    showShadow: this.state.showShadow,
                                    shadowColor: this.state.shadowColor,
                                    shadowSpread: this.state.shadowSpread,
                                    shadowTop: this.state.shadowTop,
                                    shadowLeft: this.state.shadowLeft,
                                    padding: this.state.padding,
                                    margin: this.state.margin,
                                    dynamicButtons: this.state.dynamicButtons,
                                    dynamicButtonsList: this.state.dynamicButtonsList
                                });
                                this.closeModuleOptionsModal();
                            }}
                        >
                            <div>Save</div>
                        </Button>
                        <Button
                            color="danger"
                            onClick={async () => {
                                this.closeModuleOptionsModal();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(PagelistModule);
