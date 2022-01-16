import React, {Component} from "react";
import {createTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/views/componentsSections/javascriptStyles.js";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Scrollbars } from 'react-custom-scrollbars';
import Close from "@material-ui/icons/Close";
import Button from "components/CustomButtons/Button.js";
import {Divider, Tooltip} from "@material-ui/core";
import PropTypes from "prop-types";

class Modal extends Component {

    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    state = {
        modalClasses: {
            paper: this.props.classes.modal
        },
        muiTheme: {},
        customSize: false
    };

    callCloseCallback(data) {
        this.props.closeButton.callback(data);
    }

    callConfirmCallback(data) {
        this.props.confirmButton.callback(data);
    }

    componentDidMount() {

        const themeOptions = {
            palette: this.props.defaultTheme,
            overrides: {
                MuiToggleButton: {
                    root: {
                        textTransform: "none !important",
                        lineHeight: "1rem"
                    }
                },
                MuiTab:{
                    root:{
                        textTransform:"none !important"
                    }
                },
                MuiButton:{
                    root:{
                        textTransform: "none !important"
                    }
                },
                MuiDialog: {
                    paper: {}
                }
            }
        };

        let customSize = false;

        if(this.props.width) {
            customSize = true;
            themeOptions.overrides.MuiDialog.paper.width = this.props.width;
        }

        if(this.props.height) {
            customSize = true;
            themeOptions.overrides.MuiDialog.paper.height = this.props.height;
        }

        if(this.props.resize) {
            if(this.props.id && this.props.id.length) {
                const savedModalProps = localStorage.getItem(`modal-${this.props.id}`);
                if(savedModalProps) {
                    try {
                        customSize = true;
                        themeOptions.overrides.MuiDialog.paper = JSON.parse(savedModalProps);
                    } catch (err) {
                        console.log(`couldn't parse the dialog props`)
                    }
                }
            }
        }

        this.setState({
            customSize,
            muiTheme: createTheme(themeOptions)
        });

    }

    // transition = React.forwardRef((props, ref) => {
    //     return <Slide direction="down" ref={ref} {...props} />;
    // });

    getModalCss() {
        return getComputedStyle(this.modalRef.current.querySelector('div[class*="MuiPaper-root-"]'));
    }

    getModalProps() {
        const modalStyle = this.getModalCss();

        const cssProps = ["width", "height"];

        const modalProps = {};

        cssProps.forEach((el) => {
            modalProps[el] = modalStyle[el];
        });

        return modalProps;
    }

    saveModalProps() {
        if(this.props.id && this.props.id.length) {
            const modalProps = this.getModalProps();
            localStorage.setItem(`modal-${this.props.id}`, JSON.stringify(modalProps));
        }

    }

    render() {

        const classes = this.props.classes;

        const modalClasses = this.state.modalClasses;
        modalClasses.paper = this.props.classes.modal;
        if(this.props.resize) {
            modalClasses.paper += ` ${this.props.classes.modalResize}`;
        }

        if(!this.state.customSize) {
            modalClasses.paper +=  " " + this.props.classes[`${this.props.modalSize || "normal"}Modal`];
        }

        const dialogElement = () => (<Dialog
            ref={this.modalRef}
            classes={modalClasses}
            open={this.props.showModal}
            keepMounted={true}
            onClose={(event, reason) => this.callCloseCallback(reason)}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
            disableAutoFocus={true}
            disableRestoreFocus={true}
            disableEnforceFocus={true}
        >
            <DialogTitle disableTypography className={classes.modalHeader}>
                <h4 className={classes.modalTitle}>{this.props.title}</h4>
                <Tooltip title="Close">
                    <IconButton
                        className={classes.modalCloseButton}
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => {
                            this.saveModalProps()
                            this.callCloseCallback(false);
                        }}
                    >
                        <Close className={classes.modalClose}/>
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <Divider/>
            <DialogContent className={classes.modalBody}>
                {this.props.modalSize !== 'small' ?
                    <Scrollbars autoHide universal style={{ height: '100%' }}>
                        <div style={{padding: '24px', minHeight: '100%', display: 'flex', flexDirection: 'column'}}>
                            {this.props.content}
                        </div>
                    </Scrollbars> :
                    <div style={{padding: '24px'}}>
                        {this.props.content}
                        {this.props.children}
                    </div>
                }
            </DialogContent>
            <DialogActions className={classes.modalFooter}>
                {this.props.confirmButton && (
                    <Button
                        color="primary"
                        onClick={() => {
                            this.saveModalProps()
                            this.callConfirmCallback(true);
                        }}
                    >
                        {this.props.confirmButton.label}
                    </Button>
                )}
                {this.props.closeButton && (
                    <Button
                        color="danger"
                        onClick={() => {
                            this.saveModalProps()
                            this.callCloseCallback(false);
                        }}
                    >
                        {this.props.closeButton.label}
                    </Button>
                )}
            </DialogActions>
        </Dialog>);

        return (
            this.props.resize ?
            <MuiThemeProvider theme={this.state.muiTheme}>
                {dialogElement()}
            </MuiThemeProvider>
                :
                dialogElement()
        )
    }
}

export default withStyles(styles)(Modal);

Modal.propTypes = {
    id: PropTypes.string,
    defaultTheme: PropTypes.object,
    resize: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    saveDimensions: PropTypes.bool,
    closeButton: PropTypes.object,
    confirmButton: PropTypes.object,
    style: PropTypes.object,
    classes: PropTypes.object,
    modalSize: PropTypes.string,
    showModal: PropTypes.bool,
    title: PropTypes.any,
    content: PropTypes.any,
    children: PropTypes.oneOfType([
        PropTypes.any,
        PropTypes.element,
        PropTypes.string
    ]),
};
