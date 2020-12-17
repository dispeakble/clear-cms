import React, { Component } from "react";

// for the modal
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { withStyles, createMuiTheme } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/pagesAdd.js";

// for the material-table within the edit modal options modal
import MaterialTable from "material-table";
import {
  DeleteForever,
  AddCircle,
  Edit,
  ArtTrack,
  Check,
  Clear,
  Info,
} from "@material-ui/icons";

import Button from "components/CustomButtons/Button.js";

// for the dropdown
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomInput from "components/CustomInput/CustomInput.js";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";

import Icon from "@material-ui/core/Icon";

class TableModule extends Component {
  state = {
    tableRef: React.createRef(),
    previewTableRef: React.createRef(),
    showPreview: true,
    definedColumns: [],
    dataTypes: [
      { text: "string" },
      { text: "boolean" },
      { text: "numeric" },
      { text: "date" },
      { text: "datetime" },
      { text: "time" },
      { text: "currency" },
      { text: "image" },
      { text: "icon" },
      { text: "link" },
    ],
    search: false,
    editable: false,
    sortable: false,
    columnDrag: false,
    filter: false,
    pagination: false,
    export: false,
    fixedColumns: false,
    remoteData: false,
    rowsOnPage: 5,
    leftNumber: 0,
    rightNumber: 0,

    previewData: [],

    showMultipleDeleteModal: false,
    multipleDeleteData: "",
    table: "",
    data: [],
  };

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  handleEdit = async (id) => {
    await this.setAsyncState({
      itemModuleEditId: id,
      showModuleOptionsModal: true,
    });
    await this.setAsyncState({
      editGalleryType: this.state.editGalleryType,
    });
  };

  closeModuleOptionsModal() {
    this.setState({ showModuleOptionsModal: false });
  }

  showMultipleDeleteModal = (evt, data, table) => {
    this.setState({
      table,
      multipleDeleteData: data,
      showMultipleDeleteModal: true,
    });
  };

  closeMultipleDeleteModal = () => {
    this.setState({ showMultipleDeleteModal: false });
  };

  multipleDeleteCallback = async () => {
    console.log(this.state.table);
    switch (this.state.table) {
      case "main": {
        let definedColumns = [...this.state.definedColumns];
        let definedColumnsIds = [];
        let multipleDeleteData = this.state.multipleDeleteData;
        multipleDeleteData.map((column) =>
          definedColumnsIds.push(column.tableData.id)
        );
        definedColumns = definedColumns.filter((column) => {
          return !definedColumnsIds.includes(column.tableData.id);
        });
        console.log(definedColumns);
        await this.setAsyncState({ definedColumns });
        this.state.tableRef.current &&
          this.state.tableRef.current.onQueryChange();
      }
      case "preview": {
        let previewData = [...this.state.previewData];
        let previewDataIds = [];
        let multipleDeleteData = this.state.multipleDeleteData;
        multipleDeleteData.map((data) =>
          previewDataIds.push(data.tableData.id)
        );
        previewData = previewData.filter((data) => {
          return !previewDataIds.includes(data.tableData.id);
        });
        await this.setAsyncState({ previewData });
        // localStorage.setItem("categories", JSON.stringify(categories));
        this.state.previewTableRef.current &&
          this.state.previewTableRef.current.onQueryChange();
      }
    }

    this.closeMultipleDeleteModal();
  };

  handleInputChange = async (event) => {
    switch (event.target.id) {
      case "rowsOnPage":
        let rowsOnPage = this.state.rowsOnPage;
        rowsOnPage = event.target.value;
        await this.setAsyncState({ rowsOnPage });
        this.dataTableOptions.props.options.pageSize = this.state.rowsOnPage;
        this.tableOptions.actions.refreshPreview();
        break;
      case "dataUrl":
        let dataUrl = this.state.dataUrl;
        dataUrl = event.target.value;

        let data = new Promise((resolve, reject) => {
          let url = dataUrl;
          fetch(url)
            .then((response) => response.json())
            .then((result) => {
              resolve({
                data: result.data,
              });
              this.setAsyncState({ data: result.data });
            });
        });

        await this.setAsyncState({ dataUrl });
        this.tableOptions.actions.refreshPreview();

        break;
      case "leftNumber":
        let leftNumber = this.state.leftNumber;
        leftNumber = event.target.value;
        await this.setAsyncState({ leftNumber });
        this.dataTableOptions.props.options.fixedColumns = {
          left: this.state.leftNumber,
          right: this.state.rightNumber,
        };
        this.tableOptions.actions.refreshPreview();
        console.log(this.state.leftNumber);
        console.log(this.state.rightNumber);
        break;

      case "rightNumber":
        let rightNumber = this.state.rightNumber;
        rightNumber = event.target.value;
        await this.setAsyncState({ rightNumber });
        this.dataTableOptions.props.options.fixedColumns = {
          left: this.state.leftNumber,
          right: this.state.rightNumber,
        };
        this.tableOptions.actions.refreshPreview();
        console.log(this.state.leftNumber);
        console.log(this.state.rightNumber);
        break;
    }
  };

