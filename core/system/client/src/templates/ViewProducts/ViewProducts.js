import React, { Component } from "react";
import {createTheme, withStyles} from "@material-ui/core/styles";

import styles from "assets/jss/clear-crm/views/products.js";

import { Helmet } from "react-helmet";

import { withRouter } from "react-router-dom";
import {DeleteForever, Edit} from "@material-ui/icons";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";
import MaterialTable from "material-table";
import moment from "moment/moment";
import Modal from "../../components/Modal/Modal";

class Products extends Component {
    state = {
        products: [],
        currentPage: 1,
        showDeleteModal: false,
        deleteModal: {
            name: "deleteModal",
            title: "Delete Modal",
            content: "Are you sure you want to delete the selected products?",
            closeButton: {
                callback: () => {
                    this.setState({ showDeleteModal: false });
                },
                label: "Cancel",
            },
            confirmButton: {
                callback: async () => {
                    await this.deleteCallback();
                },
                label: "Proceed",
            },
        },
    };

    componentDidMount() {
        this.fetchProducts();
    }

    async fetchProducts() {
        const products = await this.props.control.list();

        await this.setAsyncState({
            products: products
        })
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    showDeleteModal = (evt, data, deleteQty) => {
        this.setState({
            deleteData: data,
            showDeleteModal: true,
            productId: data.id,
            deleteQty: deleteQty,
        });
    };

    deleteCallback = async () => {
        if (this.state.deleteQty === 1) {
            const products = [...this.state.products];
            const index = this.state.productId;

            await this.props.control.remove({id: index})

            const newProductList = products.filter(product => product.id !== index)

            await this.setAsyncState({
                products: newProductList,
                deleteQty: 0,
                showDeleteModal: false
            })
        } else {
            let products = [...this.state.products]
            let productIds = [];
            let deleteData = this.state.deleteData;
            deleteData.map((product) => productIds.push(product.id));
            this.props.control.remove({id: productIds})
            let newProductList = products.filter((product) => {
                return productIds.indexOf(product.id) === -1;
            });

            await this.setAsyncState({ products: newProductList, showDeleteModal: false });
        }
    };

    render() {
        const currentList = this.state.products;
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
                getData: (query) => {
                    return new Promise((resolve) => {
                        setTimeout(async () => {
                            await this.setAsyncState({
                                currentPage: query.page + 1,
                            });

                            //TODO SORT SERVER SIDE!!!!!!!!!!
                            let truncatedData = this.state.products.slice(
                                query.page,
                                query.pageSize
                            );
                            let payload = {
                                totalCount: this.state.products.length,
                                page: query.page,
                                data: truncatedData,
                            };
                            resolve(payload);
                        }, 300);
                    });
                },
                customActions: [
                    {
                        icon: "add_circle",
                        tooltip: "Add Product",
                        isFreeAction: true,
                        iconProps: {
                            style: { color: this.props.defaultTheme.primary?.main || "green" },
                        },
                        onClick: (event) => {
                            this.props.history.push({pathname: `/products/add`});
                        },
                    },
                    {
                        tooltip: "Remove All Selected Products",

                        icon: () => (
                            <DeleteForever color="error" />
                        ),
                        onClick: async (evt, data) => this.showDeleteModal(evt, data),
                    },
                    {
                        position: "row",
                        tooltip: "Edit",
                        icon: () => (
                            <Edit color="secondary" className={this.props.classes.editItemIcon} />
                        ),
                        onClick: (event, rowData) => {
                            this.props.history.push({
                                pathname:  `/products/edit/${Number(rowData.id)}`,
                            });
                        },
                    },
                    {
                        position: "row",
                        icon: () => (
                            <DeleteForever color="error" />
                        ),
                        tooltip: "Delete",
                        onClick: async (evt, data) => {
                            this.showDeleteModal(evt, data, 1)
                        },
                    },
                ],
            },
            props: {
                columns: [
                    { title: "Title", field: "title" },
                    { title: "Category", field: "categoryId" },
                    { title: "Active", field: "active" },
                    { title: "Date Added", field: "added", render: (rowData) => {
                            return <React.Fragment>{moment(parseInt(rowData.added)).format("L")}</React.Fragment>
                        } },
                ],
                options: {
                    selection: true,
                    selectionStyle: styles.selection,
                    actionsColumnIndex: -1,
                    actionsCellStyle: {
                        width: "auto",
                    },
                    cellStyle: styles.tableCells,
                    headerStyle: styles.tableHeader,
                },
            },
        };
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Products</title>
                </Helmet>
                <div className={classes.panel}>
                    <div className={classes.wrapper}>
                        <MuiThemeProvider theme={tableOptions.getTheme()}>
                            <MaterialTable
                                title={"Products"}
                                columns={tableOptions.props.columns}
                                data={currentList} // if u use getData() it won't work
                                options={tableOptions.props.options}
                                actions={tableOptions.actions.customActions}
                            />
                        </MuiThemeProvider>
                    </div>
                </div>
                <Modal
                    showModal={this.state.showDeleteModal}
                    {...this.state.deleteModal}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Products));
