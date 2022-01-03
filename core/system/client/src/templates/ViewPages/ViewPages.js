import React, { Component } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pages.js";

import { Helmet } from "react-helmet";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from "@material-ui/core/Tooltip";

import { withRouter } from "react-router-dom";


import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

// for the modal
import Modalpage from "../../components/Modal/Modal";


import {Edit, DeleteForever, Visibility, FileCopy} from "@material-ui/icons";
import Checkbox from "@material-ui/core/Checkbox";

import MaterialTable from "material-table";
import PropTypes from "prop-types";
import _ from "lodash";
import CustomInput from "../../components/CustomInput/CustomInput";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

class Pages extends Component {
    state = {
        showModal: false,
        cat_list: [],
        pages: [],
        templates: [],
        currentPage: 1,
        showDeleteModal: false,
        showCopyModal: false,
        pageToDeleteId: "",
        deleteQty: 0,
        isTemplate: false,
        pagedata:[],
        newpagetitle:'',
        newpublish:false,
        newdefault:false,
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
        },
        copyModalProps: {
            name: "Duplicate ",
            title: "Duplicate This  page",
            content: "Are you sure you want to Duplicate these page?",
            sction:{
                callback: ()=>{
                    this.sectionn()
                }

            },
            closeButton: {
                callback: () => {
                    this.closeCopyModal()
                },
                label: "Cancel",
            },
            confirmButton: {
                show: true,
                callback: () => {
                    this.handleDuplicate()
                },
                label: "Duplicate",
            },
        },



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

    showCopyModal = () => {
        this.setState({
            showCopyModal: true,
        });
    };

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false, deleteQty: 0 });
    };
    closeCopyModal = () => {
        this.setState({ showCopyModal: false});
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


    handleDuplicate = async ()=>{
        let data = this.state.pagedata;

        const page = await  this.props.control.get({id: String(data.id)});
        let newpageconfig=page.pageConfig;
        newpageconfig.pageTitle=this.state.newpagetitle;
        newpageconfig.publish=this.state.newpublish;
        newpageconfig.defaultPage=this.state.newdefault;

        let newPage = {
            id:0,
            pageConfig: newpageconfig,
            items: page.items,
        };
        const pageData = this.props.control.duplicate(newPage)
        console.log(pageData)
        if(data.isTemplate){
            if(pageData?.items?.length==0){
                await this.props.history.push(`/pages/template/${pageData.pageId}`);
            }else{
                await this.props.history.push(`/pages/template/${pageData.pageId}`);
            }
        }else{
            if(pageData?.items?.length==0){
                await this.props.history.push(`/pages/${pageData.pageId}`);
            }else{
                await this.props.history.push(`/pages/${pageData.pageId}`);
            } }
    }



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
                            const page = await  this.props.control.get({id: String(rowData.id)});
                            let config=page.pageConfig;
                            console.log(this.props)
                            if(config.defaultPage){
                                this.setState({
                                    pagedata:rowData,
                                    newpagetitle:config.pageTitle,
                                    newpublish:config.publish,
                                    newdefault:false
                                })
                            }else{
                                this.setState({
                                    pagedata:rowData,
                                    newpagetitle:config.pageTitle,
                                    newpublish:config.publish,
                                    newdefault:config.defaultPage
                                })
                            }

                            this.showCopyModal()
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
                <Modalpage
                    modalSize="small"
                    showModal={this.state.showDeleteModal}
                    {...this.state.deleteModalProps}
                />
                {/*<Modalpage*/}
                {/*    modalSize="small"*/}
                {/*    showModal={this.state.showCopyModal}*/}
                {/*    {...this.state.copyModalProps}*/}
                {/*/>*/}

                <Modal open={this.state.showCopyModal} onClose={()=>{this.closeCopyModal()}} center>
                    <div style={{
                        width: '500px',
                        height:'200px'
                    }}>
                        <h5> Publish Page </h5>
                        <hr/>
                        <div style={{paddingRight: "5px", flex: 1}}>

                            <CustomInput
                                labelText={this.state?.pagedata?.isTemplate ? "Template Title" : "Page Title"}
                                id="pageTitle"
                                value={this.state.newpagetitle}

                                formControlProps={{
                                    fullWidth: true,
                                    onChange: (e) => {
                                        this.setState({
                                            dialogTitleError: false,
                                            newpagetitle:e.target.value
                                        })


                                    }
                                }}
                                inputProps={{
                                    autoFocus: true,
                                    inputProps: {
                                        minLength: "1",
                                    },
                                    value: this.state.newpagetitle,
                                    type: "text",
                                }}
                                style={{marginRight: "5px"}}
                            />
                            <div>
                                <Typography>Publish</Typography>
                                <Tooltip title="Publish">

                                    <Switch

                                        value={this.state.newpublish}
                                        checked={this.state.newpublish}
                                        onChange={() => {
                                            this.setState({
                                                newpublish: !this.state.newpublish
                                            })

                                        }}
                                    />
                                </Tooltip>


                            </div>


                            <button onClick={()=>{
                                this.handleDuplicate()

                            }}
                                    style={{
                                        float:'right'
                                    }}
                            > Publish </button>
                        </div>

                    </div>
                </Modal>


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
    defaultTheme: PropTypes.object,
    onUpdate: PropTypes.func,
    moduleOptions: PropTypes.object,
    handleInputChange: PropTypes.func,
};