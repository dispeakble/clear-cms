import React, {Component} from "react";
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/bucket.js";
import {
    FileBrowser,
    FileContextMenu,
    FileList,
    FileNavbar,
    FileToolbar,
    defineFileAction
} from 'chonky';
import {Helmet} from "react-helmet";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "../../components/CustomButtons/Button";

class ViewBucket extends Component {
    state = {
        currentPath: '/',
        currentDir:{
            id: 'abc',
            name: '/'
        },
        createModal: false,
        deleteModal: false,
        renameModal: false,
        infoModal: {
            title:'',
            message:'',
            confirm:{},
            cancel:{},
            visible: false
        },
        uploadQue: [],
        uploadProgress: 0,
        uploadType: 'files',
        selectedFiles: []
    };

    uploadAction = defineFileAction(
        {
            id: 'upload',
            button: {
                name: 'Upload',
                toolbar: true,
                contextMenu: false,
                icon: 'upload'
            }
        },
        ({ reduxDispatch, getReduxState }) => {
            this.setState({ createModal: true })
            console.log('clicked upload')
        },
    )

    deleteAction = defineFileAction(
        {
            id: 'delete',
            button: {
                name: 'Delete',
                toolbar: true,
                contextMenu: true,
                icon: 'delete'
            },
            requiresSelection: true,

        },
        ({ reduxDispatch, getReduxState }) => {
            const reduxState = getReduxState();

            this.setState({ selectedFiles: reduxState.selectionMap, deleteModal: true })
        },
    )

    renameAction = defineFileAction(
        {
            id: 'rename',
            button: {
                name: 'Rename',
                toolbar: false,
                contextMenu: true,
                icon: 'rename'
            },
            requiresSelection: true
        },
        ({ reduxDispatch, getReduxState }) => {
            const reduxState = getReduxState();

            if(Object.keys(reduxState.selectionMap).length > 1){
                this.setState({
                    infoModal: {
                        visible: true,
                        title: 'Rename conflict',
                        message: 'Please select only one item for this action',
                        confirm: {
                            label: 'Ok',
                            callback: () => new Promise(resolve=>resolve())
                        },
                        cancel: {
                            label: 'Cancel',
                            callback: () => new Promise(resolve=>resolve())
                        }
                    }
                })
            } else {
                this.setState({ selectedFiles: reduxState.selectionMap, renameModal: true })
            }
        },
    )

    fileActions = [];

    constructor(props) {
        super(props);
        this.fileActions.push(this.uploadAction);
        this.fileActions.push(this.renameAction);
        this.fileActions.push(this.deleteAction);

    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        this.list();
    }

