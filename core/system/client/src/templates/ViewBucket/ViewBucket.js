import React, {Component} from "react";
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import { ThemeProvider } from 'react-jss'
import { withRouter } from "react-router-dom";
import styles from "assets/jss/clear-crm/views/bucket.js";
import 'assets/scss/bucket-theme.scss'
import {
    FileBrowser,
    FileContextMenu,
    FileList,
    FileNavbar,
    FileToolbar,
    defineFileAction,
    FileHelper
} from 'chonky';
import {Helmet} from "react-helmet";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "../../components/CustomButtons/Button";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import path from "path";

class ViewBucket extends Component {
    state = {
        currentPath: this.props.location.pathname.slice(7) ? this.props.location.pathname.slice(7) : '/',
        currentDir:{
            id: 'abc',
            name: '/'
        },
        createModal: false,
        deleteModal: false,
        renameModal: false,
        newFolderModal: false,
        infoModal: {
          title: '',
          message: '',
          confirm: {},
          cancel: {},
          visible: false,
          close: false,
        },
        uploadQue: [],
        uploadProgress: 0,
        uploadType: 'files',
        selectedFiles: [],
        moveClipboard: {},
        autoRefresh: null,
        archiveModal: null,
    };

    muiTheme = {};

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

        },
    );

    cutAction = defineFileAction(
        {
            id: 'cut',
            hotkeys: ['ctrl+x'],
            button: {
                name: 'Cut',
                toolbar: false,
                contextMenu: true,
                icon: 'folder'
            },
            requiresSelection: true,
            fileFilter: (file,index, selected) =>  selected.length === 1
        }
    );

    pasteAction = defineFileAction(
        {
            id: 'paste',
            hotkeys: ['ctrl+v'],
            button: {
                name: 'Paste',
                toolbar: false,
                contextMenu: true,
                icon: 'folder'
            },
            requiresSelection: true,
            fileFilter: (file,index, selected) => FileHelper.isDirectory(file) && !!this.state.moveClipboard.src && selected.length === 1
        }
    );

    downloadAction = defineFileAction(
        {
            id: 'download',
            button: {
                name: 'Download',
                toolbar: false,
                contextMenu: true,
                icon: 'download'
            },
            requiresSelection: true,
            fileFilter: (file, index, selected) => !FileHelper.isDirectory(file) && selected.length === 1

        }
    );

    refreshAction = defineFileAction(
        {
            id: 'refresh',
            button: {
                name: 'Refresh',
                toolbar: true,
                contextMenu: false,
                icon: 'loading'
            },
            requiresSelection: false,
        }
    );

    autoRefreshAction = defineFileAction(
        {
            id: 'autorefresh',
            button: {
                name: 'Auto Refresh',
                toolbar: true,
                contextMenu: false,
                icon: 'loading'
            },
            option: true,
            requiresSelection: false,
        }
    );

    archiveAction = defineFileAction(
        {
            id: 'archive',
            button: {
                name: 'Archive',
                toolbar: false,
                contextMenu: true,
                icon: 'archive'
            },
            requiresSelection: true,
        }
    );

    extractAction = defineFileAction(
        {
            id: 'extract',
            button: {
                name: 'Extract',
                toolbar: false,
                contextMenu: true,
                icon: 'archive'
            },
            requiresSelection: true,
            fileFilter: (file, index, selected) => !FileHelper.isDirectory(file) && selected.length === 1 && file.name.split(".").pop() === "zip"
        }
    );

    newDirectoryAction = defineFileAction(
        {
            id: 'newfolder',
            button: {
                name: 'New Folder',
                toolbar: true,
                contextMenu: false,
                icon: 'folder'
            },
            requiresSelection: false
        },
        ({ reduxDispatch, getReduxState }) => {
            const reduxState = getReduxState();

            this.setState({ newFolderModal: true })
        },
    );

    help = {
        getName: (items, id) => {
            return items[id].name;
        }
    }

    fileActions = [];

    constructor(props) {
        super(props);
        this.fileActions.push(this.newDirectoryAction);
        this.fileActions.push(this.uploadAction);
        this.fileActions.push(this.renameAction);
        this.fileActions.push(this.deleteAction);
        this.fileActions.push(this.cutAction);
        this.fileActions.push(this.pasteAction);
        this.fileActions.push(this.downloadAction);
        this.fileActions.push(this.refreshAction);
        this.fileActions.push(this.autoRefreshAction);
        this.fileActions.push(this.archiveAction);
        this.fileActions.push(this.extractAction);
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        this.muiTheme = this.getTheme();
        this.list();
        document.documentElement.style.setProperty('--paper-bg', this.props.defaultTheme?.background?.paper);
        document.documentElement.style.setProperty('--paper-color', this.props.defaultTheme?.text?.primary);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.folderChain !== undefined && prevState.folderChain !== this.state.folderChain && prevState.folderChain?.length !== this.state.folderChain?.length){
            const folderPath = this.state.folderChain.reduce((prevPath, currentPath, i) => {
                return prevPath +  currentPath.name + (i === 0 ? "" : "/");
            }, "/bucket")
            if(folderPath !== this.props.location.pathname){
                this.props.history.push(folderPath)
            }
        }
    }

    getTheme() {
        return createMuiTheme({
            palette: this.props.defaultTheme,
            overrides: {
                MuiDialogTitle: {
                    root: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                },
                MuiDialog: {
                    paper: {
                        width: "100%",
                    },
                    paperWidthSm: {
                        maxWidth: "100vw",
                    }
                }
            },
        });
    }

    async onFileAction(ref){
        console.log(ref);
        switch(ref.id){
            case 'preview':
                //TODO check if the file is an image
                //TODO open a new dialog with the image and close button
                break;
            case 'delete':
                this.setState({ selectedFiles: ref.state.selectedFiles, deleteModal: true })
                break;
            case 'rename':
                if(ref.state.selectedFiles.length > 1){
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
                    this.setState({ selectedFiles: ref.state.selectedFiles, renameModal: true })
                }
                break;
            case 'move_files':
                const checkMoveResponse = await this.props.control.list({
                    path:  path.join(this.state.currentPath, ref.state.selectedFiles[0].name)
                });

                if(checkMoveResponse && checkMoveResponse.length && checkMoveResponse.some(obj => obj.name === this.state.moveClipboard.src)){
                    this.setState({
                        infoModal: {
                            visible: true,
                            title: 'File already exist',
                            message: 'Do you want to overwrite the file?',
                            confirm: {
                                label: 'Yes',
                                callback: () => new Promise(async resolve => {
                                    await moveFile()
                                    resolve()
                                })
                            },
                            cancel: {
                                label: 'Cancel',
                                callback: () => new Promise(resolve => resolve())
                            }
                        }
                    })
                } else {
                    this.props.control.move({
                        src: ref.payload.draggedFile.name,
                        source_path: this.state.currentPath,
                        dest: ref.payload.destination.name,
                        dest_path: this.state.currentPath,
                    }).then(() => {
                        this.list();
                    })
                }
                break;
            case 'open_files':
                if(ref.payload.targetFile.isDir || this.state.folderChain.find(el => el.id === ref.payload.targetFile.id)){
                    const paths = [];
                    let found = false;
                    for(let x = 0, t = this.state.folderChain.length; x<t; x++){
                        paths.push(this.state.folderChain[x].name);
                        if(this.state.folderChain[x].id === ref.payload.targetFile.id){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        paths.push(ref.payload.targetFile.name);
                    }
                    await this.setAsyncState({
                        currentPath: paths.join('/')
                    });
                    this.list();
                } else {
                    if(ref.payload.targetFile.name.match(/.(jpg|jpeg|webp|png|gif)$/i)) {
                        this.setState({
                            infoModal: {
                                visible: true,
                                title: `${this.state.currentPath}${ref.payload.targetFile.name}`,
                                message: (
                                    <img
                                        style={{ width: '100%', display: 'block', margin: 'auto' }}
                                        src={`/files/${this.state.currentPath}/${ref.payload.targetFile.name}`}
                                    />
                                ),
                                confirm: {
                                    label: 'Close',
                                    callback: () => new Promise((resolve) => resolve()),
                                },
                                close: true
                            },
                        });
                    }

                }
                break;
            case 'download':
                this.props.control.download({
                    src: ref.state.selectedFiles[0].name,
                    source_path: this.state.currentPath
                })
                break;
            case 'archive':
                let fileName = ""
                const onChange = (evt) => {
                    fileName = evt.currentTarget.value
                }
                const onConfirm = () => {
                    this.setState({
                        archiveModal: null,
                    })
                    const selectedFiles = ref.state.selectedFiles.map(file => file.name)
                    this.props.control.archive({basePath: this.state.currentPath, files: selectedFiles, fileName}).then(() => {
                        this.list()
                    })
                }

                const onCancel = () => {
                    this.setState({
                        archiveModal: null
                    })
                }

                this.setState({
                    archiveModal: () => this.modalWithInput("Archive name", "Create archive", onChange, onConfirm, onCancel)
                })
                break;
            case 'extract':
                const extractFile = () => {
                    return new Promise((resolve) => {
                        this.props.control.extract({
                            file: ref.state.selectedFiles[0].name,
                            dest_path: this.state.currentPath,
                        }).then(() => {
                            this.list();
                            resolve()
                        })
                    })
                }
                this.setState({
                    infoModal: {
                        visible: true,
                        title: 'Overwrite Files',
                        message: 'Do you want to overwrite the files?',
                        confirm: {
                            label: 'Yes',
                            callback: () => new Promise(async resolve=> {
                                await extractFile()
                                resolve()
                            })
                        },
                        cancel: {
                            label: 'Cancel',
                            callback: () => new Promise(resolve=>resolve())
                        }
                    }
                })
                break;
            case 'refresh':
                this.list();
                break;
            case 'autorefresh':
                if(this.state.autoRefresh){
                    clearInterval(this.state.autoRefresh)
                    this.setState({
                        autoRefresh: null
                    })
                } else {
                    this.setState({
                        autoRefresh: setInterval(() => {
                            this.list();
                        },30000)
                    })
                }
                break;
            case 'cut':
                this.setState({
                    moveClipboard: {
                        src: ref.state.selectedFiles[0].name,
                        source_path: this.state.currentPath
                    }
                })
                break;
            case 'paste':
                if(path.resolve(this.state.moveClipboard.source_path) === path.join(this.state.currentPath, ref.state.selectedFiles[0].name)){
                    this.setState({
                        infoModal: {
                            visible: true,
                            title: 'Same folder',
                            message: 'Cannot paste in the same folder',
                            confirm: {
                                label: 'ok',
                                callback: () => new Promise(async resolve => resolve())
                            }
                        }
                    })
                    break;
                }

                const moveFile = () => {
                    return new Promise((resolve) => {
                        this.props.control.move({
                            ...this.state.moveClipboard,
                            dest: ref.state.selectedFiles[0].name,
                            dest_path: this.state.currentPath,
                        }).then(() => {
                            this.setState({
                                moveClipboard: {}
                            })
                            this.list();
                            resolve()
                        })
                    })
                }

                let response = await this.props.control.list({
                    path:  path.join(this.state.currentPath, ref.state.selectedFiles[0].name)
                });

                if(response && response.length && response.some(obj => obj.name === this.state.moveClipboard.src)){
                    this.setState({
                        infoModal: {
                            visible: true,
                            title: 'File already exist',
                            message: 'Do you want to overwrite the file?',
                            confirm: {
                                label: 'Yes',
                                callback: () => new Promise(async resolve=> {
                                    await moveFile()
                                    resolve()
                                })
                            },
                            cancel: {
                                label: 'Cancel',
                                callback: () => new Promise(resolve=>resolve())
                            }
                        }
                    })
                } else {
                    await moveFile()
                }
                break;
        }
        return false;
    }

    list() {
        return new Promise(async resolve => {
            console.log("refereshing....")
            try {
                let objects = [];
                let response = await this.props.control.list({
                    path: this.state.currentPath
                });

                if(response && response.length){
                    response.forEach(obj => {
                        objects.push({
                            id: obj.id,
                            name: obj.name,
                            isDir: obj.dir
                        })
                    });
                }

                let folderChain = await this.props.control.completePath({
                    path: this.state.currentPath
                });


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
                        {this.state.selectedFiles.map((fileSelected) => {
                            return (<div>{fileSelected.name}</div>);
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
                                selection: this.state.selectedFiles.map(item => item.name)
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
                source: this.state.selectedFiles[0].name,
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
            evt.target.value = this.state.selectedFiles[0].name;
            evt.target.select();
            let filename = evt.target.value;
            if(evt.target.value.indexOf('.') > 0) {
                filename = filename.split('.').slice(0, -1).join('.');
            }
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
                    <div>Rename {this.state.selectedFiles.map((fileSelected) => {
                            return fileSelected.name;
                        })} to
                    </div>
                    <input className={this.props.classes.renameInput} type="text"
                           autoFocus={true}
                           onFocus={onFocusRenameInput}
                           onChange={(evt) => {
                               newItemName = evt.currentTarget.value
                           }}
                           onKeyPress={(evt) => {
                               evt.key === 'Enter' && onConfirm(evt)
                           }} />
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

    openNewFolderModal() {
        let folderName = "";
        const onConfirm = () => {
            this.props.control.mkdir({
                path: this.state.currentPath,
                name: folderName
            }).then(() => {
                this.setState({
                    newFolderModal: false,
                });
                this.list();
            });
        };
        const onCancel = () => {
            this.setState({
                newFolderModal: false,
            });
        };
        const onChange = (evt) => {
            folderName = evt.currentTarget.value
        }
        return (
            this.modalWithInput("Add new folder", "Add folder", onChange, onConfirm, onCancel)
        );
    }

    modalWithInput(heading, primaryBtnLabel, onChange, onConfirm, onCancel) {
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
                    <h4 style={{ textAlign: "center" }}>{heading}</h4>
                </DialogTitle>
                <DialogContent
                    style={{ overflow: "auto" }}
                    id="classic-modal-slide-description"
                    className={this.props.classes.modalBody}
                >
                    <input className={this.props.classes.renameInput} type="text"
                           autoFocus={true}
                           onChange={onChange}
                           onKeyPress={(evt) => {
                               evt.key === 'Enter' && onConfirm(evt)
                           }}
                    />
                </DialogContent>

                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <Button color="primary" onClick={onConfirm}>{primaryBtnLabel}</Button>
                    <Button color="danger" onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        )
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
                   {this.state.infoModal.close ? (
                        <IconButton
                            aria-label='close'
                            className={this.props.classes.closeButton}
                            onClick={() =>
                                  this.setState({
                                        infoModal: {
                                         visible: false,
                                         title: '',
                                         message: '',
                                         confirm: {},
                                         close: false,
                             },
                        })
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : null}

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
                    {this.state.infoModal.cancel && <Button
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
                    </Button>}
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
        const onFileAction = (data) => {
            this.onFileAction(data);
        };

        return (
                <React.Fragment>
                    <Helmet>
                        <title>Bucket (file manager)</title>
                    </Helmet>
                    <MuiThemeProvider theme={this.muiTheme}>
                        <div style={{ height: '100vh', paddingTop: '60px' }}>
                            <FileBrowser onFileAction={onFileAction} fileActions={this.fileActions} files={this.state.files} folderChain={this.state.folderChain}>
                                <ThemeProvider theme={{
                                    merged: true,
                                    colors: {
                                        textActive: this.props.defaultTheme?.primary?.main,
                                    },
                                }}>
                                    <FileToolbar classes={classes.FileToolbar} />
                                    <FileNavbar classes={classes.FileNavbar}/>
                                    <FileContextMenu />
                                    <FileList />
                                </ThemeProvider>
                            </FileBrowser>
                        </div>
                        {this.state.createModal ? this.openEditor(true) : ""}
                        {this.state.deleteModal ? this.openDeleteModal() : ""}
                        {this.state.renameModal ? this.openRenameModal() : ""}
                        {this.state.newFolderModal ? this.openNewFolderModal() : ""}
                        {this.state.infoModal.visible ? this.openInfoModal() : ""}
                        {this.state.archiveModal && this.state.archiveModal()}
                    </MuiThemeProvider>
                </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ViewBucket));

ViewBucket.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object
};