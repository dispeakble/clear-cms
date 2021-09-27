import React, { Component } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pages.js";

import { Helmet } from "react-helmet";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { withRouter } from "react-router-dom";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.js";

import { Edit, DeleteForever, Visibility } from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";

import MaterialTable from "material-table";

class Pages extends Component {
    state = {
        showModal: false,
        cat_list: [],
        pages: [],
        templates: [],
        currentPage: 1,
        showDeleteModal: false,
        pageToDeleteId: "",
        deleteQty: 0,
        isTemplate: false,
    };

    componentDidMount() {
        this.fetchPages();
        if (this.props.location.pathname === "/pages/template") {
            this.setState({isTemplate: true})
        }
    }

    async fetchPages() {
        let pages = [];
        let templates = [];
        let pagesFromStorage = await this.props.control.list();

        if(pagesFromStorage && pagesFromStorage.length){
            pagesFromStorage.map((page) => {
                pages.push({
                    id: page.id,
                    title: page.pageConfig.pageTitle,
                    publish: <Checkbox disabled checked={page.pageConfig.publish} />,
                    defaultPage: (
                        <Checkbox disabled checked={page.pageConfig.defaultPage} />
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

    showDeleteModal = (evt, data, deleteQty) => {
        this.setState({
            deleteData: data,
            showDeleteModal: true,
            pageToDeleteId: data.id,
            deleteQty: deleteQty,
        });
    };

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false, deleteQty: 0 });
    };

    deleteCallback = async () => {
        if (this.state.deleteQty === 1) {
            const pages = [...this.state.pages];
            const index = this.state.pageToDeleteId;

            await this.props.control.remove({id: index})

            const newPages = pages.filter(function( obj ) {
                return obj.id !== index;
            });

            await this.setAsyncState({ pages: newPages, deleteQty: 0 });
            this.closeDeleteModal();
        } else {
            let pages = [...this.state.pages]
            let pagesIds = [];
            let deleteData = this.state.deleteData;
            deleteData.map((page) => pagesIds.push(page.id));
            this.props.control.remove({id: pagesIds})
            let newPages = pages.filter((page) => {
                return !pagesIds.includes(page.id);
            });

            await this.setAsyncState({ pages: newPages });
            this.closeDeleteModal();
        }
    };

    render() {
        const classes = this.props.classes;
        const currentList = this.state.pages.filter(el => el.isTemplate === this.state.isTemplate)
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
                        onClick: (event) => {
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
                    ...(this.state.isTemplate ? [] : [{
                        title: "Category",
                        field: "category",
                        },
                        {
                            title: "Publish",
                            headerStyle: {
                                width: "300px",
                            },
                            field: "publish",
                        },
                        {
                            title: "Default Page",
                            headerStyle: {
                                width: "300px",
                            },
                            field: "defaultPage",
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
                                columns={tableOptions.props.columns}
                                data={currentList} // if u use getData() it won't work
                                options={tableOptions.props.options}
                                actions={tableOptions.actions.customActions}
                            />
                        </MuiThemeProvider>
                    </div>
                </div>
                <Dialog
                    classes={{
                        root: classes.center,
                        paper: classes.modal,
                    }}
                    open={this.state.showDeleteModal}
                    TransitionComponent={this.transition}
                    keepMounted
                    onClose={() => this.closeDeleteModal()}
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
                        <div>Are you sure you want to delete the selected pages?</div>
                    </DialogContent>

                    <DialogActions className={classes.modalFooter}>
                        <Button
                            disabled={this.state.isBtnDisabled}
                            color="transparent"
                            simple
                            onClick={() => this.deleteCallback()}
                        >
                            <div>Delete</div>
                        </Button>
                        <Button
                            color="danger"
                            simple
                            onClick={() => {
                                this.closeDeleteModal();
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

export default withRouter(withStyles(styles)(Pages));
