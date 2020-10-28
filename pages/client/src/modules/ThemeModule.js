// import React, { Component } from "react";
// import Button from "components/CustomButtons/Button.js";
// import { withRouter } from "react-router-dom";

// // for the modal
// import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogActions from "@material-ui/core/DialogActions";
// import IconButton from "@material-ui/core/IconButton";
// import Tooltip from "@material-ui/core/Tooltip";
// import Close from "@material-ui/icons/Close";
// import CustomInput from "components/CustomInput/CustomInput.js";
// import { ArtTrack } from "@material-ui/icons";

// import { withStyles, createMuiTheme } from "@material-ui/core/styles";
// import { MuiThemeProvider } from "@material-ui/core/styles";
// import styles from "assets/jss/clear-crm/views/pagesAdd.js";

// import Typography from "@material-ui/core/Typography";
// import Switch from "@material-ui/core/Switch";
// import { Editor } from "@tinymce/tinymce-react";

// // for the material-table within the edit modal options modal
// import MaterialTable from "material-table";
// import { DeleteForever, AddCircle, Edit } from "@material-ui/icons";

// // for the dropdown
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";

// class ThemeModule extends Component {
//   state = {
//     menuOptions: [],
//     itemModuleEditId: "",
//     showModuleOptionsModal: false,
//     modalTitle: "Menu Items",
//     richFormattedText: false,
//     itemModuleEditId: "",
//     showMultipleDeleteModal: false,
//     tableRef: React.createRef(),
//     isMenuVertical: false,
//   };

//   componentDidMount() {
//     if (this.props.moduleOptions.data) {
//       this.setState({ menuOptions: this.props.moduleOptions.data.links });
//     }
//     if (this.props.moduleOptions.isVertical) {
//       this.setState({
//         isMenuVertical: this.props.moduleOptions.data.isVertical,
//       });
//     }
//     console.log(this.props.moduleOptions);
//   }

//   getTheme = () => {
//     /*
//     error?: PaletteColorOptions;
//   warning?: PaletteColorOptions;
//   info?: PaletteColorOptions;
//   success?: PaletteColorOptions;
//     */
//     return createMuiTheme({
//       palette: {
//         primary: "008b8b",
//       },
//       overrides: {
//         MuiDialogTitle: {
//           root: {
//             padding: "16px 24px 0",
//           },
//         },
//         MuiDialog: {
//           paperWidthSm: {
//             maxWidth: "1000px",
//             backgroundColor: "#FFDF00",
//           },
//         },
//         MuiDialog: {
//           paper: {
//             width: "100%",
//             backgroundColor: "#FFDF00",
//           },
//         },
//       },
//     });
//   };

//   setAsyncState = (newState) =>
//     new Promise((resolve) => this.setState(newState, resolve));

//   showMultipleDeleteModal = (evt, data) => {
//     this.setState({ multipleDeleteData: data, showMultipleDeleteModal: true });
//   };

//   closeMultipleDeleteModal = () => {
//     this.setState({ showMultipleDeleteModal: false });
//   };

//   multipleDeleteCallback = async () => {
//     let menuOptions = [...this.state.menuOptions];
//     let menuIds = [];
//     let multipleDeleteData = this.state.multipleDeleteData;
//     multipleDeleteData.map((option) => menuIds.push(option.id));
//     menuOptions = menuOptions.filter((option) => {
//       return !menuIds.includes(option.id);
//     });
//     await this.setAsyncState({ menuOptions });
//     this.state.tableRef.current && this.state.tableRef.current.onQueryChange();

//     this.closeMultipleDeleteModal();
//   };

