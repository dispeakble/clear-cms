import React, { Component } from "react";
import {createTheme, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/prices.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";
import MaterialTable from "material-table";
import {AddCircle, Check, Clear, DeleteForever, Edit} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "../../components/Modal/Modal";

class Prices extends Component {
    state = {
        productPrices: [],
        productList: [],
        currencyList: [{
            id: 1,
            name: "USD"
        },{
            id: 2,
            name: "CAD"
        }],
        showMultipleDeleteModal: false,
        deleteModal: {
            name: "deleteModal",
            title: "Delete Prices",
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

    async componentDidMount() {
        const productList = await this.props.control.listProducts();

        await this.setAsyncState({
            productList: productList
        })

        await this.fetchPrices();
    }

    async fetchPrices() {
        const productPrices = await this.props.control.list();

        await this.setAsyncState({
            productPrices: productPrices
        });
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    multipleDeleteCallback = async () => {
        let ids = [];
        this.state.multipleDeleteData.map((label) => ids.push(label.id));
        await this.props.control.remove({
            id: ids
        });
        await this.fetchPrices();
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
                            totalCount: this.state.productPrices.length,
                            page: 0,
                            data: this.state.productPrices.localities,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.add(newData);
                        await this.fetchPrices();
                        resolve();
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(async (resolve) => {
                        await this.props.control.edit({
                            ...newData,
                            id: oldData.id
                        });
                        await this.fetchPrices();
                        resolve();
                    }),
                onRowDelete: (oldData) =>
                    new Promise(async (resolve) => {
                        await this.props.control.remove({
                            id: [oldData.id]
                        });
                        await this.fetchPrices();
                        resolve();
                    }),
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Product Prices",
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
                    field: "product_id",
                    title: "Product ID",
                    editable: "never"
                },
                {
                    type: "string",
                    field: "product_id",
                    title: "Product Name",
                    validate: rowData => (rowData.product_id && rowData.product_id !== ""),
                    render: (rowData) => {
                        const product = this.state.productList.find((product) => product.id === rowData.product_id);
                        return <React.Fragment>{product ? product.title : ""}</React.Fragment>
                    },
                    editComponent: (columnData) => {
                        let filteredTypes = this.state.productList.filter(
                            (product) => product.id !== columnData.rowData.product_id
                        );
                        let defaultValue;
                        if(columnData.rowData.product_id) {
                            defaultValue = this.state.productList.find((product) => product.id === columnData.rowData.product_id)
                        }
                        return (
                            <Autocomplete
                                options={filteredTypes}
                                autoHighlight
                                className={this.props.classes.option}
                                defaultValue={defaultValue}
                                onChange={(ev, value) => {
                                    if (value && value.id) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            product_id: value.id,
                                        });
                                    }
                                }}
                                getOptionLabel={(option) => option.title || ""}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}{...params}
                                        label="Product Name"
                                        variant="outlined"
                                    />
                                )}
                            />
                        );
                    }
                },
                {
                    type: "numeric",
                    field: "value",
                    title: "Value",
                    initialEditValue: 0,
                    validate: rowData => (rowData.value && rowData.value !== 0)
                },
                {
                    type: "string",
                    field: "currency",
                    title: "Currency",
                    validate: rowData => (rowData.currency && rowData.currency > 0),
                    render: (rowData) => {
                        const currency = this.state.currencyList.find((currency) => currency.id === rowData.currency);
                        return <React.Fragment>{currency ? currency.name : ""}</React.Fragment>
                    },
                    editComponent: (columnData) => {
                        let filteredTypes = this.state.currencyList.filter(
                            (currency) => currency.id !== columnData.rowData.currency
                        );
                        let defaultValue;
                        if(columnData.rowData.currency) {
                            defaultValue = this.state.currencyList.find((currency) => currency.id === columnData.rowData.currency)
                        }
                        return (
                            <Autocomplete
                                options={filteredTypes}
                                autoHighlight
                                className={this.props.classes.option}
                                defaultValue={defaultValue}
                                onChange={(ev, value) => {
                                    if (value && value.id) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            currency: value.id,
                                        });
                                    }
                                }}
                                getOptionLabel={(option) => option.name || ""}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}{...params}
                                        label="Currency"
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
                        deleteText: "Are you sure you want to delete this product price?",
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
        const currentList = this.state.productPrices;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Prices</title>
                </Helmet>
                <div className={classes.panel}>
                    <div className={classes.wrapper}>
                        <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                            <MaterialTable
                                title={"Product Prices"}
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

export default withRouter(withStyles(styles)(Prices));