    getTheme() {
        return createMuiTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiFab: {
                    root: {
                        boxShadow: "",
                    },
                },
                MuiDialog: {
                    paper: {
                        width: "50%",
                    },
                    paperWidthSm: {
                        maxWidth: "100vw",
                        maxHeight: "60vh",
                    },
                },
                MuiDropzoneArea: {
                    root: {
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column"
                    },
                    text: {
                        fontSize: "1rem",
                    },
                },
            },
        });
    }

    onFileAction(ref){
        console.log(ref);
        return false;
    }

    list() {
        return new Promise(async resolve => {

            try {
                let folderChain = [{ id: this.state.currentDir.id, name: this.state.currentDir.name, isDir: true }];
                let objects = [];
                let response = await this.props.control.list({
                    path: this.state.currentPath
                });

                if(response && response.length){
                    response.forEach(obj => {
                        objects.push({
                            id: obj.name,
                            name: obj.name,
                            isDir: obj.dir
                        })
                    });
                }

                this.setState({
                    files: objects,
                    folderChain
                });
            } catch (err){

            }
        });
    }

    upload() {
        debugger;
    }

    download() {
        debugger;
    }

    openEditor(reset) {
        return (
            <Dialog
                style={{ width: "100%" }}
                classes={{
                    root: this.props.classes.center,
                    paper: this.props.classes.modal,
                }}
                open={true}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={this.props.classes.modalHeader}
                >
                    <h4 style={{ textAlign: "center" }}>Upload Files to "{this.state.currentPath}"</h4>
                </DialogTitle>
                <DialogContent
                    style={{ overflow: "auto" }}
                    id="classic-modal-slide-description"
                    className={this.props.classes.modalBody}
                >
                    <div style={{display: this.state.uploadType === 'files' ? 'block' : 'none'}}>
                        <input type="file" multiple onChange={this.handleUploadedFile.bind(this)}/>
                    </div>
                    <div style={{display: this.state.uploadType === 'directory' ? 'block' : 'none'}}>
                        <input type="file" multiple webkitdirectory="true" />
                    </div>
                    <div style={{marginTop: '1rem', height: '1rem', background:'darkgreen', width: `${this.state.uploadProgress}%`}}></div>
                </DialogContent>

                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.props.control.upload({
                                files: this.state.uploadQue,
                                path: this.state.currentPath,
                                progress: (evt) => {
                                    this.setState({
                                        uploadProgress: Math.floor(evt.loaded / evt.total * 100)
                                    });
                                }
                            }).then(() => {
                                this.setState({
                                    uploadProgress: 0,
                                    createModal: false,
                                });
                                this.list();
                            });

                        }}
                    >
                        Upload
                    </Button>
                    <Button
                        color="danger"
                        onClick={() => {
                            this.setState({
                                createModal: false,
                            });
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    openDeleteModal() {
        return (
            <Dialog
                style={{ width: "100%" }}
                classes={{
                    root: this.props.classes.center,
                    paper: this.props.classes.modal,
                }}
                open={true}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={this.props.classes.modalHeader}
                >
                    <h4 style={{ textAlign: "center" }}>Confirm delete</h4>
                </DialogTitle>
                <DialogContent
                    style={{ overflow: "auto" }}
                    id="classic-modal-slide-description"
                    className={this.props.classes.modalBody}
                >
                    Are you sure you want to delete the selected items?
                    <div>
                        {Object.keys(this.state.selectedFiles).map((fileSelected) => {
                            return (<div>{fileSelected}</div>);
                            })}
                    </div>
                </DialogContent>

                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <Button
                        color="danger"
                        onClick={() => {
                            this.props.control.delete({
                                path: this.state.currentPath,
                                selection: Object.keys(this.state.selectedFiles)
                            }).then(() => {
                                this.setState({
                                    deleteModal: false,
                                });
                                this.list();
                            });
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.setState({
                                deleteModal: false,
                            });
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    openRenameModal() {
        let newItemName = "";
        const onConfirm = () => {
            this.props.control.rename({
                path: this.state.currentPath,
                source: Object.keys(this.state.selectedFiles)[0],
                dest: newItemName
            }).then(() => {
                this.setState({
                    renameModal: false,
                });
                this.list();
            });
        };
        const onCancel = () => {
            this.setState({
                renameModal: false,
            });
        };
        const onFocusRenameInput = (evt) => {
            evt.target.value = Object.keys(this.state.selectedFiles)[0];
            evt.target.select();
            const filename = evt.target.value.split('.').slice(0, -1).join('.');
            evt.target.setSelectionRange(0, filename.length);
        }
        return (
            <Dialog
                style={{ width: "100%" }}
                classes={{
                    root: this.props.classes.center,
                    paper: this.props.classes.modal,
                }}
                open={true}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={this.props.classes.modalHeader}
                >
                    <h4 style={{ textAlign: "center" }}>Rename selected item</h4>
                </DialogTitle>
                <DialogContent
                    style={{ overflow: "auto" }}
                    id="classic-modal-slide-description"
                    className={this.props.classes.modalBody}
                >
                    <div>Rename {Object.keys(this.state.selectedFiles).map((fileSelected) => {
                            return (<span>{fileSelected}</span>);
                        })} to
                    </div>
                    <input className={this.props.classes.renameInput} type="text"
                           autoFocus={true}
                           onFocus={onFocusRenameInput}
                           onChange={(evt) => {
                        newItemName = evt.currentTarget.value
                    }}/>
                </DialogContent>

                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <Button color="primary" onClick={onConfirm}>Rename</Button>
                    <Button color="danger" onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

    openInfoModal() {
        return (
            <Dialog
                style={{ width: "100%" }}
                classes={{
                    root: this.props.classes.center,
                    paper: this.props.classes.modal,
                }}
                open={true}
                TransitionComponent={this.transition}
                keepMounted
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={this.props.classes.modalHeader}
                >
                    <h4 style={{ textAlign: "center" }}>{this.state.infoModal.title}</h4>
                </DialogTitle>
                <DialogContent
                    style={{ overflow: "auto" }}
                    id="classic-modal-slide-description"
                    className={this.props.classes.modalBody}
                >
                    {this.state.infoModal.message}
                </DialogContent>

                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <Button
                        color={this.state.infoModal.confirm.color || 'primary'}
                        onClick={() => {
                            this.state.infoModal.confirm.callback().then(() => {
                                this.setState({
                                    infoModal: {
                                        visible: false
                                    },
                                });
                            })
                        }}
                    >
                        {this.state.infoModal.confirm.label}
                    </Button>
                    <Button
                        color={this.state.infoModal.cancel.color || 'secondary'}
                        onClick={() => {
                            this.state.infoModal.cancel.callback().then(() => {
                                this.setState({
                                    infoModal: {
                                        visible: false
                                    }
                                });
                            })

                        }}
                    >
                        {this.state.infoModal.cancel.label}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    async handleUploadedFile(event) {
        if (event.target.files.length) {
            this.setState({
                uploadQue : event.target.files
            })
        }
    }

    render() {
        const classes = this.props.classes;
        return (
            <MuiThemeProvider theme={this.getTheme()}>
                <React.Fragment>
                    <Helmet>
                        <title>Bucket (file manager)</title>
                    </Helmet>
                    <div style={{ height: '100vh', paddingTop: '60px' }}>
                        <FileBrowser onFileAction={this.onFileAction} fileActions={this.fileActions} files={this.state.files} folderChain={this.state.folderChain}>
                            <FileToolbar classes={classes.FileToolbar} />
                            <FileNavbar classes={classes.FileNavbar}/>
                            <FileContextMenu />
                            <FileList />
                        </FileBrowser>
                    </div>
                </React.Fragment>
                <React.Fragment>
                    {this.state.createModal ? this.openEditor(true) : ""}
                    {this.state.deleteModal ? this.openDeleteModal() : ""}
                    {this.state.renameModal ? this.openRenameModal() : ""}
                    {this.state.infoModal.visible ? this.openInfoModal() : ""}
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(ViewBucket);

ViewBucket.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object
};