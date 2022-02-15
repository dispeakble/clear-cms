import React, {Component} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

import Papa from 'papaparse';

import MaterialTable from "material-table";
import {
    DeleteForever,
    AddCircle,
    Edit,
    Check,
    Clear,
    Info,
    MenuOpen,
    CloudUpload,
    InfoSharp,
} from "@material-ui/icons";

import {Accordion, AccordionDetails, AccordionSummary, FormControlLabel, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import {Divider} from "@material-ui/core";

import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import Modal from "../../../../components/Modal/Modal";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Snackbar from "../../../../components/Snackbar/Snackbar";
import Button from "../../../../components/CustomButtons/Button";

class TableModule extends Component {
    state = {
        tableRef: React.createRef(),
        previewTableRef: React.createRef(),
        showPreview: true,
        definedColumns: [],
        dataTypes: [
            {text: "string"},
            {text: "boolean"},
            {text: "numeric"},
            {text: "date"},
            {text: "datetime"},
            {text: "time"},
            {text: "currency"},
            {text: "image"},
            {text: "icon"},
            {text: "link"},
        ],
        previewData: [],

        showMultipleDeleteModal: false,
        multipleDeleteData: "",
        table: "",
        showDataUrlMessage: false,


        search: false,
        editable: false,
        sortable: false,
        columnDrag: false,
        filter: false,
        pagination: false,
        export: false,
        fixedColumns: false,
        remoteData: false,
        staticData: false,
        dataUrl: "",
        rowsOnPage: 5,
        leftNumber: 0,
        rightNumber: 0,
    };

    uploader = null;

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        if (this.props.moduleOptions && "object" === typeof this.props.moduleOptions) {
            this.setState({
                previewData: this.props.moduleOptions?.previewData || [],
                definedColumns: this.props.moduleOptions.definedColumns || [],
                search: this.props.moduleOptions.search || false,
                editable: this.props.moduleOptions.editable || false,
                sortable: this.props.moduleOptions.sortable || false,
                columnDrag: this.props.moduleOptions.columnDrag || false,
                filter: this.props.moduleOptions.filter || false,
                pagination: this.props.moduleOptions.pagination || false,
                export: this.props.moduleOptions.export || false,
                fixedColumns: this.props.moduleOptions.fixedColumns || false,
                remoteData: this.props.moduleOptions.remoteData || false,
                dataUrl: this.props.moduleOptions.dataUrl || "",
                rowsOnPage: this.props.moduleOptions.rowsOnPage || 5,
                leftNumber: this.props.moduleOptions.leftNumber || 0,
                rightNumber: this.props.moduleOptions.rightNumber || 0,
            })
        }
        const definedColumns = this.props.moduleOptions?.columns;

        if (definedColumns && definedColumns.length) {
            this.setState({
                definedColumns
            })
        }

    }

    handleEdit = async (id) => {
        await this.setAsyncState({
            boxModuleEditId: id,
            showModuleOptionsModal: true,
        });
        await this.setAsyncState({
            editGalleryType: this.state.editGalleryType,
        });
    };

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

    showMultipleDeleteModal = (evt, data, table) => {
        this.setState({
            table,
            multipleDeleteData: data,
            showMultipleDeleteModal: true,
        });
    };

    closeMultipleDeleteModal = () => {
        this.setState({showMultipleDeleteModal: false});
    };

    multipleDeleteCallback = async () => {
        const definedColumnsIds = [];
        const previewDataIds = [];
        switch (this.state.table) {
            case "main":
                this.state.multipleDeleteData.map((column) => {
                    definedColumnsIds.push(column.tableData.id);
                    return column;
                });
                await this.setAsyncState({
                    definedColumns: [...this.state.definedColumns].filter((column) => {
                        return !definedColumnsIds.includes(column.tableData.id);
                    })
                });
                this.state.tableRef.current &&
                this.state.tableRef.current.onQueryChange();
                break;
            case "preview":
                this.state.multipleDeleteData.map((data) => {
                    previewDataIds.push(data.tableData.id)
                    return data;
                });
                await this.setAsyncState({
                    previewData: [...this.state.previewData].filter((data) => {
                        return !previewDataIds.includes(data.tableData.id);
                    })
                });
                this.state.previewTableRef.current &&
                this.state.previewTableRef.current.onQueryChange();
                break;
            default:
                break;
        }

        this.handleUpdate();

        this.closeMultipleDeleteModal();
    };

    deleteModalProps = {
        name: "deleteSections",
        title: "Delete selected entries",
        content: "Are you sure you want to delete these entries?",
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

    async refreshPreview() {
        await this.setAsyncState({
            showPreview: false,
        });
        await this.setAsyncState({
            showPreview: true,
        });
    }

    handleInputChange = (event) => {
        switch (event.target.id) {
            case "rowsOnPage":
                this.handleUpdate({rowsOnPage: Number(event.target.value)});
                this.refreshPreview();
                break;
            case "dataUrl":
                //TODO use this for dynamic tables
                const dataUrl = event.target.value + "";

                try {
                    setTimeout(async () => {
                        const dataBuf = await fetch(dataUrl);
                        const data = await dataBuf.json();
                        this.setState({data, dataUrl});
                    }, 0)
                    this.handleUpdate({dataUrl});
                    this.refreshPreview();
                } catch (err) {

                }


                break;
            case "leftNumber":
                this.handleUpdate({leftNumber: event.target.value});
                this.refreshPreview();
                break;

            case "rightNumber":
                this.handleUpdate({rightNumber: event.target.value});
                this.refreshPreview();
                break;
            default:
                break;
        }
    };

    async generateColumns() {
        if((this.state.remoteData && this.state.dataUrl.length) || this.state.staticData && this.state.previewData.length) {
            let data, sample;
            if(this.state.remoteData) {
                const dataBuf = await fetch(this.state.dataUrl);
                data = await dataBuf.json();
                sample = data.data[0];//very risky. this implies all API responses has data key in JSON response
            } else {
                sample = this.state.previewData[0];
            }

            const keys = Object.keys(sample);
            const result = [];

            keys.filter(key => key !== 'tableData').map((key, index) => {
                const ext = String(sample[key]).substring(sample[key].length - 3, sample[key].length).toLowerCase();
                const prefix = String(sample[key]).substring(0, 3).toLowerCase();
                const col = {
                    id: index + 1,
                    columnTitle: key,
                    fieldName: key,
                    dataType: "string"
                }
                switch(typeof sample[key]) {
                    case 'string':
                        if(['gif', 'png', 'jpg', 'jpeg', 'svg', 'webp'].indexOf(ext) > -1) {
                            col.dataType = this.state.dataTypes.find(type => type.text === 'image').text;
                        } else if(prefix === 'http') {
                            col.dataType = this.state.dataTypes.find(type => type.text === 'link').text;
                        }
                        break;
                    default:

                        break;
                }
                result.push(col);
                return key;
            });
            await this.setAsyncState({
                definedColumns: result
            });
            this.handleUpdate({
                definedColumns: result
            })
            this.refreshPreview();
        } else {
            this.setState({
                showDataUrlMessage: true
            });

            setTimeout(() => {
                this.setState({
                    showDataUrlMessage: false
                });
            }, 5000);
        }
    }

    handleUpload(event) {
        const newFiles = Array.from(event.target.files).map((file) => {
            var fileReader = new FileReader();
            fileReader.onload = async (fileLoadedEvent) => {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                const parsedData = Papa.parse(textFromFileLoaded, {
                    header: true,
                    worker: false
                });
                await this.setAsyncState({
                    previewData: parsedData.data
                });
                this.refreshPreview()
            };

            fileReader.readAsText(file, "UTF-8");
            return {
                file: file,
                name: '',
                sel: 'dataFile',
                title: file.name
            }
        });

        this.handleUpdate({
            files: newFiles
        });
    }

    openUploader() {
        this.uploader.click();
    }

    handleUpdate(params) {

        if (!params) {
            params = {};
        }

        const payload = Object.assign({}, {
            columns: this.state.definedColumns,
            previewData: this.state.previewData,
            search: this.state.search,
            editable: this.state.editable,
            sortable: this.state.sortable,
            columnDrag: this.state.columnDrag,
            filter: this.state.filter,
            pagination: this.state.pagination,
            export: this.state.export,
            fixedColumns: this.state.fixedColumns,
            remoteData: this.state.remoteData,
            dataUrl: this.state.dataUrl,
            rowsOnPage: this.state.rowsOnPage,
            leftNumber: this.state.leftNumber,
            rightNumber: this.state.rightNumber
        }, params);

        this.props.onUpdate(payload);

        this.setState(params);
    }

    render() {
        const classes = this.props.classes;

        const dataTableOptions = {
            actions: {
                getColumns: () => {
                    let tableCols = [];
                    this.state.definedColumns.map((col) => {
                        if (col.dataType === "image") {
                            tableCols.push({
                                title: col.columnTitle,
                                field: col.fieldName,
                                render: (rowData) => (
                                    <img
                                        alt={col.columnTitle}
                                        style={{
                                            maxHeight: "100%",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                        }}
                                        src={rowData[col.fieldName]}
                                    />
                                ),
                            });
                        } else if (col.dataType === "icon") {
                            tableCols.push({
                                title: col.columnTitle,
                                field: col.fieldName,
                                render: (rowData) => <Icon>{rowData[col.fieldName]}</Icon>,
                            });
                        } else if (col.dataType === "link") {
                            tableCols.push({
                                title: col.columnTitle,
                                field: col.fieldName,
                                render: (rowData) => (
                                    <a rel="noopener noreferrer" href={rowData[col.fieldName].href} target="_blank">
                                        {rowData[col.fieldName].name}
                                    </a>
                                ),
                            });
                        } else {
                            tableCols.push({
                                title: col.columnTitle,
                                field: col.fieldName,
                                type: col.dataType,
                            });
                        }
                        return col;
                    });
                    return tableCols;
                },
                getPreviewData: (query) => {
                    return new Promise(async (resolve) => {
                        if(this.state.remoteData) {
                            const urlQuery = new URLSearchParams({
                                page: query.page + 1,
                                per_page: query.pageSize,
                                "search": query.search
                            });
                            const dataBuf = await fetch(`${this.state.dataUrl}?${urlQuery.toString()}`);
                            const result = await dataBuf.json();
                            let payload = {
                                data: result.data,
                                page: query.page,
                                totalCount: result.total,
                            };
                            resolve(payload);
                        } else {
                            setTimeout(() => {
                                let payload = {
                                    totalCount: this.state.previewData.length,
                                    page: query.page,
                                    data: this.state.previewData
                                };
                                resolve(payload);
                            }, 0);
                        }
                    });
                },
                editable: this.state.editable
                    ? {
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
                                setTimeout(async () => {
                                    delete newData.tableData;
                                    let previewData = [...this.state.previewData];
                                    newData.id = this.state.previewData.length + 1;
                                    let newPreviewData = previewData.concat(newData);
                                    await this.setAsyncState({previewData: newPreviewData});
                                    this.handleUpdate({previewData: newPreviewData});
                                    resolve();
                                }, 100);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                setTimeout(async () => {
                                    delete newData.tableData;
                                    const dataUpdate = [...this.state.previewData];
                                    const index = oldData.tableData.id;
                                    dataUpdate[index] = newData;
                                    this.handleUpdate({previewData: dataUpdate});
                                    resolve();
                                }, 100);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise((resolve, reject) => {
                                setTimeout(async () => {
                                    const dataDelete = [...this.state.previewData];
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    this.handleUpdate({previewData: dataDelete});
                                    resolve();
                                }, 100);
                            }),
                    }
                    : {},
            },

            props: {
                options: {
                    search: this.state.search,
                    sorting: this.state.sortable,
                    draggable: this.state.columnDrag,
                    exportButton: this.state.export,
                    filtering: this.state.filter,
                    fixedColumns: {
                        left: this.state.leftNumber,
                        right: this.state.rightNumber,
                    },
                    pageSize: this.state.rowsOnPage,
                    paging: this.state.pagination,

                    selection: this.state.editable,
                    actionsColumnIndex: -1,
                    actionsCellStyle: {
                        width: "auto",
                    },
                },
            },
        };

        const tableOptions = {
            actions: {
                getColumns: () => {
                    let tableCols = [];
                    this.state.definedColumns.map((col) => {
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
                            console.log(this.state.definedColumns.length)
                            let payload = {
                                totalCount: this.state.definedColumns.length,
                                page: 0,
                                data: this.state.definedColumns,
                            };
                            resolve(payload);
                        }, 300);
                    });
                },
                editable: {
                    onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(async () => {
                                delete newData.tableData;
                                let definedColumns = [...this.state.definedColumns];
                                newData.id = this.state.definedColumns.length + 1;
                                let newDefinedColumns = definedColumns.concat(newData);
                                this.handleUpdate({definedColumns: newDefinedColumns});
                                resolve();
                            }, 100);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(async () => {
                                delete newData.tableData;
                                const dataUpdate = [...this.state.definedColumns];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                await this.setAsyncState({definedColumns: dataUpdate});
                                this.handleUpdate({definedColumns: dataUpdate});
                                resolve();
                            }, 100);
                        }),
                    onRowDelete: (oldData) => {
                        return new Promise((resolve, reject) => {
                            setTimeout(async () => {
                                const dataDelete = [...this.state.definedColumns];
                                const index = oldData.tableData.id;
                                dataDelete.splice(index, 1);
                                await this.setAsyncState({definedColumns: dataDelete});
                                this.handleUpdate({definedColumns: dataDelete});
                                resolve();
                            }, 100);
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
                            <DeleteForever/>
                        ),
                        onClick: async (evt, data) => {
                            this.showMultipleDeleteModal(evt, data, "main")
                        }
                    },
                    {
                        isFreeAction: true,
                        tooltip: "Generate all the columns from the provided data URL or the uploaded CSV file",
                        icon: () => (
                            <MenuOpen/>
                        ),
                        onClick: async () => {
                            this.generateColumns();
                        }
                    }
                ],
            },
            props: {
                icons: {
                    Add: () => <AddCircle/>,
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
                columns: [
                    {title: "Column Title", field: "columnTitle"},
                    {title: "Field Name", field: "fieldName"},
                    {
                        title: "Data Type",
                        field: "dataType",
                        initialEditValue: this.state.dataTypes[0].text,
                        editComponent: (columnData) => {
                            return (
                                <Autocomplete
                                    className={this.props.classes.option}
                                    options={this.state.dataTypes}
                                    autoHighlight
                                    getOptionLabel={(option) => option.text}
                                    disableClearable={true}
                                    value={(() => {
                                        return tableOptions.actions.findDataType(columnData);
                                    })()}
                                    onChange={(ev, value) => {
                                        if (value && value.text) {
                                            columnData.onRowDataChange({
                                                ...columnData.rowData,
                                                dataType: value.text
                                            });
                                        }
                                    }}
                                    renderOption={(option) => {
                                        return <React.Fragment>{option.text}</React.Fragment>;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            className={this.props.classes.textfield}
                                            {...params}
                                            label="Data Type"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            );
                        },
                    },
                ],
                options: {
                    selection: true,
                    pageSize: 10,
                    actionsColumnIndex: -1,
                    actionsCellStyle: {
                        width: "auto",
                    },
                },
            },
        };

        return (
            <React.Fragment>
                <div style={{marginBottom: '24px'}}>
                    <Accordion classes={{root: this.props.classes.accordion}}>
                        <AccordionSummary
                            classes={{
                                root: this.props.classes.accordionSummaryRoot,
                                expanded: this.props.classes.accordionSummaryExpanded,
                                content: this.props.classes.accordionSummaryContent,
                            }}
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1c-content"
                        >
                            <Typography className={this.props.classes.typography}>
                                Advanced settings
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{padding: '0 0 12px 0'}}>
                            <div style={{display: "flex", width: "100%"}}>
                                <div style={{flex: 1, paddingRight: 6}}>
                                    <div>
                                        <Typography variant={"caption"} gutterBottom>Create a dynamic table which allows editing for local export</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.editable}
                                                onChange={async () => {
                                                    this.handleUpdate({
                                                        editable: !this.state.editable,
                                                    });
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Column Edit"/>
                                    </Typography>
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Enable temporary column order using dragging</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.columnDrag}
                                                onChange={async () => {
                                                    dataTableOptions.props.options.draggable = this.state.columnDrag;
                                                    this.handleUpdate({
                                                        columnDrag: !this.state.columnDrag,
                                                    });
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Column Drag"/>
                                    </Typography>
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Allow the user to sort the data by clicking the columns</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.sortable}
                                                onChange={async () => {
                                                    dataTableOptions.props.options.sorting = this.state.sortable;
                                                    this.handleUpdate({
                                                        sortable: !this.state.sortable,
                                                    });
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Column Ordering"/>
                                    </Typography>
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Display the pagination on the bottom side of the table</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.pagination}
                                                onChange={async () => {
                                                    dataTableOptions.props.options.paging = this.state.pagination;
                                                    this.handleUpdate({
                                                        pagination: !this.state.pagination,
                                                    });
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Pagination"/>
                                    </Typography>

                                    {this.state.pagination ? (
                                        <>
                                            <div style={{marginTop: 24}}>
                                                <Typography variant={"caption"}>Adjust the number of rows to be displayed on a page</Typography>
                                            </div>
                                            <CustomInput
                                                style={{
                                                    width: '50%'
                                                }}
                                                id="rowsOnPage"
                                                required="required"
                                                formControlProps={{
                                                    fullWidth: true,
                                                    onChange: (event) => this.handleInputChange(event),
                                                }}
                                                inputProps={{
                                                    value: this.state.rowsOnPage,
                                                    type: "number",
                                                    endAdornment: (
                                                        <Tooltip
                                                            placement="top"
                                                            title="Define the total rows to be displayed on a single page"
                                                        >
                                                            <Info color="info"/>
                                                        </Tooltip>
                                                    ),
                                                }}
                                            />
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Columns will stay in view when scrolling horizontally</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.fixedColumns}
                                                onChange={async () => {
                                                    this.handleUpdate({
                                                        fixedColumns: !this.state.fixedColumns,
                                                    });
                                                }}
                                            />}
                                            label="Enable Fixed Columns"/>
                                    </Typography>

                                    {this.state.fixedColumns ? (
                                        <div style={{display: "flex"}}>
                                            <div style={{width: "50%", paddingRight: "6px"}}>
                                                <CustomInput
                                                    id="leftNumber"
                                                    required="required"
                                                    labelText="Left columns"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: (event) => this.handleInputChange(event),
                                                    }}
                                                    inputProps={{
                                                        endAdornment: (
                                                            <Tooltip
                                                                placement="top"
                                                                title="Fixed columns on the left side"
                                                            >
                                                                <Info color="info"/>
                                                            </Tooltip>
                                                        ),
                                                        value: this.state.leftNumber,
                                                        type: "number",
                                                    }}
                                                />
                                            </div>

                                            <div style={{width: "50%", paddingLeft: "6px"}}>
                                                <CustomInput
                                                    id="rightNumber"
                                                    required="required"
                                                    labelText="Right columns"
                                                    formControlProps={{
                                                        fullWidth: true,
                                                        onChange: (event) => this.handleInputChange(event),
                                                    }}
                                                    inputProps={{
                                                        endAdornment: (
                                                            <Tooltip
                                                                placement="top"
                                                                title="Fixed columns on the right side"
                                                            >
                                                                <Info color="info"/>
                                                            </Tooltip>
                                                        ),
                                                        value: this.state.rightNumber,
                                                        type: "number",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div style={{flex: 1, paddingLeft: 6}}>
                                    <div>
                                        <Typography variant={"caption"} gutterBottom>The table will have a search bar in the top-right corner</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.search}
                                                onChange={async () => {
                                                    dataTableOptions.props.options.search = this.state.search;
                                                    this.handleUpdate({
                                                        search: !this.state.search
                                                    });
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Search Bar"/>
                                    </Typography>
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Shows a filter input field for every column</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.filter}
                                                onChange={async () => {
                                                    this.handleUpdate({
                                                        filter: !this.state.filter,
                                                    });
                                                    await this.setAsyncState({
                                                        filter: !this.state.filter,
                                                    });
                                                    dataTableOptions.props.options.filtering = this.state.filter;
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Filter"/>
                                    </Typography>

                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Display a download button. A CSV file will be downloaded</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.export}
                                                onChange={async () => {
                                                    dataTableOptions.props.options.exportButton = this.state.export;
                                                    this.handleUpdate({
                                                        export: !this.state.export,
                                                    });
                                                    this.refreshPreview();
                                                }}
                                            />}
                                            label="Enable Export"/>
                                    </Typography>
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Add remote data using an URL</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.remoteData}
                                                onChange={async () => {
                                                    this.handleUpdate({
                                                        staticData: false,
                                                        remoteData: !this.state.remoteData,
                                                    });
                                                    setTimeout(() => {
                                                        this.refreshPreview();
                                                    }, 300);
                                                }}
                                            />}
                                            label="Enable Remote Data"/>
                                    </Typography>
                                    {this.state.remoteData ? (
                                        <>
                                            <CustomInput
                                                id="dataUrl"
                                                required="required"
                                                labelText="Remote data URL"
                                                formControlProps={{
                                                    fullWidth: true,
                                                    onChange: (event) => this.handleInputChange(event),
                                                }}
                                                inputProps={{
                                                    value: this.state.dataUrl,
                                                    type: "text",
                                                    endAdornment: (
                                                        <Tooltip placement="top" title="Click here for example">
                                                            <a
                                                                href="https://reqres.in/api/users?per_page=5&page=1"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Info color="primary"/>
                                                            </a>
                                                        </Tooltip>
                                                    ),
                                                }}
                                            />
                                        </>
                                    ) : (
                                        ""
                                    )}
                                    <div style={{marginTop: 24}}>
                                        <Typography variant={"caption"} gutterBottom>Upload a CSV file for the table data</Typography>
                                    </div>
                                    <Typography gutterBottom>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.staticData}
                                                onChange={async () => {
                                                    this.handleUpdate({
                                                        remoteData: false,
                                                        staticData: !this.state.staticData,
                                                    });
                                                    setTimeout(() => {
                                                        this.refreshPreview();
                                                    }, 300);
                                                }}
                                            />}
                                            label="Enable Static Data"/>
                                    </Typography>
                                    {this.state.staticData ? (
                                        <>
                                            <Button color={"primary"} onClick={this.openUploader.bind(this)}><CloudUpload/> <span>
                                                Upload CSV File
                                            </span></Button>
                                            <input id="uploader"
                                                   type="file"
                                                   ref={(ref) => this.uploader = ref}
                                                   style={{display: 'none'}}
                                                   onChange={this.handleUpload.bind(this)}
                                            />
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                {this.state.showPreview && <MaterialTable
                    title="Defined Columns"
                    tableRef={this.state.tableRef}
                    columns={tableOptions.props.columns}
                    data={() => tableOptions.actions.getData()}
                    options={tableOptions.props.options}
                    actions={tableOptions.actions.customActions}
                    icons={tableOptions.props.icons}
                    editable={tableOptions.actions.editable}
                /> }
                <Divider style={{margin: "10px 0"}}/>
                {this.state.showPreview && this.state.definedColumns.length ? (
                    <MaterialTable
                        title="Table data"
                        tableRef={this.state.previewTableRef}
                        columns={dataTableOptions.actions.getColumns()}
                        data={dataTableOptions.actions.getPreviewData.bind(this)}
                        options={dataTableOptions.props.options}
                        icons={tableOptions.props.icons}
                        editable={dataTableOptions.actions.editable}
                    />
                ) : (
                    ""
                )}
                <Modal
                    modalSize="small"
                    showModal={this.state.showMultipleDeleteModal}
                    {...this.deleteModalProps}
                />
                <Snackbar
                    open={this.state.showDataUrlMessage}
                    place="tc"
                    color="warning"
                    icon={InfoSharp}
                    message="Please select 'Enable Remote Data' and type in a URL for the data"
                />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(TableModule);

TableModule.propTypes = {
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    box: PropTypes.object,
    boxId: PropTypes.number,
    pageId: PropTypes.number,
    layoutBoxSpacing: PropTypes.number,
    onUpdate: PropTypes.func
};
