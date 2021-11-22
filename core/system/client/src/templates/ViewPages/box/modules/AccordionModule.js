import React, {Component} from "react";

import IconButton from "@material-ui/core/IconButton";

import {createTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import MaterialTable from "material-table";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {
    DeleteForever,
    AddCircle,
    Edit,
    Check,
    Clear,
} from "@material-ui/icons";

import {Editor} from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import Modal from "components/Modal/Modal";

class AccordionModule extends Component {
    state = {
        tableRef: React.createRef(),
        sections: [],
        sectionContent: "",
        showMultipleDeleteModal: false,
        expanded: "",
    };

    muiTheme = {};

    deleteModalProps = {
        name: "deleteSections",
        title: "Delete selected sections",
        content: "Are you sure you want to delete these sections?",
        closeButton: {
            callback: () => {
                this.closeMultipleDeleteModal()
            },
            label: "Cancel",
        },
        confirmButton: {
            show: true,
            callback: () => {
                this.multipleDeleteCallback()
            },
            label: "Delete",
        },
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        if (this.props.moduleOptions.sections && this.props.moduleOptions.sections.length) {
            this.setState({
                sections: this.props.moduleOptions.sections
            })
        }
        this.muiTheme = this.createDefaultTheme();
    }

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiAccordionDetails:{
                    root: {
                        display: "block"
                    },
                },
                MuiAccordionSummary: {
                    root: {
                        padding: "0 16px",
                        minHeight: "0 !important"
                    },
                },
            },
        });
    };

    showMultipleDeleteModal(evt, data, table) {
        this.setState({
            table,
            multipleDeleteData: data,
            showMultipleDeleteModal: true,
        });
    }

    closeMultipleDeleteModal() {
        this.setState({showMultipleDeleteModal: false});
    }

    async multipleDeleteCallback() {
        let sections = [...this.state.sections];
        let sectionsIds = [];
        let multipleDeleteData = this.state.multipleDeleteData;
        multipleDeleteData.map((column) =>
            sectionsIds.push(column.tableData.id)
        );
        sections = sections.filter((column) => {
            return !sectionsIds.includes(column.tableData.id);
        });
        await this.setAsyncState({sections});
        this.props.onUpdate({sections: this.state.sections});
        this.state.tableRef.current &&
        this.state.tableRef.current.onQueryChange();

        this.closeMultipleDeleteModal();
    }

    async handleContentEdit(sectionId, id) {
        let sections = [...this.state.sections];
        let section = sections.find((section) => section.id === sectionId);

        this.setState({
            sectionContent: section.content,
            expanded: id,
        });
    }

    async handleDelete(id) {
        let sections = [...this.state.sections];
        let newSections = sections.filter((section) => section.id !== id);
        await this.setAsyncState({sections: newSections});

        this.props.onUpdate({sections: this.state.sections});

        this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
    }

    async handleInputChange(event, id) {
        let sections = [...this.state.sections];
        let section = sections.find((section) => section.id === id);

        section.content = event;

        let sectionIndex = sections.findIndex((section) => section.id === id);

        sections[sectionIndex] = section;

        await this.setAsyncState({
            sections
        });

        this.props.onUpdate({sections: this.state.sections});

    }

    tableOptions = {
        actions: {
            getColumns: () => {
                let tableCols = [];
                this.state.sections.map((col) => {
                    tableCols.push({
                        title: col.columnTitle,
                        field: col.fieldName,
                        type: col.dataType,
                        validate: rowData => {
                            return rowData.title === '' ? 'Name cannot be empty' : ''
                        }
                    });
                    return col;
                });
                return tableCols;
            },
            getData: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        let payload = {
                            totalCount: 100,
                            page: 1,
                            data: this.state.sections,
                        };
                        resolve(payload);
                    }, 300);
                });
            },
            editable: {
                onRowAdd: (newData) =>
                    new Promise(async (resolve) => {
                        delete newData.tableData;
                        let sections = [...this.state.sections];
                        newData.id = this.state.sections.length + 1;
                        let newSections = sections.concat(newData);
                        await this.setAsyncState({sections: newSections});
                        this.props.onUpdate({sections: this.state.sections});
                        resolve();
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(async (resolve) => {
                        delete newData.tableData;
                        const dataUpdate = [...this.state.sections];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        await this.setAsyncState({sections: dataUpdate});
                        this.props.onUpdate({sections: this.state.sections});
                        resolve();
                    }),
                onRowDelete: (oldData) => {
                    return new Promise(async (resolve) => {
                        const dataDelete = [...this.state.sections];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        await this.setAsyncState({sections: dataDelete});
                        this.props.onUpdate({sections: this.state.sections});
                        resolve();
                    });
                },
            },
            findDataType: (columnData) => {
                return (
                    this.state.dataTypes.find(
                        (dataType) => dataType.text === columnData.rowData.dataType
                    ) || this.state.dataTypes[0]
                );
            },
            refreshPreview: async () => {
                await this.setAsyncState({
                    showPreview: false,
                });
                await this.setAsyncState({
                    showPreview: true,
                });
            },
            customActions: [
                {
                    tooltip: "Remove All Selected Defined Columns",
                    icon: () => (
                        <IconButton color="error">
                            <DeleteForever/>{" "}
                        </IconButton>
                    ),
                    onClick: async (evt, data) =>
                        this.showMultipleDeleteModal(evt, data, "main"),
                },
            ],
        },
        props: {
            icons: {
                Add: () => <AddCircle className={this.props.classes.addIcon}/>,
                Check: () => (
                    <Check color="primary"/>
                ),
                Clear: () => (
                    <Clear color="error"/>
                ),
                Edit: () => (
                    <Edit color="primary"/>
                ),
                Delete: () => (
                    <DeleteForever color="error"/>
                ),
            },
            columns: [{
                title: "Section Title", field: "title"
            }],
            options: {
                search: false,
                selection: true,
                actionsColumnIndex: -1,
                actionsCellStyle: {
                    width: "auto",
                },
            },
        },
    };

    render() {
        return (
            <MuiThemeProvider theme={this.muiTheme}>
                <div style={{
                    display: "flex"
                }}>
                    <div style={{
                        flex: 1,
                        marginRight: "10px"
                    }}>
                        <MaterialTable
                            tableRef={this.state.tableRef}
                            title="Accordion Sections"
                            columns={this.tableOptions.props.columns}
                            data={() => this.tableOptions.actions.getData()}
                            options={this.tableOptions.props.options}
                            actions={this.tableOptions.actions.customActions}
                            icons={this.tableOptions.props.icons}
                            editable={this.tableOptions.actions.editable}
                        />
                    </div>
                    <div style={{
                        flex: 1,
                        marginLeft: "10px"
                    }}>
                        {this.state.sections.map((section, idx) => {
                            const id = `panel${idx}a-content`;
                            return (
                                <Accordion
                                    key={id}
                                    expanded={this.state.expanded === id}
                                    onChange={() => this.handleContentEdit(section.id, id)}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                    >{section.title}</AccordionSummary>
                                    <AccordionDetails style={{
                                        padding: 0
                                    }}>
                                        {this.state.expanded === id && <Editor
                                            id="editor"
                                            initialValue={this.state.sectionContent}
                                            init={{
                                                height: 500,
                                                min_width: "100%",
                                                plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                                                menubar: 'file edit view insert format tools table tc help',
                                                toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                                                init_instance_callback: function () {
                                                    var annoyingMessage = document.querySelector(
                                                        ".tox-notifications-container"
                                                    );
                                                    if (annoyingMessage && annoyingMessage.style) {
                                                        annoyingMessage.style.display = "none";
                                                    }
                                                },
                                            }}
                                            onEditorChange={(event) =>
                                                this.handleInputChange(event, section.id)
                                            }
                                        />}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </div>
                </div>
                <Modal
                    modalSize="small"
                    showModal={this.state.showMultipleDeleteModal}
                    {...this.deleteModalProps}
                />
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(AccordionModule);

AccordionModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    defaultTheme: PropTypes.object,
    onUpdate: PropTypes.func,
};