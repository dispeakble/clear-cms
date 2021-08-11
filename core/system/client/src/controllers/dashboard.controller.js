import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewDashboard from "../templates/ViewDashboard/ViewDashboard";

class DashboardController extends Component {
    state = {

    };
    services = this.props.services;
    messageCallbacks = {};
    control = {
        get: () => this.getData(),
        set: (params) => this.setData(params),
    };

    async componentDidMount() {
        this.services.ws.subscribe({
            channel: 'admin-profile',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });
    }

    async getData() {
        return this.sendMessage({
            module: "system",
            api: "adminProfile",
            act: "getInfo",
            payload: {
                useSession: true
            }
        });
    }

    async setData(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "dashboard",
            act: "set",
            payload: {
                useSession: true,
                payload: params
            }
        });
        
        return response;
    }

    onMessage(params) {
        try {
            if (params.data) {
                this.messageCallbacks[params.id](params.data);
            } else {
                this.updateErrorNotification(params.error);
            }

        } catch (err) {
            console.log(err);
        }
        console.log('got message in admin profile controller', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send, reject_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'admin-profile',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    render() {
        return (
            <React.Fragment>
                <ViewDashboard control={this.control} {...this.props} />
            </React.Fragment>
        );
    }

}

export default DashboardController;

DashboardController.propTypes = {
    services: PropTypes.object
};