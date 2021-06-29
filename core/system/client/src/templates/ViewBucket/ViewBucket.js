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
import {DropzoneArea} from "material-ui-dropzone";
import Switch from "@material-ui/core/Switch";
import {FormControlLabel} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

class ViewBucket extends Component {
    state = {
        currentPath: '/',
        currentDir:{
            id: 'abc',
            name: '/'
        },
        createModal: false,
        deleteModal: false,
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
            }
        },
        ({ reduxDispatch, getReduxState }) => {
            const reduxState = getReduxState();

            this.setState({ selectedFiles: reduxState.selectionMap, deleteModal: true })
        },
    )

    fileActions = [];

    constructor(props) {
        super(props);
        this.fileActions.push(this.uploadAction);
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
                    <h4 style={{ textAlign: "center" }}>Upload Files to "{this.state.currentPath}"</h4>
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
                        <FileBrowser fileActions={this.fileActions} files={this.state.files} folderChain={this.state.folderChain}>
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