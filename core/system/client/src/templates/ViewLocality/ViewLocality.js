import React, { Component } from "react";
import {createTheme, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/locality.js";
import countries from 'iso-3166-1-codes'

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";
import MaterialTable from "material-table";
import {AddCircle, Check, Clear, DeleteForever, Edit} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "../../components/Modal/Modal";

class Locality extends Component {
    state = {
        localities: [],
        countryList: [...countries],
        showMultipleDeleteModal: false,
        deleteModal: {
            name: "deleteModal",
            title: "Delete Locality",
            content: <div>Are you sure you want to proceed ?</div>,
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

    componentDidMount() {
        this.fetchLocality();
    }

    async fetchLocality() {
        const localityList = await this.props.control.list();

        await this.setAsyncState({
            localities: localityList
        })
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    multipleDeleteCallback = async () => {
        let ids = [];
        this.state.multipleDeleteData.map((label) => ids.push(label.id));
        await this.props.control.remove({
            id: ids
        });
        await this.fetchLocality();
        await this.setAsyncState({
            showMultipleDeleteModal: false
        })
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
                            totalCount: this.state.localities.length,
                            page: 0,
                            data: this.state.localities,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.add(newData);
                        await this.fetchLocality();
                        resolve();
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(async (resolve) => {
                        await this.props.control.edit({
                            ...newData,
                            id: oldData.id
                        });
                        await this.fetchLocality();
                        resolve();
                    }),
                onRowDelete: (oldData) =>
                    new Promise(async (resolve) => {
                        await this.props.control.remove({
                            id: [oldData.id]
                        });
                        await this.fetchLocality();
                        resolve();
                    }),
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Localities",
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
                    field: "country_id",
                    title: "Country",
                    validate: rowData => (rowData.country_id && rowData.country_id !== ""),
                    render: (rowData) => {
                        const country = this.state.countryList.find((country) => country.numeric === rowData.country_id);
                        return <React.Fragment>{country ? country.name : ""}</React.Fragment>
                    },
                    editComponent: (columnData) => {
                        let filteredTypes = this.state.countryList.filter(
                            (country) => country.numeric !== columnData.rowData.country_id
                        );
                        let defaultValue;
                        if(columnData.rowData.country_id) {
                            defaultValue = this.state.countryList.find((country) => country.numeric === columnData.rowData.country_id)
                        }
                        return (
                            <Autocomplete
                                options={filteredTypes}
                                autoHighlight
                                className={this.props.classes.option}
                                defaultValue={defaultValue}
                                onChange={(ev, value) => {
                                    if (value && value.numeric) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            country_id: value.numeric,
                                        });
                                    }
                                }}
                                getOptionLabel={(option) => option.name || ""}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}{...params}
                                        label="Country"
                                        variant="outlined"
                                    />
                                )}
                            />
                        );
                    }
                },
                {
                    type: "string",
                    field: "gps",
                    title: "GPS",
                    validate: rowData => (rowData.gps && rowData.gps !== "")
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
                        deleteText: "Are you sure you want to delete this locality?",
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
        const currentList = this.state.localities;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Locality</title>
                </Helmet>
                <div className={classes.panel}>
                    <div className={classes.wrapper}>
                        <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                            <MaterialTable
                                title={"Product Locality"}
                                columns={this.tableOptions.props.columns}
                                data={currentList} // if u use getData() it won't work
                                options={this.tableOptions.props.options}
                                actions={this.tableOptions.actions.customActions}
                                localization={this.tableOptions.props.localization}
                                editable={this.tableOptions.actions.editable}
                                icons={this.tableOptions.props.icons}
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

export default withRouter(withStyles(styles)(Locality));
