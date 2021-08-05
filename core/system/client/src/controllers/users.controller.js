import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewUsers from "../templates/ViewUsers/ViewUsers";

class UsersController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        add: (params) => this.add(params),
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
    };

    channel = 'users';

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
        console.log('got message in users controller', params);
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
                    api: 'users',
                    act: 'list',
                    payload: {}
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
                    api: 'users',
                    act: 'add',
                    payload: {
                        fname: params.fname,
                        lname: params.lname,
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

    remove(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'users',
                    act: 'remove',
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

    edit(params){
        return new Promise(async resolve => {
            try {
                const payload = {
                    module: 'system',
                    api: 'users',
                    act: 'edit',
                    payload: {
                        fname: params.fname,
                        lanme: params.lanme,
                        email: params.email,
                        type: params.type,
                        active: params.active
                    }
                };
                if(params.password && params.password.length) {
                    payload.payload.password = params.password;
                }
                const response = await this.sendMessage(payload);

                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    render() {
        return <ViewUsers control={this.control} {...this.props} />;
    }

}

export default UsersController;

UsersController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};