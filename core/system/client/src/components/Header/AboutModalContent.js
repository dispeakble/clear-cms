import React, {Component, Fragment} from "react";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "../../assets/jss/clear-crm/components/AboutModalContentStyle";
import { withStyles } from "@material-ui/core/styles";
import {Link, InputAdornment} from "@material-ui/core";
import * as shortId from "shortid";
import {Check, CloseSharp, EditSharp} from "@material-ui/icons";
import Snackbar from "../Snackbar/Snackbar";
import DoneOutline from "@material-ui/icons/DoneOutline";
import PropTypes from "prop-types";

class AboutModalContent extends Component {

    state = {
        websiteName: "",
        applicationVersion:"",
        websiteInfo: "",
        editable: {
            websiteName: false,
            applicationVersion: false
        },
        releaseDate: new Date().toString(),
        notification: ""
    }

    services = this.props.services;
    messageCallbacks = {};

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        await this.services.ws.subscribe({
            channel: 'about-modal',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });
        const generalSettingsData = await this.getData();
        if(generalSettingsData.websiteName && generalSettingsData.applicationVersion) {
            this.setAsyncState({
                websiteName: generalSettingsData.websiteName,
                applicationVersion: generalSettingsData.applicationVersion,
                websiteInfo: generalSettingsData
            })
        }
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in about modal', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'about-modal',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    async getData() {
        const response = await this.sendMessage({
            module: "system",
            api: "generalSettings",
            act: "getInfo",
            payload: {
                useSession: true
            }
        });
        if (response.data) {
            return JSON.parse(response.data);
        }
        return null;
    }

    async updateData(fieldName) {
        try {

            const updatedData = {
                ...this.state.websiteInfo,
                [fieldName]: this.state[fieldName]
            }

            await this.sendMessage({
                module: "system",
                api: "generalSettings",
                act: "setInfo",
                payload: {
                    useSession: true,
                    payload: {
                        data: updatedData
                    }
                }
            });

            this.setState((prevState) => {
                return {
                    ...prevState,
                    websiteInfo: updatedData
                }
            })

            this.openNotification({
                open: true,
                color: "success",
                message: "Details are updated"
            });

        } catch (e) {
            console.log("Error in updating website details", e);
        } finally {
            this.updateEditableState(fieldName, false);
        }
    }

    handleInputChange = async (event) => {
        let newState = {};
        newState[event.target.id] = event.target.value;
        await this.setAsyncState(newState);
    };

    updateEditableState = (fieldName, isEditable) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                editable: {
                    ...prevState.editable,
                    [fieldName]: isEditable
                }
            }
        })
    }

    openNotification(params) {
        this.setState({
            notification: <Snackbar
                open={params.open}
                place={params.place || "tc"}
                color={params.color}
                icon={params.icon || DoneOutline}
                message={params.message}
            />
        });

        setTimeout(() => {
            this.setState({
                notification: ""
            })
        }, 5000)
    }


    render() {
        const classes = this.props.classes;

        return (
            <div className={classes.root}>
                {this.state.notification}
                <div className={classes.editableField}>
                    {this.state.editable.websiteName
                        ? <CustomInput
                            labelText="Website Name"
                            id="websiteName"
                            required="required"
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                type: "text",
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Check className={classes.save} onClick={() => this.updateData("websiteName")} />
                                        <CloseSharp className={classes.close} onClick={() => this.updateEditableState("websiteName", false)} />
                                    </InputAdornment>
                                ),
                                value: this.state.websiteName,
                                onChange: (event) => this.handleInputChange(event),
                            }}
                        />
                        : <Fragment>
                            <div>
                                Website Name: {this.state.websiteInfo.websiteName}
                            </div>
                            <EditSharp onClick={() => this.updateEditableState("websiteName", true)}/>
                         </Fragment>}
                </div>
                <div className={classes.editableField}>
                    {this.state.editable.applicationVersion
                        ? <CustomInput
                            labelText="App Version"
                            id="applicationVersion"
                            required="required"
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                type: "text",
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Check className={classes.save} onClick={() => this.updateData("applicationVersion")} />
                                        <CloseSharp className={classes.close} onClick={() => this.updateEditableState("applicationVersion", false)} />
                                    </InputAdornment>
                                ),
                                value: this.state.applicationVersion,
                                onChange: (event) => this.handleInputChange(event),
                            }}
                        />
                        : <Fragment>
                            <div>
                                Application Version: {this.state.websiteInfo.applicationVersion}
                            </div>
                            <EditSharp onClick={() => this.updateEditableState("applicationVersion", true)}/>
                        </Fragment>}
                </div>
                <div className={classes.fieldItem}>
                    Release Date: {this.state.releaseDate}
                </div>
                <div className={classes.fieldItem}>
                    Copyright website @2021
                </div>
                <div className={classes.fieldItem}>For Support: <Link href={"https://www.dosidoweb.com"}>dosidoweb.com</Link></div>
            </div>
        );
    }
}

export default withStyles(styles)(AboutModalContent);

AboutModalContent.propTypes = {
    services: PropTypes.object,
    classes: PropTypes.object
}