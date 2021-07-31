import React, { Component } from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewAdminProfile from "../templates/ViewAdminProfile/ViewAdminProfile";
import Snackbar from "components/Snackbar/Snackbar.js";

class AdminProfileController extends Component {
    state = {
        errorNotification : [],
    };
    services = this.props.services;
    messageCallbacks = {};
    config = {
        prefix: 'admin-profile/'
    };
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
            api: "adminProfile",
            act: "setInfo",
            payload: {
                useSession: true,
                payload: params
            }
        });
        if (response?.success) {
            localStorage.setItem('admin', JSON.stringify({ fullname: response.data.fullName }));
            document.location.reload();
        }

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
                this.state.errorNotification.map((msg) => {
                    return (
                        <Snackbar 
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
                <ViewAdminProfile control={this.control} {...this.props} />
            </>
        );
    }

}

export default AdminProfileController;

AdminProfileController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};