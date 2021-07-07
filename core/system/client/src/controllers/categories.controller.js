import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewCategories from "../templates/ViewCategories/ViewCategories";

class CategoriesController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        add: (params) => this.add(params),
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
    };
    channel = 'categories';

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
        console.log('got message in categories controller', params);
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
                    api: 'categories',
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
                    api: 'categories',
                    act: 'add',
                    payload: {
                        title: params.title,
                        description: params.description,
                        parentid: params.parentid,
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
                    api: 'categories',
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
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'edit',
                    payload: {
                        id: params.id,
                        title: params.title,
                        description: params.description,
                        parentid: params.parentid
                    }
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    render() {
        return <ViewCategories control={this.control} {...this.props} />;
    }

}

export default CategoriesController;

CategoriesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};