//   tableOptions = {
//     getTheme: () => {
//       /*
//         error?: PaletteColorOptions;
//       warning?: PaletteColorOptions;
//       info?: PaletteColorOptions;
//       success?: PaletteColorOptions;
//         */
//       return createMuiTheme({
//         palette: {
//           text: {
//             //primary: "#F00",
//             //secondary: "#0F0",
//             disabled: "#00F",
//             hint: "#333",
//           },
//           error: {
//             main: "#FF0000",
//           },
//           warning: {
//             main: "#FF0000",
//           },
//           info: {
//             main: "#FF0000",
//           },
//           success: {
//             main: "#FF0000",
//           },
//           primary: {
//             main: "#008B8B",
//           },
//           secondary: {
//             main: "#008B8B",
//           },
//         },
//         overrides: {
//           MuiTableCell: {
//             head: {
//               "&:last-child": {
//                 width: "1px !important",
//                 whiteSpace: "nowrap",
//               },
//             },
//           },
//           MuiTypography: {
//             h6: {
//               textTransform: "capitalize",
//             },
//           },
//           MuiIconButton: {
//             root: {
//               "&:hover": {
//                 backgroundColor: "transparent",
//               },
//             },
//           },
//           MuiIconButton: {
//             root: {
//               padding: "3px",
//               "&:hover": {
//                 backgroundColor: "transparent",
//               },
//             },
//           },
//         },
//       });
//     },
//     actions: {
//       getData: () => {
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             let payload = {
//               totalCount: 100,
//               page: 1,
//               data: this.state.menuOptions,
//             };
//             resolve(payload);
//           }, 300);
//         });
//       },
//       editable: {
//         onRowAdd: (newData) =>
//           new Promise((resolve, reject) => {
//             setTimeout(async () => {
//               let menuOptions = [...this.state.menuOptions];
//               newData.id = this.state.menuOptions.length + 1;
//               let newMenuOptions = menuOptions.concat(newData);

//               this.setState({ menuOptions: newMenuOptions });

//               resolve();
//               console.log(newMenuOptions);
//             }, 100);
//           }),
//         onRowUpdate: (newData, oldData) =>
//           new Promise((resolve, reject) => {
//             setTimeout(() => {
//               const dataUpdate = [...this.state.menuOptions];
//               const index = oldData.tableData.id;
//               dataUpdate[index] = newData;
//               this.setState({ menuOptions: dataUpdate });
//               resolve();
//             }, 100);
//           }),
//         onRowDelete: (oldData) =>
//           new Promise((resolve, reject) => {
//             setTimeout(() => {
//               const dataDelete = [...this.state.menuOptions];
//               const index = oldData.tableData.id;
//               dataDelete.splice(index, 1);
//               this.setState({ menuOptions: dataDelete });
//               resolve();
//             }, 100);
//           }),
//       },
//       customActions: [
//         {
//           tooltip: "Remove All Selected Menu Links",
//           icon: () => (
//             <IconButton color="primary">
//               <DeleteForever color="error" />{" "}
//             </IconButton>
//           ),
//           onClick: async (evt, data) => this.showMultipleDeleteModal(evt, data),
//         },
//       ],
//     },
//     props: {
//       icons: {
//         Add: () => <AddCircle className={this.props.classes.addIcon} />,
//         Edit: () => (
//           <IconButton color="primary">
//             <Edit color="primary" />{" "}
//           </IconButton>
//         ),
//         Delete: () => (
//           <IconButton color="primary">
//             <DeleteForever color="error" />{" "}
//           </IconButton>
//         ),
//       },
//       columns: [
//         {
//           title: "Title",
//           field: "title",
//         },
//         { title: "Text", field: "text" },
//         { title: "Parent Id", field: "parentId", type: "numeric" },
//       ],
//       parentChildData: (row, rows) => rows.find((a) => a.id === row.parentId),
//       options: {
//         selection: true,
//         selectionStyle: styles.selection,
//         actionsColumnIndex: -1,
//         actionsCellStyle: styles.tableActions,
//         cellStyle: styles.tableCells,
//         headerStyle: styles.tableHeader,
//       },
//     },
//   };

//   closeModuleOptionsModal() {
//     console.log("will close modal ");
//     this.setState({ showModuleOptionsModal: false });
//   }

//   handleEdit = async (id) => {
//     this.props.onStartEditingModule();
//     await this.setAsyncState({
//       itemModuleEditId: id,
//       showModuleOptionsModal: true,
//     });
//   };

//   render() {
//     const classes = this.props.classes;

//     return (
//       <div
//         style={{
//           textAlign: "center",
//         }}
//       >
//         <Tooltip title="Edit Theme Module">
//           <IconButton
//             onClick={() => this.handleEdit(this.props.boxId)}
//             color="primary"
//             size="medium"
//           >
//             <ArtTrack />
//           </IconButton>
//         </Tooltip>

//         <Dialog
//           onBackdropClick="false"
//           classes={{
//             root: classes.center,
//             paper: classes.modal,
//           }}
//           open={this.state.showModuleOptionsModal}
//           onBackdropClick="false"
//           TransitionComponent={this.transition}
//           keepMounted
//           aria-labelledby="classic-modal-slide-title"
//           aria-describedby="classic-modal-slide-description"
//         >
//           <DialogTitle
//             id="classic-modal-slide-title"
//             disableTypography
//             className={classes.modalHeader}
//           >
//             <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
//           </DialogTitle>
//           <DialogContent
//             id="classic-modal-slide-description"
//             className={classes.modalBody}
//           >
//             <Typography id="discrete-slider" gutterBottom>
//               <Tooltip title="Show the menu links in vertical order">
//                 <Switch
//                   checked={this.state.isMenuVertical}
//                   onChange={() => {
//                     this.setState({
//                       isMenuVertical: !this.state.isMenuVertical,
//                     });
//                   }}
//                   value={Number(this.state.isMenuVertical)}
//                 />
//               </Tooltip>
//               Vertical Menu
//             </Typography>
//             <MaterialTable
//               title="Themes"
//               tableRef={this.state.tableRef}
//               columns={this.tableOptions.props.columns}
//               parentChildData={this.tableOptions.props.parentChildData}
//               data={() => this.tableOptions.actions.getData()}
//               icons={this.tableOptions.props.icons}
//               options={this.tableOptions.props.options}
//               editable={this.tableOptions.actions.editable}
//               actions={this.tableOptions.actions.customActions}
//             />
//           </DialogContent>

//           <DialogActions className={classes.modalFooter}>
//             <Button
//               disabled={this.state.isBtnDisabled}
//               color="primary"
//               onClick={() => {
//                 this.props.onEndEditingModule();
//                 this.props.handleSave(this.state.itemModuleEditId, {
//                   links: this.state.menuOptions,
//                   isVertical: this.state.isMenuVertical,
//                 });
//                 this.closeModuleOptionsModal();
//               }}
//             >
//               <div>Save</div>
//             </Button>
//             <Button
//               color="danger"
//               onClick={() => {
//                 this.closeModuleOptionsModal();
//               }}
//             >
//               Cancel
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog
//           classes={{
//             root: classes.center,
//             paper: classes.modal,
//           }}
//           open={this.state.showMultipleDeleteModal}
//           TransitionComponent={this.transition}
//           keepMounted
//           onClose={() => this.closeMultipleDeleteModal()}
//           aria-labelledby="classic-modal-slide-title"
//           aria-describedby="classic-modal-slide-description"
//         >
//           <DialogTitle
//             id="classic-modal-slide-title"
//             disableTypography
//             className={classes.modalHeader}
//           >
//             <h4 className={classes.modalTitle}>{this.state.modalTitle}</h4>
//           </DialogTitle>
//           <DialogContent
//             id="classic-modal-slide-description"
//             className={classes.modalBody}
//           >
//             <div>Are you sure you want to proceed ?</div>
//           </DialogContent>

//           <DialogActions className={classes.modalFooter}>
//             <Button
//               disabled={this.state.isBtnDisabled}
//               color="transparent"
//               simple
//               onClick={() => this.multipleDeleteCallback()}
//             >
//               <div>Proceed</div>
//             </Button>
//             <Button
//               color="danger"
//               simple
//               onClick={() => {
//                 this.closeMultipleDeleteModal();
//               }}
//             >
//               Cancel
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     );
//   }
// }

// export default withRouter(withStyles(styles)(ThemeModule));
