import React, {Component} from "react";
import PropTypes from 'prop-types'

// for the modal
import Tooltip from "@material-ui/core/Tooltip";

import {withStyles, createTheme} from "@material-ui/core/styles";
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
        }, {
            label: "New Tab",
            value: "_blank"
        }],
        positionTypes: [{
            label: "Up",
            value: "up"
        }, {
            label: "Down",
            value: "down"
        }, {
            label: "Left",
            value: "left"
        }, {
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
        const {moduleOptions} = this.props
        await this.setAsyncState({
            borderColorStyles: this.sendStyles(this.state.borderColor),
            shadowColorStyles: this.sendStyles(this.state.shadowColor),
            numberOfPagesToDisplayAtOnce: moduleOptions.numberOfPagesToDisplayAtOnce,
            showTitle: moduleOptions.showTitle,
            truncateDescription: moduleOptions.truncateDescription,
            showDescription: moduleOptions.showDescription,
            showThumbnail: moduleOptions.showThumbnail,
            showModifiedDate: moduleOptions.showModifiedDate,
            dynamicButtons: moduleOptions.dynamicButtons,
            showShadow: moduleOptions.showShadow,
            padding: moduleOptions.padding,
            margin: moduleOptions.margin,
            shadowLeft: moduleOptions.shadowLeft || this.state.shadowLeft,
            shadowTop: moduleOptions.shadowTop || this.state.shadowTop,
            borderWidth: moduleOptions.borderWidth || this.state.borderWidth,
            shadowSpread: moduleOptions.shadowSpread,
            borderRadius: moduleOptions.borderRadius || this.state.borderRadius,
            showMaxWords: moduleOptions.showMaxWords || this.state.showMaxWords,
            dynamicButtonsList: moduleOptions.dynamicButtonsList || [],
            borderColor: moduleOptions.borderColor,
            shadowColor: moduleOptions.shadowColor,
        });
    }

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

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
                            onChange={async (color) => {
                                await this.setAsyncState({
                                    [targetedColor]: color.hex,
                                });
                                this.props.onUpdate(this.state);
                            }}
                        />
                    </div>
                ) : null}
            </React.Fragment>
        );
    };

    handleColorPickerClick = (displayColorPicker) => {
        this.setState({[displayColorPicker]: !this.state.displayColorPicker});
    };

    handleColorPickerClose = (displayColorPicker) => {
        this.setState({[displayColorPicker]: false});
    };

    handleBorderWidth = async (event, newValue) => {
        await this.setAsyncState({borderWidth: newValue});
        this.props.onUpdate(this.state)
    };

    handleBorderRadius = async (event, newValue) => {
        await this.setAsyncState({borderRadius: newValue});
        this.props.onUpdate(this.state)
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
                    MuiTypography: {},
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
                    });
                    this.props.onUpdate(this.state)

                },
                onRowUpdate: async (newData, oldData) => {
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
                    this.props.onUpdate(this.state)
                },
                onRowDelete: async (oldData) => {
                    const newDynamicButtonsList = this.state.dynamicButtonsList.filter(button => button.id !== oldData.id);
                    await this.setAsyncState(prevState => {
                        return {
                            ...prevState,
                            dynamicButtonsList: newDynamicButtonsList
                        }
                    })
                    this.props.onUpdate(this.state)
                },
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Buttons",
                    icon: () => (
                        <DeleteForever/>
                    ),
                    onClick: async (evt, data) => {
                        if (data.length > 0) {
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
                Add: () => <AddCircle style={{color: this.props.defaultTheme.primary?.main || "green"}}/>,
                Check: () => (
                    <Check color="primary"/>
                ),
                Clear: () => (
                    <Clear color="error"/>
                ),
                Edit: () => (
                    <Edit color="primary"/>
                ),
                Delete: () => (
                    <DeleteForever color="error"/>
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
                    validate: rowData => rowData.target && rowData.target !== "",
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
                    render: (rowData) => <Checkbox disabled checked={rowData.showAsLink === 1}/>,
                    editComponent: (columnData) => {
                        return (
                            <Checkbox checked={columnData.rowData.showAsLink === 1} onChange={(ev, checked) => {
                                columnData.onRowDataChange({
                                    ...columnData.rowData,
                                    showAsLink: checked ? 1 : 0,
                                });
                            }
                            }/>
                        )
                    }
                },
                {
                    type: "string",
                    field: "position",
                    title: "Position",
                    initialEditValue: "right",
                    validate: rowData => rowData.position && rowData.position !== "",
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
                                {this.state.positionTypes.map((position, index) => <MenuItem key={index}
                                                                                             value={position.value}>{position.label}</MenuItem>)}
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
            <div>
                <div style={{flex: 1, display: "flex"}}>
                    <div style={{flex: 1, paddingRight: "12px"}}>
                        <div>
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Number of Pages to Display At Once
                                </Typography>
                            </div>
                            <TextField
                                labelText="Number of Pages to Display At Once"
                                id="numberOfPagesToDisplayAtOnce"
                                fullWidth
                                onChange={async (e) => {
                                    await this.setAsyncState({
                                        numberOfPagesToDisplayAtOnce: e.target.value
                                    })
                                    this.props.onUpdate(this.state)
                                }}
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
                            <div style={{paddingTop: 12}}>
                                <Typography gutterBottom variant="caption">
                                    Show Title
                                </Typography>
                            </div>
                            <Tooltip title="Show Title">
                                <Switch
                                    value={this.state.showTitle}
                                    checked={this.state.showTitle}

                                    onChange={async () => {
                                        await this.setAsyncState({
                                            showTitle: !this.state.showTitle
                                        })
                                        this.props.onUpdate(this.state)
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Show Description
                                </Typography>
                            </div>
                            <Tooltip title="Show Description">
                                <Switch
                                    value={this.state.showDescription}
                                    checked={this.state.showDescription}
                                    onChange={async () => {
                                        await this.setAsyncState({
                                            showDescription: !this.state.showDescription
                                        })
                                        this.props.onUpdate(this.state)
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Truncate Description
                                </Typography>
                            </div>
                            <Tooltip title="Truncate Description">
                                <Switch
                                    value={this.state.truncateDescription}
                                    checked={this.state.truncateDescription}

                                    onChange={async () => {
                                        await this.setAsyncState({
                                            truncateDescription: !this.state.truncateDescription
                                        })
                                        this.props.onUpdate(this.state)
                                    }}
                                />
                            </Tooltip>
                            {this.state.truncateDescription &&
                                <div className={classes.numberPicker}>
                                    <TextField
                                        label="Show Max Words"
                                        id="showMaxWords"

                                        onChange={async (e) => {
                                            await this.setAsyncState({
                                                showMaxWords: e.target.value
                                            })
                                            this.props.onUpdate(this.state)
                                        }}
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
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Show Thumbnail
                                </Typography>
                            </div>
                            <Tooltip title="Show Thumbnail">
                                <Switch
                                    value={this.state.showThumbnail}
                                    checked={this.state.showThumbnail}
                                    onChange={async () => {
                                        await this.setAsyncState({
                                            showThumbnail: !this.state.showThumbnail
                                        })
                                        this.props.onUpdate(this.state)
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Show Modified Date
                                </Typography>
                            </div>
                            <Tooltip title="Show Modified Date">
                                <Switch
                                    value={this.state.showModifiedDate}
                                    checked={this.state.showModifiedDate}
                                    onChange={async () => {
                                        await this.setAsyncState({
                                            showModifiedDate: !this.state.showModifiedDate
                                        })
                                        this.props.onUpdate(this.state)
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div>
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Border Color
                                </Typography>
                            </div>
                            {this.createColorPicker(
                                "borderColorStyles",
                                "displayBorderColorPicker",
                                "borderColor"
                            )}
                        </div>
                        <div>
                            <div style={{paddingTop: 12}}>
                                <Typography gutterBottom variant="caption">
                                    Border Width
                                </Typography>
                            </div>
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
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Border Radius
                                </Typography>
                            </div>
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
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Enable Shadow
                                </Typography>
                            </div>
                            <Tooltip title="Enable Shadow">
                                <Switch
                                    value={this.state.showShadow}
                                    checked={this.state.showShadow}

                                    onChange={async () => {
                                        await this.setAsyncState({
                                            showShadow: !this.state.showShadow
                                        })
                                        this.props.onUpdate(this.state)
                                    }}
                                />
                            </Tooltip>
                            {this.state.showShadow &&
                                <>
                                    <div>
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Shadow Color
                                            </Typography>
                                        </div>
                                        {this.createColorPicker(
                                            "shadowColorStyles",
                                            "displayShadowColorPicker",
                                            "shadowColor"
                                        )}
                                    </div>
                                    <div className={classes.numberPicker}>
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Shadow Spread Value
                                            </Typography>
                                        </div>
                                        <TextField
                                            label="Shadow Spread"
                                            id="spread"
                                            fullWidth
                                            onChange={async (e) => {
                                                await this.setAsyncState({
                                                    shadowSpread: e.target.value
                                                })
                                                this.props.onUpdate(this.state)
                                            }}
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
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Top Shadow Value
                                            </Typography>
                                        </div>
                                        <TextField
                                            label="Top Shadow"
                                            id="topShadow"
                                            fullWidth
                                            onChange={async (e) => {
                                                await this.setAsyncState({
                                                    shadowTop: e.target.value
                                                })
                                                this.props.onUpdate(this.state)
                                            }}
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
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Left Shadow Value
                                            </Typography>
                                        </div>
                                        <TextField
                                            label="Left Shadow"
                                            id="leftShadow"
                                            fullWidth
                                            onChange={async (e) => {
                                                await this.setAsyncState({
                                                    shadowLeft: e.target.value
                                                })
                                                this.props.onUpdate(this.state)
                                            }}
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
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Padding Value
                                </Typography>
                            </div>
                            <TextField
                                label="Padding"
                                id="padding"
                                fullWidth
                                onChange={async (e) => {
                                    await this.setAsyncState({
                                        padding: e.target.value
                                    })
                                    this.props.onUpdate(this.state)
                                }}
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
                            <div>
                                <Typography gutterBottom variant="caption">
                                    Margin Value
                                </Typography>
                            </div>
                            <TextField
                                label="Margin"
                                id="margin"
                                fullWidth
                                onChange={async (e) => {
                                    await this.setAsyncState({
                                        margin: e.target.value
                                    })
                                    this.props.onUpdate(this.state)
                                }}
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
                    </div>
                </div>
                <div>
                    <div>
                        <Typography gutterBottom variant="caption">
                            Dynamic Buttons
                        </Typography>
                    </div>
                    <Tooltip title="Allow Dynamic Buttons">
                        <Switch
                            value={this.state.dynamicButtons}
                            checked={this.state.dynamicButtons}

                            onChange={async () => {
                                await this.setAsyncState({
                                    dynamicButtons: !this.state.dynamicButtons
                                })
                                this.props.onUpdate(this.state)
                            }}
                        />
                    </Tooltip>
                </div>
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
        )
            ;
    }
}

export default withStyles(styles)(PagelistModule);
PagelistModule.propTypes = {
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
    moduleOptions: PropTypes.object,
    defaultTheme: PropTypes.object,
}


