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
        getBoxList: () => this.getBoxList(),
        addBox: (params) => this.addBox(params),
        editBox: (params) => this.editBox(params),
        removeBox: (params) => this.removeBox(params)
    };

    async componentDidMount() {
        this.services.ws.subscribe({
            channel: 'dashboard',
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

    async getBoxList() {
        return this.sendMessage({
            module: "system",
            api: "dashboardBox",
            act: "list",
            payload: {}
        })
    }

    async addBox(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "dashboardBox",
            act: "add",
            payload: params
        });

        return response;
    }

    async editBox(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "dashboardBox",
            act: "edit",
            payload: params
        });

        return response;
    }

    async removeBox(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "dashboardBox",
            act: "remove",
            payload: params
        });

        return response;
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
            this.messageCallbacks[params.id](params.data);
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
                channel: 'dashboard',
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