import React, {Component} from "react";
import {createTheme, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/labels.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";
import MaterialTable from "material-table";
import {AddCircle, Check, Clear, DeleteForever, Edit} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "../../components/Modal/Modal";
import * as PropTypes from "prop-types";
import ArrayBuilder from "./ArrayBuilder";

class Labels extends Component {
    state = {
        title: "",
        value: "",
        description: "",
        type: "",
        active: false,
        labels: [],
        labelTypes: ["numeric", "string", "boolean", "date", "datetime", "time", "array", "object"],
        showMultipleDeleteModal: false,
        deleteModal: {
            name: "deleteModal",
            title: "Delete Labels",
            content: "Are you sure you want to proceed ?",
            closeButton: {
                callback: () => {
                    this.setState({ showMultipleDeleteModal: false });
                },
                label: "Cancel",
            },
            confirmButton: {
                callback: async () => {
                    await this.multipleDeleteCallback();
                },
                label: "Proceed",
            },
        },
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        await this.fetchLabels();
    }

    async fetchLabels() {
        const labels = await this.props.control.list();

        await this.setAsyncState({
            labels: labels
        })
    }

    multipleDeleteCallback = async () => {
        let ids = [];
        this.state.multipleDeleteData.map((label) => ids.push(label.id));
        await this.props.control.remove({
            id: ids
        });
        await this.fetchLabels();
        await this.setAsyncState({
            showMultipleDeleteModal: false
        })
    };

    generateEditableComponent(columnData) {
        const type = columnData.rowData.type;
        switch(true) {
            case ["string", "date", "time"].indexOf(type) > -1:
                return (<TextField
                    className={this.props.classes.textfield}
                    value={columnData.rowData.value}
                    type={columnData.rowData.type}
                    onChange={(e) => e.target &&
                        columnData.onRowDataChange({
                            ...columnData.rowData,
                            value: e.target.value,
                        })
                    }
                    label="Value"
                />)
            case type === "numeric":
                return (<TextField
                    className={this.props.classes.textfield}
                    value={columnData.rowData.value}
                    type="number"
                    onChange={(e) => e.target &&
                        columnData.onRowDataChange({
                            ...columnData.rowData,
                            value: e.target.value,
                        })
                    }
                    label="Value"
                />)
            case type === "datetime":
                return (<TextField
                    className={this.props.classes.textfield}
                    value={columnData.rowData.value}
                    type="datetime-local"
                    onChange={(e) => e.target &&
                        columnData.onRowDataChange({
                            ...columnData.rowData,
                            value: e.target.value,
                        })
                    }
                    label="Value"
                />)
            case type === "array":
                let itemList = [];
                try {
                    itemList = JSON.parse(columnData.rowData.value);
                } catch (e) {
                    itemList = []
                }
                return (<ArrayBuilder value={itemList} onChange={(value) => {
                    columnData.onRowDataChange({
                        ...columnData.rowData,
                        value: JSON.stringify(value),
                    })
                }} />)
            case type === "object":
                return (<TextField
                    className={this.props.classes.textfield}
                    value={columnData.rowData.value}
                    type="string"
                    onChange={(e) => e.target &&
                        columnData.onRowDataChange({
                            ...columnData.rowData,
                            value: e.target.value,
                        })
                    }
                    label="Value"
                />)
            case type === "boolean":
                return (
                    <Checkbox checked={parseInt(columnData.rowData.value) === 1} onChange={(ev, checked) => {
                        columnData.onRowDataChange({
                            ...columnData.rowData,
                            value: checked ? 1 : 0,
                        });
                    }
                    } />
                )
            default:
                return (<p>Invalid Data type</p>)
        }
    }

    render() {
        const classes = this.props.classes;
        const currentList = this.state.labels;

        const tableOptions = {
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
                                totalCount: this.state.labels.length,
                                page: 0,
                                data: this.state.labels,
                            };
                            resolve(payload);
                        }, 300);
                    });
                },
                editable: {
                    onRowAdd: (newData) =>
                        new Promise(async (resolve, reject) => {
                            await this.props.control.add(newData);
                            await this.fetchLabels();
                            resolve();
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(async (resolve) => {
                            await this.props.control.edit({
                                ...newData,
                                id: oldData.id
                            });
                            await this.fetchLabels();
                            resolve();
                        }),
                    onRowDelete: (oldData) =>
                        new Promise(async (resolve) => {
                            await this.props.control.remove({
                                id: [oldData.id]
                            });
                            await this.fetchLabels();
                            resolve();
                        }),
                },
                customActions: [
                    {
                        tooltip: "Remove All Selected Labels",
                        icon: () => (
                            <DeleteForever />
                        ),
                        onClick: async (evt, data) => this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true }),
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
                        title: "Title",
                        validate: rowData => (rowData.title && rowData.title !== "")
                    },
                    {
                        type: "string",
                        field: "value",
                        title: "Value",
                        editComponent: (columnData) => {
                            const editable = this.generateEditableComponent(columnData);
                            return editable;
                        }
                    },
                    {
                        type: "string",
                        field: "description",
                        title: "Description",
                        validate: rowData => (rowData.description && rowData.description !== "")
                    },
                    {
                        type: "string",
                        field: "type",
                        title: "Type",
                        initialEditValue: "string",
                        editComponent: (columnData) => {
                            let filteredTypes = this.state.labelTypes.filter(
                                (label) => label !== columnData.rowData.type
                            );
                            return (
                                <Autocomplete
                                    options={filteredTypes}
                                    autoHighlight
                                    className={this.props.classes.option}
                                    defaultValue={columnData.rowData.type}
                                    onChange={(ev, value) => {
                                        if (value) {
                                            columnData.onRowDataChange({
                                                ...columnData.rowData,
                                                type: value,
                                            });
                                        }
                                    }}
                                    getOptionLabel={(option) => option || ""}
                                    renderInput={(params) => (
                                        <TextField
                                            className={this.props.classes.textfield}{...params}
                                            label="Type"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            );
                        }
                    },
                    {
                        type: "numeric",
                        field: "active",
                        title: "Active",
                        initialEditValue: 0,
                        render: (rowData) => <Checkbox disabled checked={rowData.active} />,
                        editComponent: (columnData) => {
                            return (
                                <Checkbox checked={columnData.rowData.active === 1} onChange={(ev, checked) => {
                                    columnData.onRowDataChange({
                                        ...columnData.rowData,
                                        active: checked ? 1 : 0,
                                    });
                                }
                                } />
                            )
                        }
                    }
                ],
                localization: {
                    body: {
                        editRow: {
                            deleteText: "Are you sure you want to delete this label?",
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

        return (
            <React.Fragment>
                <Helmet>
                    <title>Labels</title>
                </Helmet>
                <div className={classes.panel}>
                    <div className={classes.wrapper}>
                        <MuiThemeProvider theme={tableOptions.getTheme()}>
                            <MaterialTable
                                title={"Product Labels"}
                                columns={tableOptions.props.columns}
                                data={currentList} // if u use getData() it won't work
                                options={tableOptions.props.options}
                                actions={tableOptions.actions.customActions}
                                localization={tableOptions.props.localization}
                                editable={tableOptions.actions.editable}
                                icons={tableOptions.props.icons}
                            />
                        </MuiThemeProvider>
                    </div>
                </div>
                <Modal
                    showModal={this.state.showMultipleDeleteModal}
                    {...this.state.deleteModal}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Labels));
