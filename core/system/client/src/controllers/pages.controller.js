import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewPages from "../templates/ViewPages/ViewPages";
import ViewPagesEditor from "../templates/ViewPages/ViewPagesEditor";

class PagesController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        add: (params) => this.add(params),
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
        listCategories: (params) => this.listCategories(params),
    };
    channel = 'pages';

    async componentDidMount() {
        console.log(this.props);
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
        console.log('got message in pages controller', params);
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

    listCategories(){
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

    list(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
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
                    api: 'pages',
                    act: 'add',
                    payload: params
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
                    api: 'pages',
                    act: 'remove',
                    payload: params
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
                    api: 'pages',
                    act: 'edit',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    render() {
        switch (this.props.location.pathObject[1]) {
            default:
                return <ViewPages control={this.control} {...this.props} />;
                break;
            case 'edit':
                return <ViewPagesEditor control={this.control} {...this.props} />;
                break;
            case 'add':
                return <ViewPagesEditor control={this.control} {...this.props} />;
                break;
        }

    }

}

export default PagesController;

PagesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};