import React, { Component } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pages.js";

import { Helmet } from "react-helmet";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { withRouter } from "react-router-dom";

// for the modal
import Modal from "../../components/Modal/Modal";

import {Edit, DeleteForever, Visibility, FileCopy} from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";

import MaterialTable from "material-table";
import PropTypes from "prop-types";

class Pages extends Component {
    state = {
        tableRef: React.createRef(),
        showModal: false,
        cat_list: [],
        pages: [],
        templates: [],
        currentPage: 1,
        showDeleteModal: false,
        isTemplate: false,
        deleteModalProps: {
            name: "deleteSelectedImages",
            title: "Delete selected pages",
            content: "Are you sure you want to delete these pages?",
            closeButton: {
                callback: () => {
                    this.closeDeleteModal()
                },
                label: "Cancel",
            },
            confirmButton: {
                show: true,
                callback: () => {
                    this.deleteCallback()
                },
                label: "Delete",
            },
        }
    };

    componentDidMount() {
        if (this.props.location.pathname === "/pages/template") {
            this.setState({isTemplate: true})
        }
    }

    async getData(query) {
        return new Promise((resolve) => {

            (async () => {

                const payload = {
                    search: query.search,
                    isTemplate: this.state.isTemplate,
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
    }

    async fetchPages() {
        let pages = [];
        let templates = [];
        let pagesFromStorage = await this.props.control.list();

        if(pagesFromStorage && pagesFromStorage.length){
            pagesFromStorage.map((page) => {
                pages.push({
                    id: page.id,
                    title: page.pageConfig.title,
                    active: <Checkbox disabled checked={page.pageConfig.active} />,
                    isHome: (
                        <Checkbox disabled checked={page.pageConfig.isHome} />
                    ),
                    isTemplate: page.pageConfig.isTemplate,
                    category: page.pageConfig.category,
                });
                return page;
            });
            this.setState({ pages, templates });
        }

    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    showDeleteModal = (evt, data) => {
        this.setState({
            deleteData: data,
            showDeleteModal: true,
        });
    };

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false, });
    };

    deleteCallback = async () => {
        let pages = [...this.state.pages]
        let pagesIds = [];
        let deleteData = this.state.deleteData;
        deleteData.map((page) => pagesIds.push(page.id));
        this.props.control.rem({id: pagesIds})
        let newPages = pages.filter((page) => {
            return !pagesIds.includes(page.id);
        });

        await this.setAsyncState({ pages: newPages });
        this.closeDeleteModal();

        this.refresh();
    };

    refresh = async () => {
        this.state.tableRef.current && this.state.tableRef.current.onQueryChange()
    };

    render() {
        const classes = this.props.classes;
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
                            let truncatedData = this.state.pages.slice(
                                query.page,
                                query.pageSize
                            );
                            let payload = {
                                totalCount: this.state.pages.length,
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
                        tooltip: this.state.isTemplate ? "Add Template" : "Add Page",
                        isFreeAction: true,
                        iconProps: {
                            style: { color: this.props.defaultTheme.primary?.main || "green" },
                        },
                        onClick: () => {
                            this.props.history.push({pathname: `/pages/add`, state: {
                                    templateMode: this.state.isTemplate
                                }
                            });
                        },
                    },
                    {
                        tooltip: this.state.isTemplate ? "Remove All Selected Templates" : "Remove All Selected Pages",

                        icon: () => (
                            <DeleteForever color="error" />
                        ),
                        onClick: async (evt, data) => this.showDeleteModal(evt, data),
                    },
                    {
                        position: "row",
                        icon: () => (
                            <Visibility color="primary" />
                        ),
                        tooltip: this.state.isTemplate ? "Template Preview" : "Page Preview",
                        onClick: (event, rowData) => {
                            window.open(`/pages/preview/${Number(rowData.id)}`);
                        },
                    },
                    {
                        position: "row",
                        tooltip: "Edit",
                        icon: () => (
                            <Edit color="secondary" className={this.props.classes.editItemIcon} />
                        ),
                        onClick: (event, rowData) => {
                            this.props.history.push({
                                pathname:  `/pages/edit/${Number(rowData.id)}`,
                                state: {
                                    templateMode: this.state.isTemplate
                                }
                            });
                        },
                    },
                    {
                        position: "row",
                        tooltip: "Duplicate",
                        icon: () => (
                            <FileCopy color="primary" className={this.props.classes.editItemIcon} />
                        ),
                        onClick: async (event, rowData) => {
                            alert(await this.props.control.duplicate({
                                id: rowData.id
                            }));
                        },
                    },
                    {
                        position: "row",
                        icon: () => (
                            <DeleteForever color="error" />
                        ),
                        tooltip: "Delete",
                        onClick: async (evt, data) => {
                            this.showDeleteModal(evt, [data])
                        },
                    },
                ],
            },
            props: {
                columns: [
                    { title: "Title", field: "title" },
                    ...(this.state.isTemplate ? [] : [{
                        title: "Category",
                        field: "category",
                        },
                        {
                            title: "Publish",
                            headerStyle: {
                                width: "300px",
                            },
                            field: "active",
                        },
                        {
                            title: "Default Page",
                            headerStyle: {
                                width: "300px",
                            },
                            field: "isHome",
                        }]),
                    { title: "Id", field: "id", hidden: true },
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
                    debounceInterval: 300
                },
            },
        };
        return (
            <React.Fragment>
                <Helmet>
                    <title>Pages</title>
                </Helmet>
                <div className={classes.pagesPanel}>
                    <div className={classes.pagesWrapper}>
                        <div style={{marginBottom: "15px", textAlign: 'right'}}>
                            <ToggleButtonGroup
                                value={this.state.isTemplate}
                                exclusive
                               >
                                <ToggleButton value={false} onClick={()=>this.props.history.push('./')}>
                                    Pages
                                </ToggleButton>
                                <ToggleButton value={true}  onClick={()=>this.props.history.push('/pages/template')}>
                                    Templates
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <MuiThemeProvider theme={tableOptions.getTheme()}>
                            <MaterialTable
                                title={this.state.isTemplate ? "Templates List" : "Pages List"}
                                tableRef={this.state.tableRef}
                                columns={tableOptions.props.columns}
                                data={this.getData.bind(this)}
                                options={tableOptions.props.options}
                                actions={tableOptions.actions.customActions}
                            />
                        </MuiThemeProvider>
                    </div>
                </div>
                <Modal
                    modalSize="small"
                showModal={this.state.showDeleteModal}
                {...this.state.deleteModalProps}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Pages));

Pages.propTypes = {
    history: PropTypes.object,
    control: PropTypes.object,
    classes: PropTypes.object,
    location: PropTypes.object,
    defaultTheme: PropTypes.object
};