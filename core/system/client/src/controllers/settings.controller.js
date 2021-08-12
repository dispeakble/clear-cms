import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewGeneralSettings from "../templates/ViewGeneralSettings/ViewGeneralSettings";
import Snackbar from "components/Snackbar/Snackbar.js";

class GeneralSettingsController extends Component {
    state = {
        errorNotification : [],
    };
    services = this.props.services;
    messageCallbacks = {};
    config = {
        prefix: 'general-settings/'
    };
    control = {
        get: () => this.getData(),
        set: (params) => this.setData(params),
    };


    async componentDidMount() {

        this.services.ws.subscribe({
            channel: 'general-settings',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
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

    async setData(params) {
        try {
            await this.sendMessage({
                module: "system",
                api: "generalSettings",
                act: "setInfo",
                payload: {
                    useSession: true,
                    payload: params
                }
            });

            return {
                success: "General Settings are updated Successfully"
            };

        } catch (e) {
            return {
                error: "Error in updating General Settings"
            }
        }
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in general settings controller', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'general-settings',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    updateErrorNotification (errMsg) {
        this.setState({
            errorNotification : [...this.state.errorNotification, errMsg]
        })
    }

    removeErrorNotification (errMsg) {
        const updatedErrorNotification = this.state.errorNotification.filter(msg => msg !== errMsg);
        this.setState({
            errorNotification: updatedErrorNotification,
        })
    }

    render() {
        return (
            <>
                {
                    this.state.errorNotification.map((msg, index) => {
                        return (
                            <Snackbar
                                key={index}
                                place='tc'
                                message={msg}
                                open
                                close
                                closeNotification={() => {this.removeErrorNotification(msg)}}
                                color='warning'
                            />

                        )
                    })
                }
                <ViewGeneralSettings control={this.control} {...this.props} />
            </>
        );
    }

}

export default GeneralSettingsController;

GeneralSettingsController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};