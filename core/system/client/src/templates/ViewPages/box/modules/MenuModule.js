import React, {Component} from "react";
import Button from "components/CustomButtons/Button.js";
import {withRouter} from "react-router-dom";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import {withStyles, createTheme, MuiThemeProvider} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

// for the material-table within the edit modal options modal
import MaterialTable from "material-table";
import {
    DeleteForever,
    AddCircle,
    Edit,
    Check,
    Clear,
} from "@material-ui/icons";
import * as Icons from "@material-ui/icons";

// for the dropdown
import {Accordion, AccordionDetails, AccordionSummary, Divider, Slider, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for the new color picker
import {SketchPicker} from "react-color";
import reactCSS from "reactcss";

// for Font Awesome
import Icon from "@material-ui/core/Icon";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";

class MenuModule extends Component {
    state = {
        menuOptions: [],
        itemModuleEditId: "",
        showModuleOptionsModal: false,
        modalTitle: "Menu Items",
        richFormattedText: false,
        showMultipleDeleteModal: false,
        tableRef: React.createRef(),
        isMenuVertical: false,
        showAsAccordion: false,
        flatLinks: [],
        stretchToFit: false,
        displayBgColorPicker: false,
        bgColor: {
            r:"",
            g:"",
            b:"",
            a:""
        },
        icons: [],
        icon: "",
        noLinksFound: false,
        horizontallyCentered: false,
        verticallyCentered: false,
        menuIconSpace: 0,
        muiTheme: {},
        backgroundPosition:'center center'
    };

    componentDidMount() {
        if (Object.keys(this.props.moduleOptions).length !== 0) {
            this.setState({
                menuOptions: this.props.moduleOptions.menuOptions,
                isMenuVertical: this.props.moduleOptions.isMenuVertical,
                stretchToFit: this.props.moduleOptions.stretchToFit,
                bgColor: this.props.moduleOptions.bgColor,
                horizontallyCentered: this.props.moduleOptions.horizontallyCentered,
                verticallyCentered: this.props.moduleOptions.verticallyCentered,
                menuIconSpace: this.props.moduleOptions.menuIconSpace,


            });
            if(this.props.moduleOptions.backgroundPosition){
                this.setState({
                    backgroundPosition:this.props.moduleOptions.backgroundPosition
                })
            }
            if (this.props.moduleOptions.showAsAccordion) {
                this.setState({
                    showAsAccordion: this.props.moduleOptions.showAsAccordion,
                });}
            this.getAllLinks();
        }



        let icons = Object.keys(Icons).filter((key) => {
            let show = true;
            if (key.includes("Outlined")) {
                show = false;
            } else if (key.includes("Rounded")) {
                show = false;
            } else if (key.includes("Sharp")) {
                show = false;
            } else if (key.includes("New")) {
                show = false;
            } else if (key.includes("TwoTone")) {
                show = false;
            }
            return show;
        });

        icons = icons.map((key) => {
            return {
                text: key.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
                label: key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(),
            };
        });

        this.setState({icons, muiTheme: this.getTheme()});
    }

    getTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiAccordionDetails: {
                    root: {
                        display: "block"
                    }
                }
            },
        });
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    sendStyles = (targetedColor) => {
        let {r, g, b, a} = targetedColor;
        return reactCSS({
            default: {
                color: {
                    width: "36px",
                    height: "14px",
                    borderRadius: "2px",
                    background: `rgba(${r}, ${g}, ${b}, ${a})`,
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
                    zIndex: 99999,
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

    showMultipleDeleteModal = (evt, data) => {
        this.setState({multipleDeleteData: data, showMultipleDeleteModal: true});
    };

    closeMultipleDeleteModal = () => {
        this.setState({showMultipleDeleteModal: false});
    };

    multipleDeleteCallback = async () => {
        let menuOptions = [...this.state.menuOptions];
        let menuIds = [];
        let multipleDeleteData = this.state.multipleDeleteData;
        multipleDeleteData.map((option) => menuIds.push(option.id));
        menuOptions = menuOptions.filter((option) => {
            return !menuIds.includes(option.id);
        });
        this.handleUpdate({
            menuOptions
        })

        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();

        this.closeMultipleDeleteModal();
    };

    getLinksNested(id) {
        let result = "";
        let link = this.state.menuOptions.find((el) => el.id === id);
        result = link.text;
        if (link && link.parentId) {
            result = this.getLinksNested(link.parentId) + "/" + result;
        }
        return result;
    }

    getAllLinks = async () => {
        let result = [];
        if (this.state.menuOptions && this.state.menuOptions.length) {
            let links = this.state.menuOptions;
            links.map((el) => {
                let linkName = el.text;
                if (el.parentId) {
                    linkName = this.getLinksNested(el.parentId) + "/" + el.text;
                }
                result.push({
                    id: el.id,
                    label: linkName,
                });
                return el;
            });

            await this.setAsyncState({
                flatLinks: result,
            });
        }
    };

    tableOptions = {
        getTheme: () => {
            return createTheme({
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
                    MuiIconButton: {
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
                            totalCount: 100,
                            page: 1,
                            data: this.state.menuOptions,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(async () => {
                            delete newData.tableData;
                            let menuOptions = typeof this.state.menuOptions === typeof [] ? [...this.state.menuOptions] : [];
                            newData.id = menuOptions.length + 1;
                            let newMenuOptions = menuOptions.concat(newData);
                            await this.setAsyncState({menuOptions: newMenuOptions});
                            this.props.onUpdate(this.state);
                            this.getAllLinks();
                            resolve();
                        }, 100);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(async () => {
                            delete newData.tableData;
                            const dataUpdate = [...this.state.menuOptions];
                            const index = oldData.tableData.id;
                            dataUpdate[index] = newData;
                            await this.setAsyncState({menuOptions: dataUpdate});
                            this.props.onUpdate(this.state);
                            this.getAllLinks();
                            resolve();
                        }, 100);
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(async () => {
                            const dataDelete = [...this.state.menuOptions];
                            const index = oldData.tableData.id;
                            dataDelete.splice(index, 1);
                            await this.setAsyncState({menuOptions: dataDelete});
                            this.props.onUpdate(this.state);
                            resolve();
                        }, 100);
                    }),
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Menu Links",
                    icon: () => (
                        <IconButton color="primary">
                            <DeleteForever color="error"/>{" "}
                        </IconButton>
                    ),
                    onClick: async (evt, data) => this.showMultipleDeleteModal(evt, data),
                },
            ],
        },
        props: {
            icons: {
                Add: () => <AddCircle className={this.props.classes.addIcon}/>,
                Check: () => <Check color="primary"/>,
                Clear: () => <Clear color="error"/>,
                Edit: () => (
                    <Edit color="primary"/>
                ),
                Delete: () => (
                    <DeleteForever color="error"/>
                ),
            },
            columns: [
                {title: "Text", field: "text"},
                {
                    title: "Title",
                    field: "title",
                },
                {
                    title: "Link",
                    field: "link",
                },
                {
                    title: "Method",
                    field: "location",
                    width: "100px",
                    lookup: {_self: "In Page", _blank: "New Tab"},
                    initialEditValue: "_self",
                },
                {
                    title: "Icon",
                    field: "icon",
                    editComponent: (columnData) => {
                        return (
                            <Autocomplete
                                className={this.props.classes.option}
                                options={this.state.icons}
                                autoHighlight
                                getOptionLabel={(option) => option.text}
                                value={this.state.icons.find(
                                    (icon) => icon.text === columnData.rowData.icon
                                )}
                                onChange={(ev, value) => {
                                    if (value && value.text) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            icon: value.text,
                                        });
                                    }
                                }}
                                renderOption={(option) => {
                                    return (
                                        <React.Fragment>
                                            <Icon>{option.label}</Icon> {option.text}
                                        </React.Fragment>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        label="Icon"
                                        variant="outlined"
                                    />
                                )}
                            />
                        );
                    },
                },
                {
                    title: "Parent Id",
                    field: "parentId",
                    type: "numeric",
                    editComponent: (columnData) => {
                        let filteredLinks = this.state.flatLinks.filter(
                            (link) => link.id !== columnData.rowData.id
                        );
                        return (
                            <Autocomplete
                                options={filteredLinks}
                                autoHighlight
                                className={this.props.classes.option}
                                value={this.state.flatLinks.find(
                                    (link) => link.id === columnData.rowData.parentId
                                )}
                                onChange={(ev, value) => {
                                    columnData.onRowDataChange({
                                        ...columnData.rowData,
                                        parentId: value.id,
                                    });
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        label="Parent link"
                                        variant="outlined"
                                    />
                                )}
                            />
                        );
                    },
                },
                // { title: "Parent Id", field: "parentId", type: "numeric" },
            ],
            parentChildData: (row, rows) => rows.find((a) => a.id === row.parentId),
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

    handleClick = () => {

        this.handleUpdate({
            displayBgColorPicker: !this.state.displayBgColorPicker
        })
    };

    handleColorPickerClose = () => {
        this.handleUpdate({
            displayBgColorPicker: false
        })
    };

    closeModuleOptionsModal() {
        this.handleUpdate({
            showModuleOptionsModal: false
        })
    }

    handleEdit = async (id) => {
        this.handleUpdate({
            itemModuleEditId: id,
            showModuleOptionsModal: true,

        })
    };
    handleSlider = async (e, newValue) => {
        this.handleUpdate({
            menuIconSpace: newValue
        })

    }
    imgPosStateClass = (type = 'logo', pos) => {
        let posClass = '';
        if (type === 'bg') {
            posClass = this.state.backgroundPosition === pos ? 'selected' : '';
            return posClass;
        }


        return posClass;
    }
    setImgPosition = async (type = 'bg', pos) => {

        if (type === 'bg') {
            this.handleUpdate({
                backgroundPosition: pos
            })
        }

    }

    positionButtons = (type) => {

        const vert = ["top", "center", "bottom"];
        const horiz = ["left", "center", "right"];

        let buttons = [];

        vert.map((v, vi) => {
            horiz.map((h, hi) => {
                buttons.push(
                    <Tooltip title={`${h} ${v}`}>
                        <button key={`${type}-${hi}-${vi}`} onClick={() => {
                            this.setImgPosition(type, `${h} ${v}`)
                        }} className={this.imgPosStateClass(type, `${h} ${v}`)}>
                            {h !== v ? `${h} ${v}` : h }
                        </button>
                    </Tooltip>
                )
                return h;
            })
            return v;
        })

        return buttons;
    }

    handleUpdate(params) {
        const payload = Object.assign({}, {
            menuOptions: this.state.menuOptions,
            isMenuVertical: this.state.isMenuVertical,
            stretchToFit: this.state.stretchToFit,
            bgColor: this.state.bgColor,
            horizontallyCentered: this.state.horizontallyCentered,
            verticallyCentered: this.state.verticallyCentered,
            menuIconSpace: this.state.menuIconSpace,
            backgroundPosition: this.state.backgroundPosition,
            showAsAccordion: this.state.showAsAccordion,

        }, params);
        this.props.onUpdate(payload);
        this.setState(params);
    }

    render() {
        const classes = this.props.classes;
        const bgColorStyles = this.sendStyles(this.state.bgColor || {r:0,b:0,g:0,a:1});

        return (
            <React.Fragment>
                <Accordion>
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
                            Display Options
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{
                        justifyContent: "space-between"
                    }}>
                        <div style={{flex: 1}}>

                            <div>
                                <Typography gutterBottom style={{display: "flex", alignItems: "center"}}>
                                    <span
                                        style={bgColorStyles.swatch}
                                        onClick={() => this.handleClick("displayBgColorPicker")}
                                    >
                                        <span style={bgColorStyles.color}/>
                                    </span>
                                    <span style={{display: "inline", marginLeft: "10px"}}>Background Color</span>
                                </Typography>

                                {this.state.displayBgColorPicker ? (
                                    <div style={bgColorStyles.popover}>
                                        <div
                                            style={bgColorStyles.cover}
                                            onClick={() =>
                                                this.handleColorPickerClose("displayBgColorPicker")
                                            }
                                        />
                                        <SketchPicker
                                            color={this.state.bgColor}
                                            onChange={async (color) => {
                                                this.handleUpdate({
                                                    bgColor: color.rgb,
                                                })
                                            }}
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <Typography id="discrete-slider" gutterBottom>
                                    <Tooltip title="The menu will have collapsible sections for the submenus">
                                        <Switch
                                            checked={this.state.showAsAccordion}
                                            onChange={async () => {
                                                this.handleUpdate({
                                                    showAsAccordion: !this.state.showAsAccordion,
                                                })

                                            }}
                                            value={this.state.showAsAccordion}
                                        />
                                    </Tooltip>
                                    Show as Accordion{" "}
                                </Typography>
                            </div>
                            <div>
                                <Typography id="discrete-slider" gutterBottom>
                                    <Tooltip title="Show the menu links in vertical order">
                                        <Switch
                                            checked={this.state.isMenuVertical}
                                            onChange={async () => {
                                                this.handleUpdate({
                                                    isMenuVertical: !this.state.isMenuVertical,
                                                })

                                            }}
                                            value={this.state.isMenuVertical}
                                        />
                                    </Tooltip>
                                    Vertical Menu
                                </Typography>
                            </div>
                            <div>
                                <Typography id="discrete-slider" gutterBottom>
                                    <Tooltip title="Stretches the menu horizontally and vertically">
                                        <Switch
                                            checked={this.state.stretchToFit}
                                            onChange={async () => {
                                                this.handleUpdate({
                                                    stretchToFit: !this.state.stretchToFit,
                                                })
                                            }}
                                            value={this.state.stretchToFit}
                                        />
                                    </Tooltip>
                                    Stretch to Fit
                                </Typography>
                            </div>

                        </div>
                        <div style={{flex: 1}}>
                            <Typography id="discrete-slider" gutterBottom>
                                Align Item
                                <div className={classes.buttonsPosition}>
                                    {this.positionButtons('bg')}
                                </div>


                            </Typography>

                            <Typography id="discrete-slider" gutterBottom>
                                Spacing Between Icon and Menu
                                <Tooltip title="The amount of space between the icons and the text">
                                    <Slider
                                        aria-label="Temperature"
                                        defaultValue={this.props.moduleOptions.menuIconSpace || this.state.menuIconSpace}
                                        valueLabelDisplay="auto"
                                        step={0.5}
                                        marks
                                        min={0}
                                        max={5}
                                        onChange={this.handleSlider}
                                    />
                                </Tooltip>
                            </Typography>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Divider style={{ margin: "10px 0" }} />
                <MaterialTable
                    style={{width: "100%"}}
                    title="Menu Links"
                    tableRef={this.state.tableRef}
                    columns={this.tableOptions.props.columns}
                    parentChildData={this.tableOptions.props.parentChildData}
                    data={() => this.tableOptions.actions.getData()}
                    icons={this.tableOptions.props.icons}
                    options={this.tableOptions.props.options}
                    editable={this.tableOptions.actions.editable}
                    actions={this.tableOptions.actions.customActions}
                />

                <Dialog
                    classes={{
                        root: classes.center,
                        paper: classes.modal,
                    }}
                    open={this.state.showMultipleDeleteModal}
                    TransitionComponent={this.transition}
                    keepMounted
                    onClose={() => this.closeMultipleDeleteModal()}
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
                        className={classes.modalBody}
                    >
                        <div>Are you sure you want to proceed ?</div>
                    </DialogContent>

                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="transparent"
                            simple
                            onClick={() => this.multipleDeleteCallback()}
                        >
                            <div>Proceed</div>
                        </Button>
                        <Button
                            color="danger"
                            simple
                            onClick={() => {
                                this.closeMultipleDeleteModal();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(MenuModule));

MenuModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func
};