import React, {Component} from "react";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

// for the material-table within the edit modal options modal
import MaterialTable from "material-table";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {
    DeleteForever,
    AddCircle,
    Edit,
    Check,
    Clear,
} from "@material-ui/icons";

import Button from "components/CustomButtons/Button.js";

import {Editor} from "@tinymce/tinymce-react";
import PropTypes from "prop-types";

class AccordionModule extends Component {
    state = {
        tableRef: React.createRef(),
        sections: [],
        sectionTitle: "",
        sectionContent: "",
        showEditModal: false,
        expanded: "",
    };

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {

        console.log(this.props.moduleOptions.sections);

        /*this.setState({
            sections: this.props.moduleOptions.sections
        })*/
    }

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
        switch (this.state.table) {
            case "main":
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
                this.state.tableRef.current &&
                this.state.tableRef.current.onQueryChange();
                break;
            default:
                break;
        }

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

    handleDelete(id) {
        let sections = [...this.state.sections];
        let newSections = sections.filter((section) => section.id !== id);
        this.setState({sections: newSections});
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
        })

        this.handleUpdate();

    }

    handleUpdate() {
        this.props.onUpdate({
            columns: this.state.sections
        })
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
                        this.handleUpdate();
                        resolve();
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(async (resolve) => {
                        delete newData.tableData;
                        const dataUpdate = [...this.state.sections];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        await this.setAsyncState({sections: dataUpdate});
                        resolve();
                    }),
                onRowDelete: (oldData) => {
                    return new Promise(async (resolve) => {
                        const dataDelete = [...this.state.sections];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        await this.setAsyncState({sections: dataDelete});
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
                    <IconButton color="primary">
                        <Check color="primary"/>{" "}
                    </IconButton>
                ),
                Clear: () => (
                    <IconButton color="error">
                        <Clear color="error"/>{" "}
                    </IconButton>
                ),
                Edit: () => (
                    <IconButton color="primary">
                        <Edit color="primary"/>{" "}
                    </IconButton>
                ),
                Delete: () => (
                    <IconButton color="primary">
                        <DeleteForever color="error"/>{" "}
                    </IconButton>
                ),
            },
            columns: [{title: "Section Title", field: "title"}],
            options: {
                selection: true,
                actionsColumnIndex: -1,
                actionsCellStyle: {
                    width: "auto",
                },
            },
        },
    };

    render() {
        const classes = this.props.classes;

        return (
            <React.Fragment>
                <MaterialTable
                    tableRef={this.state.tableRef}
                    title="Accordion Sections"
                    columns={this.tableOptions.props.columns}
                    data={() => this.tableOptions.actions.getData()}
                    options={this.tableOptions.props.options}
                    actions={this.tableOptions.actions.customActions}
                    icons={this.tableOptions.props.icons}
                    editable={this.tableOptions.actions.editable}
                />{" "}
                {this.state.sections.length ? (
                    <h4 style={{textAlign: "center", margin: "30px 0 20px 0"}}>
                        {" "}
                        Accordion Preview
                    </h4>
                ) : (
                    ""
                )}
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
                                style={{display: "initial"}}
                            >
                                <Typography
                                    title={section.title}
                                    className={classes.heading}
                                >
                                    {section.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {this.state.expanded === id && <Editor
                                    id="editor"
                                    initialValue={this.state.sectionContent}
                                    init={{
                                        height: 500,
                                        min_width: "100%",
                                        menubar: false,
                                        plugins: [
                                            "advlist autolink lists link image charmap print preview anchor",
                                            "searchreplace visualblocks code fullscreen",
                                            "insertdatetime media table paste code help wordcount",
                                        ],
                                        toolbar:
                                            "undo redo" +
                                            " | formatselect" +
                                            " | bold italic forecolor backcolor" +
                                            " | alignleft aligncenter alignright alignjustify" +
                                            " | bullist numlist outdent indent" +
                                            " | removeformat",
                                        init_instance_callback: function () {
                                            var annoyingMessage = document.querySelector(
                                                ".tox-notifications-container"
                                            );
                                            annoyingMessage.style.display = "none";
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

export default withStyles(styles)(AccordionModule);

AccordionModule.propTypes = {
    classes: PropTypes.object,
    onUpdate: PropTypes.func,
};