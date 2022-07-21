import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewClients from "../templates/ViewClients/ViewClients";

class ClientsController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        add: (params) => this.add(params),
        set: (params) => this.set(params),
        rem: (params) => this.rem(params),
    };

    channel = 'clients';

    async componentDidMount() {
        this.props.services.ws.subscribe({
            channel: this.channel,
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.props.services.ws.emit({
                id: uniqueId,
                channel: this.channel,
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    list(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'clients',
                    act: 'list',
                    payload: params,
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    add(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'clients',
                    act: 'add',
                    payload: {
                        firstName: params.firstName,
                        lastName: params.lastName,
                        email: params.email,
                        password: params.password,
                        type: params.type,
                        active: params.active || 0
                    }
                });

                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    rem(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'clients',
                    act: 'rem',
                    payload: {
                        id: params.id
                    }
                });

                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    set(params){
        return new Promise(async resolve => {
            try {
                const payload = {
                    module: 'system',
                    api: 'clients',
                    act: 'set',
                    payload: {
                        data: params
                    }
                };
                const response = await this.sendMessage(payload);

                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    render() {
        return <ViewClients control={this.control} {...this.props} />;
    }

}

export default ClientsController;

ClientsController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};