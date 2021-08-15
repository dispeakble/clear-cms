import React, { Component } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/categories.js";

import { Helmet } from "react-helmet";

import {
    DeleteForever,
    AddCircle,
    Edit,
    Check,
    Clear,
} from "@material-ui/icons";

// from material-table
import MaterialTable from "material-table";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.js";

// for the dropdown
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";

class Users extends Component {
    state = {
        tableRef: React.createRef(),
        showModal: false,
        users: [],
        showMultipleDeleteModal: false,
        defaultTheme: "",
        userTypes: [{
            id: 1, label: "Admin"
        },{
            id: 2, label: "Manager"
        },{
            id: 3, label: "Moderator"
        },{
            id: 4, label: "Client"
        }]
    };

    async componentDidMount() {
        this.list();
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    getUsersNested(id) {
        let result = "";
        let cat = this.state.users.find((el) => el.id === id);
        result = cat.title;
        if (cat && cat.parentid) {
            result = this.getUsersNested(cat.parentid) + "/" + result;
        }
        return result;
    }

    list = async () => {
        let result = [];

        let users = await this.props.control.list();
        if(!users) {
            users = [];
        }

        await this.setAsyncState({
            users
        })

        if (users && users.length) {
            let links = users;
            links.map((el) => {
                let catTitle = el.title;
                if (el.parentid) {
                    catTitle = this.getUsersNested(el.parentid) + "/" + el.title;
                }
                result.push({
                    id: el.id,
                    label: catTitle,
                });
                return el;
            });

            await this.setAsyncState({
                flatUsers: result,
            });
        }
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
                            totalCount: this.state.users.length,
                            page: 0,
                            data: this.state.users,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.add({
                            fname: newData.fname,
                            lname: newData.lname,
                            email: newData.email,
                            password: newData.password,
                            type: newData.type,
                            active: newData.active
                        });
                        this.list()
                        resolve();
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.edit({
                            id: oldData.id,
                            fname: newData.fname,
                            lname: newData.lname,
                            email: newData.email,
                            password: newData.password || "",
                            type: newData.type,
                            active: newData.active
                        });
                        this.list();
                        resolve();
                    }),
                onRowDelete: (oldData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.remove({
                            id: [oldData.id]
                        });
                        this.list();
                        resolve();
                    }),
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Users",
                    icon: () => (
                        <DeleteForever />
                    ),
                    onClick: async (evt, data) => this.showMultipleDeleteModal(evt, data),
                },
            ],
        },
        props: {
            icons: {
                Add: () => <AddCircle className={this.props.classes.addIcon} />,
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
                    field: "fname",
                    title: "First Name",
                    validate: rowData => rowData.fname !== ""
                },
                {
                    type: "string",
                    field: "lname",
                    title: "Last Name",
                    validate: rowData => rowData.lname !== ""
                },
                {
                    type: "string",
                    field: "email",
                    title: "Email",
                    validate: rowData => rowData.email !== ""
                },
                {
                    type: "string",
                    field: "password",
                    title: "Password",
                },
                {
                    type: "numeric",
                    field: "type",
                    title: "Type",
                    validate: rowData => rowData.type >= 0,
                    render: (rowData) => {
                        const type = this.state.userTypes.find((type) => type.id === rowData.type);
                        return <React.Fragment>{type.label}</React.Fragment>;
                    },
                    editComponent: (columnData) => {
                        let filteredTypes = this.state.userTypes.filter(
                            (cat) => cat.id !== columnData.rowData.id
                        );
                        const defaultIndex = filteredTypes.findIndex((type) => type.id === columnData.rowData.type);
                        return (
                            <Autocomplete
                                options={filteredTypes}
                                autoHighlight
                                className={this.props.classes.option}
                                defaultValue={filteredTypes[defaultIndex]}
                                onChange={(ev, value) => {
                                    if (value && value.label) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            type: value.id,
                                        });
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}{...params}
                                        label="User Type"
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

    showMultipleDeleteModal = (evt, data) => {
        this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
    };

    closeMultipleDeleteModal = () => {
        this.setState({ showMultipleDeleteModal: false });
    };

    multipleDeleteCallback = async () => {
        let ids = [];
        this.state.multipleDeleteData.map((user) => ids.push(user.id));
        await this.props.control.remove({
            id: ids
        });
        this.list();
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
        this.closeMultipleDeleteModal();
    };

    render() {
        const classes = this.props.classes;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Users</title>
                </Helmet>
                <div className={classes.categoriesPanel}>
                    <div className={classes.categoriesWrapper}>
                        <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                            <MaterialTable
                                title="Users"
                                tableRef={this.state.tableRef}
                                columns={this.tableOptions.props.columns}
                                data={() => this.tableOptions.actions.getData()}
                                icons={this.tableOptions.props.icons}
                                options={this.tableOptions.props.options}
                                editable={this.tableOptions.actions.editable}
                                actions={this.tableOptions.actions.customActions}
                            />
                        </MuiThemeProvider>
                    </div>
                </div>

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
                        <div>Are you sure you want to delete the selected users?</div>
                    </DialogContent>

                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="transparent"
                            simple
                            onClick={() => this.multipleDeleteCallback()}
                        >
                            <div>Delete</div>
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

export default withStyles(styles)(Users);