  dataTableOptions = {
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
                <a href={rowData[col.fieldName].href} target="_blank">
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
        });
        return tableCols;
      },
      getPreviewData: () => {
        console.log(this.state.previewData);
        console.log(this.state.data);
        return new Promise((resolve) => {
          //TODO ADD NEW STATE FOR TABLE DATA/VALUES
          setTimeout(() => {
            let payload = {
              totalCount: 100,
              page: 1,
              data: this.state.data ? this.state.data : this.state.previewData,
            };
            resolve(payload);
          }, 300);
        });
      },
      editable: this.state.editable
        ? {
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  delete newData.tableData;
                  let previewData = [...this.state.previewData];
                  newData.id = this.state.previewData.length + 1;
                  let newPreviewData = previewData.concat(newData);
                  await this.setAsyncState({ previewData: newPreviewData });
                  // localStorage.setItem(
                  //   "previewData",
                  //   JSON.stringify(newPreviewData)
                  // );
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
                  await this.setAsyncState({ previewData: dataUpdate });
                  resolve();
                }, 100);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...this.state.previewData];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  this.setState({ previewData: dataDelete });
                  // // localStorage.setItem(
                  // //   "previewData",
                  // //   JSON.stringify(dataDelete)
                  // // );
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
      getColumns: () => {
        let tableCols = [];
        this.state.definedColumns.map((col) => {
          tableCols.push({
            title: col.columnTitle,
            field: col.fieldName,
            type: col.dataType,
          });
        });
        return tableCols;
      },
      getData: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            let payload = {
              totalCount: 100,
              page: 1,
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
              await this.setAsyncState({ definedColumns: newDefinedColumns });
              //this.getAllDefinedColumns();
              // localStorage.setItem(
              //   "definedColumns",
              //   JSON.stringify(newDefinedColumns)
              // );
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
              await this.setAsyncState({ definedColumns: dataUpdate });
              //this.getAllDefinedColumns();
              resolve();
            }, 100);
          }),
        onRowDelete: (oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...this.state.definedColumns];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              this.setState({ definedColumns: dataDelete });
              // localStorage.setItem(
              //   "definedColumns",
              //   JSON.stringify(dataDelete)
              // );
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
            <IconButton color="error">
              <DeleteForever />{" "}
            </IconButton>
          ),
          onClick: async (evt, data) =>
            this.showMultipleDeleteModal(evt, data, "main"),
        },
      ],
    },
    props: {
      icons: {
        Add: () => <AddCircle className={this.props.classes.addIcon} />,
        Check: () => (
          <IconButton color="primary">
            <Check color="primary" />{" "}
          </IconButton>
        ),
        Clear: () => (
          <IconButton color="error">
            <Clear color="error" />{" "}
          </IconButton>
        ),
        Edit: () => (
          <IconButton color="primary">
            <Edit color="primary" />{" "}
          </IconButton>
        ),
        Delete: () => (
          <IconButton color="primary">
            <DeleteForever color="error" />{" "}
          </IconButton>
        ),
      },
      columns: [
        { title: "Column Title", field: "columnTitle" },
        { title: "Field Name", field: "fieldName" },
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
                  return this.tableOptions.actions.findDataType(columnData);
                })()}
                onChange={(ev, value) => {
                  if (value && value.text) {
                    columnData.onRowDataChange({
                      ...columnData.rowData,
                      dataType: value.text,
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
        <Tooltip title="Table Module">
          <IconButton
            onClick={() => this.handleEdit(this.props.boxId)}
            color="primary"
            size="medium"
          >
            <ArtTrack />
          </IconButton>
        </Tooltip>{" "}
        <Dialog
          fullWidth={true}
          style={{ margin: "0 auto" }}
          maxWidth={"md"}
          onBackdropClick={() => "false"}
          classes={{
            root: this.props.classes.center,
            paper: this.props.classes.modal,
          }}
          open={this.state.showModuleOptionsModal}
          TransitionComponent={this.transition}
          keepMounted
          onClose={() => this.closeModuleOptionsModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            style={{
              textAlign: "center",
            }}
            id="classic-modal-slide-title"
            disableTypography
            className={this.props.classes.modalHeader}
          >
            <h4 className={this.props.classes.modalTitle}>Edit Table Module</h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={this.props.classes.modalBody}
          >
            {" "}
            <div style={{ display: "flex" }}>
              <div style={{ width: "33%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Search Bar">
                    <Switch
                      checked={this.state.search}
                      onChange={async () => {
                        await this.setAsyncState({
                          search: !this.state.search,
                        });
                        this.dataTableOptions.props.options.search = this.state.search;
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Search
                </Typography>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Column Edit">
                    <Switch
                      checked={this.state.editable}
                      onChange={async () => {
                        await this.setAsyncState({
                          editable: !this.state.editable,
                        });
                        this.dataTableOptions.actions.editable = this.state
                          .editable
                          ? {
                              onRowAdd: (newData) =>
                                new Promise((resolve, reject) => {
                                  setTimeout(async () => {
                                    delete newData.tableData;
                                    let previewData = [
                                      ...this.state.previewData,
                                    ];
                                    newData.id =
                                      this.state.previewData.length + 1;
                                    let newPreviewData = previewData.concat(
                                      newData
                                    );
                                    await this.setAsyncState({
                                      previewData: newPreviewData,
                                    });
                                    // localStorage.setItem(
                                    //   "previewData",
                                    //   JSON.stringify(newPreviewData)
                                    // );
                                    resolve();
                                  }, 100);
                                }),
                              onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                  setTimeout(async () => {
                                    delete newData.tableData;
                                    const dataUpdate = [
                                      ...this.state.previewData,
                                    ];
                                    const index = oldData.tableData.id;
                                    dataUpdate[index] = newData;
                                    await this.setAsyncState({
                                      previewData: dataUpdate,
                                    });
                                    resolve();
                                  }, 100);
                                }),
                              onRowDelete: (oldData) =>
                                new Promise((resolve, reject) => {
                                  setTimeout(() => {
                                    const dataDelete = [
                                      ...this.state.previewData,
                                    ];
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    this.setState({ previewData: dataDelete });
                                    // // localStorage.setItem(
                                    // //   "previewData",
                                    // //   JSON.stringify(dataDelete)
                                    // // );
                                    resolve();
                                  }, 100);
                                }),
                            }
                          : {};
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Editable
                </Typography>

                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Pagination">
                    <Switch
                      checked={this.state.pagination}
                      onChange={async () => {
                        await this.setAsyncState({
                          pagination: !this.state.pagination,
                        });
                        this.dataTableOptions.props.options.paging = this.state.pagination;
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Pagination
                </Typography>

                {this.state.pagination ? (
                  <CustomInput
                    labelText="Rows On Page Multiple"
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
                          title="Define the number for page sizes"
                        >
                          <Info color="info" />
                        </Tooltip>
                      ),
                    }}
                  />
                ) : (
                  ""
                )}
              </div>

              <div style={{ width: "33%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Column Drag">
                    <Switch
                      checked={this.state.columnDrag}
                      onChange={async () => {
                        await this.setAsyncState({
                          columnDrag: !this.state.columnDrag,
                        });
                        this.dataTableOptions.props.options.draggable = this.state.columnDrag;
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Column Drag
                </Typography>

                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Filter">
                    <Switch
                      checked={this.state.filter}
                      onChange={async () => {
                        await this.setAsyncState({
                          filter: !this.state.filter,
                        });
                        this.dataTableOptions.props.options.filtering = this.state.filter;
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Filter
                </Typography>

                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Fixed Columns">
                    <Switch
                      checked={this.state.fixedColumns}
                      onChange={async () => {
                        await this.setAsyncState({
                          fixedColumns: !this.state.fixedColumns,
                        });
                      }}
                    />
                  </Tooltip>
                  Fixed Columns
                </Typography>

                {this.state.fixedColumns ? (
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "50%", padding: "0 3px" }}>
                      <CustomInput
                        labelText="Left Cols"
                        id="leftNumber"
                        required="required"
                        formControlProps={{
                          fullWidth: true,
                          onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                          endAdornment: (
                            <Tooltip
                              placement="top"
                              title="Define How many fixed columns on the left side"
                            >
                              <Info color="info" />
                            </Tooltip>
                          ),
                          value: this.state.leftNumber,
                          type: "number",
                        }}
                      />
                    </div>

                    <div style={{ width: "50%", padding: "0 3px" }}>
                      <CustomInput
                        labelText="Right Cols"
                        id="rightNumber"
                        required="required"
                        formControlProps={{
                          fullWidth: true,
                          onChange: (event) => this.handleInputChange(event),
                        }}
                        inputProps={{
                          endAdornment: (
                            <Tooltip
                              placement="top"
                              title="Define How many fixed columns on the right side"
                            >
                              <Info color="info" />
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

              <div style={{ width: "33%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Export">
                    <Switch
                      checked={this.state.export}
                      onChange={async () => {
                        await this.setAsyncState({
                          export: !this.state.export,
                        });
                        this.dataTableOptions.props.options.exportButton = this.state.export;
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Export
                </Typography>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Column Ordering">
                    <Switch
                      checked={this.state.sortable}
                      onChange={async () => {
                        await this.setAsyncState({
                          sortable: !this.state.sortable,
                        });
                        this.dataTableOptions.props.options.sorting = this.state.sortable;
                        this.tableOptions.actions.refreshPreview();
                      }}
                    />
                  </Tooltip>
                  Sortable
                </Typography>
                <Typography id="discrete-slider" gutterBottom>
                  <Tooltip title="Enable Remote Data">
                    <Switch
                      checked={this.state.remoteData}
                      onChange={async () => {
                        await this.setAsyncState({
                          remoteData: !this.state.remoteData,
                        });
                      }}
                    />
                  </Tooltip>
                  Remote Data
                </Typography>
                {this.state.remoteData ? (
                  <CustomInput
                    labelText="Data URL"
                    id="dataUrl"
                    required="required"
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
                          >
                            <Info color="info" />
                          </a>
                        </Tooltip>
                      ),
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <MaterialTable
              title="Defined Columns"
              tableRef={this.state.tableRef}
              columns={this.tableOptions.props.columns}
              data={() => this.tableOptions.actions.getData()}
              options={this.tableOptions.props.options}
              actions={this.tableOptions.actions.customActions}
              icons={this.tableOptions.props.icons}
              editable={this.tableOptions.actions.editable}
            />
            <Divider style={{ margin: "10px 0" }} />
            {this.state.showPreview && this.state.definedColumns.length ? (
              <MaterialTable
                title="Table data"
                tableRef={this.state.previewTableRef}
                columns={this.dataTableOptions.actions.getColumns()}
                data={() => this.dataTableOptions.actions.getPreviewData()}
                options={this.dataTableOptions.props.options}
                icons={this.tableOptions.props.icons}
                editable={this.dataTableOptions.actions.editable}
              />
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={this.state.isBtnDisabled}
              color="primary"
              onClick={() => {
                this.props.handleSave(this.state.itemModuleEditId, {
                  columns: this.state.definedColumns,
                  tableConfig: {
                    search: this.state.search,
                    editable: this.state.editable,
                    sortable: this.state.sortable,
                    columnDrag: this.state.columnDrag,
                    filter: this.state.filter,
                    pagination: this.state.pagination,
                    export: this.state.export,
                    fixedColumns: this.state.fixedColumns,
                    remoteData: this.state.remoteData,
                    rowsOnPage: this.state.rowsOnPage,
                    leftNumber: this.state.leftNumber,
                    rightNumber: this.state.rightNumber,
                  },
                });
                this.closeModuleOptionsModal();
              }}
            >
              <div>Save</div>
            </Button>
            <Button
              color="danger"
              onClick={() => {
                this.closeModuleOptionsModal();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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

export default withStyles(styles)(TableModule);
