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
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import PropTypes from "prop-types";
//todo import modal content to add category

class Categories extends Component {
    state = {
        tableRef: React.createRef(),
        showModal: false,
        categories: [],
        showMultipleDeleteModal: false,
        flatCategories: [],
        defaultTheme: "",
        removeBg: {},
        currentPage: 1,
    };

    async componentDidMount() {
        this.generateFlatCategories()
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, () => resolve()));

    refresh = () => {
        this.generateFlatCategories();
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange()
    };

    getFlatCategory(row) {
        if(!row.parentId) return "";

        const cat = this.state.flatCategories.find((cat) => {
            return cat.id === row.parentId
        });

        if(cat) {
            return cat.label;
        }

        return "";
    }

    getCategoriesNested(id, categories) {
        let cat = categories.find((el) => el.id === id);
        let result = cat.title;
        if (cat && cat.parentId) {
            result = this.getCategoriesNested(cat.parentId, categories) + "/" + result;
        }
        return result;
    }

    generateFlatCategories = async () => {
        let categories = await this.props.control.list();
        if(!categories.count) {
            return;
        }

        let result = [];

        categories.rows.map((el) => {
            let catTitle = el.title;
            if (el.parentId) {
                catTitle = this.getCategoriesNested(el.parentId, categories.rows) + "/" + el.title;
            }
            result.push({
                id: el.id,
                label: catTitle,
            });
            return el;
        });

        this.setState({
            flatCategories: result,
        });
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
            getData: (query) => {
                return new Promise((resolve) => {
                    (async () => {
                        const payload = {
                            search: query.search,
                            limit: [query.page * query.pageSize, query.pageSize]
                        };

                        if(query.orderBy) {
                            const orderBy = {};

                            orderBy[query.orderBy.field] = query.orderDirection;
                            payload.order = orderBy;
                        }

                        const result = await this.props.control.list(payload);

                        if(result && result.rows) {
                            resolve({
                                data: result.rows,
                                page: query.page,
                                totalCount: result.count,
                            })
                        }
                    })()
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        this.props.control.add({
                            title: newData.title,
                            description: newData.description,
                            backgroundImage: newData.backgroundImage,
                            parentId: newData.parentId || 0,
                        }).then(() => {
                            this.refresh()
                            resolve();
                        });
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        this.props.control.set({
                            id: oldData.id,
                            title: newData.title,
                            description: newData.description,
                            backgroundImage: newData.backgroundImage,
                            parentId: newData.parentId,
                            removeBg: this.state.removeBg[oldData.id]
                        }).then(() => {
                            this.setState({
                                removeBg: {...this.state.removeBg, [oldData.id]: false}
                            })
                            this.refresh();
                            resolve();
                        });

                    }),
                onRowUpdateCancelled: () =>
                    new Promise((resolve) => {
                        this.setState({
                            removeBg: {}
                        })
                        resolve()
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        this.props.control.rem({
                            id: [oldData.id],
                            backgroundImage: oldData.backgroundImage
                        }).then(() => {
                            this.refresh();
                            resolve();
                        });
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
                { title: "Title", field: "title" },
                {
                    title: "Description",
                    field: "description",
                },
                {
                    title: "Background Image",
                    field: "backgroundImage",
                    render: (rowData) => <Checkbox disabled checked={!!rowData.backgroundImage} />,
                    editComponent: (columnData) => {
                        let renderCheckbox = false
                        if((!_.isEmpty(columnData.rowData)) && columnData.rowData.backgroundImage && columnData?.rowData?.tableData && !this.state.removeBg[columnData.rowData.id] && !columnData.rowData.backgroundImage.name){
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
                                                backgroundImage: event.target.files[0],
                                            });
                                        }
                                    }}
                                    name={"backgroundImage"}
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
                    field: "parentId",
                    type: "numeric",
                    render: this.getFlatCategory.bind(this),
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
                                    return this.state.flatCategories.find(
                                        (link) => link.id === columnData.rowData.parentId
                                    );
                                }}
                                onChange={(ev, value) => {
                                    if (value && value['label']) {
                                        columnData.onRowDataChange({
                                            ...columnData.rowData,
                                            parentId: value['id'],
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
            parentChildData: (row, rows) => rows.find((a) => a.id === row.parentId),
            options: {
                selection: true,
                selectionStyle: styles['selection'],
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
        let catIds = [];
        this.state.multipleDeleteData.map((cat) => catIds.push(cat.id));
        await this.props.control.rem({
            id: catIds
        });
        this.refresh();
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
                <div className={classes.wrapper}>
                    <MuiThemeProvider theme={this.tableOptions.getTheme()}>
                        <MaterialTable
                            title="Categories"
                            tableRef={this.state.tableRef}
                            columns={this.tableOptions.props.columns}
                            parentChildData={this.tableOptions.props.parentChildData}
                            data={this.tableOptions.actions.getData.bind(this)}
                            icons={this.tableOptions.props.icons}
                            options={this.tableOptions.props.options}
                            editable={this.tableOptions.actions.editable}
                            actions={this.tableOptions.actions.customActions}
                        />
                    </MuiThemeProvider>
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
                        <div>Are you sure you want to delete the selected categories?</div>
                    </DialogContent>

                    <DialogActions className={classes.modalFooter}>
                        <Button
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

export default withStyles(styles)(Categories);

Categories.propTypes = {
    control: PropTypes.object,
    defaultTheme: PropTypes.object,
    classes: PropTypes.object
}