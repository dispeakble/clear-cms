import React, { Component } from "react";
import { withStyles, createMuiTheme } from "@material-ui/core/styles";
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
import Icon from "@material-ui/core/Icon";

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
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
//todo import modal content to add category

class Categories extends Component {
    state = {
        tableRef: React.createRef(),
        showModal: false,
        cat_list: [],
        categories: [],
        showMultipleDeleteModal: false,
        flatCategories: [],
        defaultTheme: "",
        removeBg: {},
    };

    async componentDidMount() {
        this.list();
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    getCategoriesNested(id) {
        let result = "";
        let cat = this.state.categories.find((el) => el.id === id);
        result = cat.title;
        if (cat && cat.parentid) {
            result = this.getCategoriesNested(cat.parentid) + "/" + result;
        }
        return result;
    }

    list = async () => {
        let result = [];

        const categories = await this.props.control.list();

        await this.setAsyncState({
            categories
        })

        if (categories.length) {
            let links = categories;
            links.map((el) => {
                let catTitle = el.title;
                if (el.parentid) {
                    catTitle = this.getCategoriesNested(el.parentid) + "/" + el.title;
                }
                result.push({
                    id: el.id,
                    label: catTitle,
                });
                return el;
            });

            await this.setAsyncState({
                flatCategories: result,
            });
        }
    };

    tableOptions = {
        getTheme: () => {
            return createMuiTheme({
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
                            totalCount: 100,
                            page: 1,
                            data: this.state.categories,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.add({
                            title: newData.title,
                            description: newData.description,
                            backgroundimage: newData.backgroundimage,
                            parentid: newData.parentid || 0,
                        });
                        this.list()
                        resolve();
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.edit({
                            id: oldData.id,
                            title: newData.title,
                            description: newData.description,
                            backgroundimage: newData.backgroundimage,
                            parentid: newData.parentid,
                            removeBg: this.state.removeBg[oldData.id]
                        });
                        this.setState({
                            removeBg: {...this.state.removeBg, [oldData.id]: false}
                        })
                        this.list();
                        resolve();
                    }),
                onRowUpdateCancelled: () =>
                    new Promise(async (resolve) => {
                        this.setState({
                            removeBg: {}
                        })
                        resolve()
                    }),
                onRowDelete: (oldData) =>
                    new Promise(async (resolve, reject) => {
                        await this.props.control.remove({
                            id: [oldData.id],
                            backgroundimage: oldData.backgroundimage
                        });
                        this.list();
                        resolve();
                    }),
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Categories",
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
                { title: "Title", field: "title" },
                {
                    title: "Description",
                    field: "description",
                },
                {
                    title: "Background Image",
                    field: "backgroundimage",
                    render: (rowData) => <Checkbox disabled checked={!!rowData.backgroundimage} />,
                    editComponent: (columnData) => {
                        let renderCheckbox = false
                        if((!_.isEmpty(columnData.rowData)) && columnData.rowData.backgroundimage && columnData?.rowData?.tableData && !this.state.removeBg[columnData.rowData.id] && !columnData.rowData.backgroundimage.name){
                            renderCheckbox = true
                        }
                        return (
                            <div>
                                <input
                                    type="file"
                                    onChange={(event) => {
                                        if ( event.target?.files?.length) {
                                            columnData.onRowDataChange({
                                                ...columnData.rowData,
                                                backgroundimage: event.target.files[0],
                                            });
                                        }
                                    }}
                                    name={"backgroundimage"}
                                />
                                {renderCheckbox &&
                                    (<Tooltip title="Remove background Image">
                                        <DeleteForever onClick={() => {
                                            this.setState({
                                                removeBg: {...this.state.removeBg, [columnData.rowData.id]: true}
                                            })
                                        }} style={{color: this.props.defaultTheme.secondary.main}} />
                                    </Tooltip>
                                    )
                                }
                            </div>
                        )
                    }
                },
                {
                    title: "Parent Id",
                    field: "parentid",
                    type: "numeric",
                    editComponent: (columnData) => {
                        let filteredCats = this.state.flatCategories.filter(
                            (cat) => cat.id !== columnData.rowData.id
                        );
                        return (
                            <Autocomplete
                                options={filteredCats}
                                autoHighlight
                                className={this.props.classes.option}
                                defaultValue={() => {
                                    let foundLink = this.state.flatCategories.find(
                                        (link) => link.id === columnData.rowData.parentid
                                    );
                                    return foundLink;
                                }}
                                onChange={(ev, value) => {
                                    if (value && value.label) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            parentid: value.id,
                                        });
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        className={this.props.classes.textfield}
                                        {...params}
                                        label="Parent category"
                                        variant="outlined"
                                    />
                                )}
                            />
                        );
                    },
                },
            ],
            parentChildData: (row, rows) => rows.find((a) => a.id === row.parentid),
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
        let categIds = [];
        this.state.multipleDeleteData.map((categ) => categIds.push(categ.id));
        this.props.control.remove({
            id: categIds
        })
        // categories = categories.filter((categ) => {
        //     return !categIds.includes(categ.id);
        // });
        //await this.setAsyncState({ categories });
        //localStorage.setItem("categories", JSON.stringify(categories));
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
        this.closeMultipleDeleteModal();
    };

    render() {
        const classes = this.props.classes;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Categories</title>
                </Helmet>
                <div className={classes.categoriesPanel}>
                    <div className={classes.categoriesWrapper}>
                        <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                            <MaterialTable
                                title="Categories"
                                tableRef={this.state.tableRef}
                                columns={this.tableOptions.props.columns}
                                parentChildData={this.tableOptions.props.parentChildData}
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

export default withStyles(styles)(Categories);
