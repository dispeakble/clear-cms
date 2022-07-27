import React, { Component } from "react";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/clients.js";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import {
  DeleteForever,
  AddCircle,
  Edit,
  Check,
  Clear
} from "@material-ui/icons";

import MaterialTable from "material-table";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "../../components/Modal/Modal";
import moment from "moment";

class Clients extends Component {
  state = {
    tableRef: React.createRef(),
    showModal: false,
    clients: [],
    showMultipleDeleteModal: false,
    deleteModal: {
      name: "deleteModal",
      title: "Delete Selected Users",
      content: <div>Are you sure you want to remove the selected clients ?</div>,
      modalSize: "small",
      resize: false,
      saveDimensions: false,
      closeButton: {
        callback: () => {
          this.setState({ showMultipleDeleteModal: false });
        },
        label: "Cancel"
      },
      confirmButton: {
        callback: async () => {
          await this.multipleDeleteCallback();
        },
        label: "Proceed"
      }
    },
    defaultTheme: "",
    showErrorModal: false,
    errorModal: {
      name: "error",
      title: "Error",
      content: "",
      closeButton: {
        callback: () => {
          this.setState({ showErrorModal: false });
        },
        label: "Close"
      }
    }
  };

  async componentDidMount() {

  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  refresh = async () => {
    this.state.tableRef.current && this.state.tableRef.current.onQueryChange();
  };

  openErrorModal = (message) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        errorModal: {
          ...prevState.errorModal,
          content: message
        },
        showErrorModal: true
      };
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
                whiteSpace: "nowrap"
              }
            }
          },
          MuiTypography: {},
          MuiIcon: {
            root: {
              padding: "3px",
              "&:hover": {
                backgroundColor: "transparent"
              }
            }
          }
        }
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

            if (query.orderBy) {
              const orderBy = [query.orderBy.field, query.orderDirection];

              payload.order = [orderBy];
            }

            const result = await this.props.control.list(payload);

            if (result && result.rows) {
              console.log(result.rows)
              resolve({
                data: result.rows,
                page: query.page,
                totalCount: result.count
              });
            }
          })();


        });
      },
      editable: {
        onRowAdd: (newData) =>
          new Promise(async (resolve, reject) => {
            if (!newData.password || newData.password.trim() === "") {
              this.openErrorModal("Password is Invalid or Empty!");
              reject();
            }
            await this.props.control.add({
              firstName: newData.firstName,
              lastName: newData.lastName,
              email: newData.email,
              password: newData.password,
              active: newData.active
            });
            this.refresh();
            resolve();
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
              (async () => {
                  const payload = {
                      data: {
                          firstName: newData.firstName,
                          lastName: newData.lastName,
                          email: newData.email,
                          active: newData.active
                      }, where: {
                          id: oldData.id
                      }
                  };

                  if (newData.password && newData.password.length) {
                      payload.data.password = newData.password;
                  }

                  await this.props.control.set(newData);
                  resolve();
                  await this.refresh();
              })()
          }),
        onRowDelete: (oldData) =>
          new Promise(async (resolve) => {
            await this.props.control.rem({
              id: [oldData.id]
            });
            this.refresh();
            resolve();
          })
      },
      customActions: [
        {
          tooltip: "Remove All Selected Users",
          icon: () => (
            <DeleteForever />
          ),
          onClick: async (evt, data) => this.showMultipleDeleteModal(evt, data)
        }
      ]
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
        )
      },
      columns: [
        {
          type: "string",
          field: "firstName",
          title: "First Name",
          validate: rowData => rowData.firstName !== "",
          defaultSort: "asc"
        },
        {
          type: "string",
          field: "lastName",
          title: "Last Name",
          validate: rowData => rowData.lastName !== ""
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
          sorting: false
        },
        {
          type: "date",
          field: "createdAt",
          title: "Signed up",
          editable: "never",
          render: rowData => {
            return moment(rowData.createdAt).format("DD/MMM/YYYY");
          }
        },
        {
          type: "date",
          field: "updatedAt",
          title: "Last updated",
          editable: "never",
          render: rowData => {
            return moment(rowData.updatedAt).format("DD/MMM/YYYY");
          }
        },
        {
          type: "date",
          field: "accessedAt",
          title: "Last accessed",
          editable: "never",
          render: rowData => {
            return !rowData.accessedAt ? "-" : moment(rowData.accessedAt).format("DD/MMM/YYYY");
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
                  active: checked ? 1 : 0
                });
              }
              } />
            );
          }
        }
      ],
      localization: {
        body: {
          editRow: {
            deleteText: "Are you sure you want to delete this client?"
          }
        }
      },
      options: {
        selection: true,
        selectionStyle: styles.selection,
        actionsColumnIndex: -1,
        actionsCellStyle: styles.tableActions,
        cellStyle: styles.tableCells,
        headerStyle: styles.tableHeader
      }
    }
  };

  showMultipleDeleteModal = (evt, data) => {
    this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
  };

  closeMultipleDeleteModal = () => {
    this.setState({ showMultipleDeleteModal: false });
  };

  multipleDeleteCallback = async () => {
    let ids = [];
    this.state.multipleDeleteData.map((client) => ids.push(client.id));
    await this.props.control.rem({
      id: {
        "or": ids
      }
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
          <title>Users</title>
        </Helmet>
        <div className={classes.panel}>
          <div className={classes.wrapper}>
            <MuiThemeProvider theme={this.tableOptions.getTheme()}>
              <MaterialTable
                title="Users"
                tableRef={this.state.tableRef}
                columns={this.tableOptions.props.columns}
                data={this.tableOptions.actions.getData.bind(this)}
                icons={this.tableOptions.props.icons}
                options={this.tableOptions.props.options}
                editable={this.tableOptions.actions.editable}
                actions={this.tableOptions.actions.customActions}
                localization={this.tableOptions.props.localization}
              />
            </MuiThemeProvider>
          </div>
        </div>

        <Modal
          showModal={this.state.showMultipleDeleteModal}
          {...this.state.deleteModal}
        />
        <Modal
          showModal={this.state.showErrorModal}
          {...this.state.errorModal}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Clients);

Clients.propTypes = {
  control: PropTypes.object,
  defaultTheme: PropTypes.object,
  classes: PropTypes.object
};