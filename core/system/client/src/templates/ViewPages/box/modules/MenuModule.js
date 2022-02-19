import React, {Component} from "react";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";
// for the modal
import IconButton from "@material-ui/core/IconButton";

import {withStyles, createTheme} from "@material-ui/core/styles";

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
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Divider,
    FormControlLabel,
    Slider,
    TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

// for Font Awesome
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import Modal from "components/Modal/Modal";
import ColorPicker from "components/ColorPicker/ColorPicker";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class MenuModule extends Component {
    state = {
        menuItems: [],
        isMenuVertical: false,
        showAsAccordion: false,
        stretchToFit: false,
        backgroundColor: this.props.moduleOptions.backgroundColor || "#FFFFFF",
        icon: "",
        horizontallyCentered: false,
        verticallyCentered: false,
        menuIconSpace: 0,

        /* ignore from here down */
        backgroundColorOpen: false,
        tableRef: React.createRef(),
        flatLinks: [],
        icons: [],
        boxModuleEditId: "",
        showModuleOptionsModal: false,
        showDeleteBoxModal: false,
    };

    modals = {
        deleteBoxModal: {
            name: "deleteBoxModal",
            title: "Confirm Delete Box",
            content: "Are you sure you want to delete the menu items?",
            modalSize: "small",
            closeButton: {
                callback: () => {
                    this.setState({showDeleteBoxModal: false});
                },
                label: "Cancel",
            },
            confirmButton: {
                show: true,
                callback: () => {
                    this.multipleDeleteCallback();
                },
                label: "Delete",
            },
        }
    }

    async componentDidMount() {
        if (Object.keys(this.props.moduleOptions || {}).length !== 0) {
            const statePayload = {
                menuItems: this.props.moduleOptions.menuItems,
                isMenuVertical: this.props.moduleOptions.isMenuVertical,
                stretchToFit: this.props.moduleOptions.stretchToFit,
                backgroundColor: this.props.moduleOptions.backgroundColor,
                horizontallyCentered: this.props.moduleOptions.horizontallyCentered,
                verticallyCentered: this.props.moduleOptions.verticallyCentered,
                menuIconSpace: this.props.moduleOptions.menuIconSpace,
                showAsAccordion: false,
            };

            if (this.props.moduleOptions.showAsAccordion) {
                statePayload.showAsAccordion = this.props.moduleOptions.showAsAccordion
            }

            await this.setAsyncState(statePayload);
            this.getAllLinks();
        }

        let icons = Object.keys(Icons).filter((key) => {
            let show = true;
            if (key.includes("Outlined")
                || key.includes("Rounded")
                || key.includes("Sharp")
                || key.includes("New")
                || key.includes("TwoTone")
            ) {
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

        this.setState({
            icons
        });
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    showDeleteBoxModal = (evt, data) => {
        this.setState({multipleDeleteData: data, showDeleteBoxModal: true});
    };

    closeDeleteModal = () => {
        this.setState({showDeleteBoxModal: false});
    };

    multipleDeleteCallback = async () => {
        let menuItems = [...this.state.menuItems];
        let menuIds = [];
        let multipleDeleteData = this.state.multipleDeleteData;
        multipleDeleteData.map((option) => menuIds.push(option.id));
        menuItems = menuItems.filter((option) => {
            return !menuIds.includes(option.id);
        });
        await this.setAsyncState({menuItems});
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();

        this.closeDeleteModal();
    };

    getLinksNested(id) {
        let link = this.state.menuItems.find((el) => el.id === id);
        let result = link.text;
        if (link && link.parentId) {
            result = this.getLinksNested(link.parentId) + "/" + result;
        }
        return result;
    }

    getAllLinks = async () => {
        let result = [];

        if (this.state.menuItems && this.state.menuItems.length) {

            let links = this.state.menuItems;
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

            this.setState({
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
                            data: this.state.menuItems,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(async () => {
                            delete newData.tableData;
                            let menuItems = typeof this.state.menuItems === typeof [] ? [...this.state.menuItems] : [];
                            newData.id = menuItems.length + 1;
                            let newmenuItems = menuItems.concat(newData);
                            await this.setAsyncState({menuItems: newmenuItems});
                            this.onUpdate(this.state);
                            this.getAllLinks();
                            resolve();
                        }, 100);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(async () => {
                            delete newData.tableData;
                            const dataUpdate = [...this.state.menuItems];
                            const index = oldData.tableData.id;
                            dataUpdate[index] = newData;
                            await this.setAsyncState({menuItems: dataUpdate});
                            this.onUpdate(this.state);
                            this.getAllLinks();
                            resolve();
                        }, 100);
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(async () => {
                            const dataDelete = [...this.state.menuItems];
                            const index = oldData.tableData.id;
                            dataDelete.splice(index, 1);
                            await this.setAsyncState({menuItems: dataDelete});
                            this.onUpdate(this.state);
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
                    onClick: () => {
                        this.setState({
                            showDeleteBoxModal: true
                        })
                    },
                },
            ],
        },
        props: {
            icons: {
                Add: () => <AddCircle/>,
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

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

    handleEdit = async (id) => {
        await this.setAsyncState({
            boxModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };
    handleSlider = async (e, newValue) => {
        this.onUpdate({
            menuIconSpace: newValue
        });
    }

    onUpdate(params) {
        this.props.onUpdate(Object.assign({}, {
            menuItems: this.state.menuItems,
            isMenuVertical: this.state.isMenuVertical,
            showAsAccordion: this.state.showAsAccordion,
            stretchToFit: this.state.stretchToFit,
            backgroundColor: this.state.backgroundColor,
            icon: this.state.icon,
            horizontallyCentered: this.state.horizontallyCentered,
            verticallyCentered: this.state.verticallyCentered,
            menuIconSpace: this.state.menuIconSpace
        }, params))
        this.setState(params)
    }

    render() {
        return (
            <React.Fragment>
                <div style={{flex: 1, display: "flex"}}>
                    <div style={{flex: 1}}>
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
                                    Menu module settings
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{padding: 0}}>
                                <div style={{flex: 1}}>
                                    <h4>Style Options</h4>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            The text inside the menu items will be centered horizontally
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.horizontallyCentered}
                                                    onChange={() => this.onUpdate({
                                                        horizontallyCentered: !this.state.horizontallyCentered
                                                    })}
                                                />}
                                                label="Center text horizontally"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            The text inside the menu items will be centered vertically
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.verticallyCentered}
                                                    onChange={() => this.onUpdate({
                                                        verticallyCentered: !this.state.verticallyCentered
                                                    })}
                                                />}
                                                label="Center text vertically"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            Select a background color for the menu items
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem', alignItems: 'center'}}>
                                            <ColorPicker
                                                isOpen={this.state.backgroundColorOpen}
                                                color={this.state.backgroundColor}
                                                label="Background color"
                                                onChange={(color) => {
                                                    this.onUpdate({
                                                        backgroundColor: color
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <h4>Menu mode</h4>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            The menu will be displayed as an accordion
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.showAsAccordion}
                                                    onChange={() => this.onUpdate({
                                                        showAsAccordion: !this.state.showAsAccordion
                                                    })}
                                                />}
                                                label="Display as Accordion"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            The menu will be displayed vertically
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.isMenuVertical}
                                                    onChange={() => this.onUpdate({
                                                        isMenuVertical: !this.state.isMenuVertical
                                                    })}
                                                />}
                                                label="Vertical menu"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            The menu will be stretched to the box dimensions
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                            <FormControlLabel
                                                control={<Switch
                                                    checked={this.state.stretchToFit}
                                                    onChange={() => this.onUpdate({
                                                        stretchToFit: !this.state.stretchToFit
                                                    })}
                                                />}
                                                label="Stretch to Fit"/>
                                        </div>
                                    </div>
                                    <h4>Spacing options</h4>
                                    <div>
                                        <Typography gutterBottom variant="caption">
                                            Adjust the space between the icons and the text
                                        </Typography>
                                        <div style={{display: 'flex', marginBottom: '0.35rem'}}>
                                            <Slider
                                                aria-label="Temperature"
                                                value={this.state.menuIconSpace}
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={100}
                                                onChange={this.handleSlider}
                                                onChangeCommitted={this.handleSlider}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </AccordionDetails>
                        </Accordion>
                        <Divider style={{margin: "10px 0"}}/>
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

                        <Modal
                            showModal={this.state.showDeleteBoxModal}
                            {...this.modals.deleteBoxModal}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(MenuModule);

MenuModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    onUpdate: PropTypes.func,
    defaultTheme: PropTypes.object
};