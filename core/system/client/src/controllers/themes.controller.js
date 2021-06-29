import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewThemes from "../templates/ViewThemes/ViewThemes";

class ThemesController extends Component {
    messageCallbacks = {};
    control = {
        getOne: (params) => this.getOne(params),
        getAll: (params) => this.getAll(params),
        set: (params) => this.setData(params),
        add: (params) => this.addData(params),
        rem: (params) => this.remData(params)
    };
    channel = 'themes';

    async componentDidMount() {
        this.props.services.ws.subscribe({
            channel: this.channel,
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

    }

    getOne(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "getOne",
            payload: {
                where: params.data
            }
        });
    }

    getAll(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "getAll",
            payload: null
        });
    }

    async setData(params) {
        await this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "setInfo",
            payload: {
                data: params.data,
                where: params.where,
            }
        });
    }

    addData(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "addInfo",
            payload: params.data
        });
    }

    remData(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "remInfo",
            payload: params.data
        });
    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in themes controller', params);
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

    render() {
        return <ViewThemes control={this.control} {...this.props} />;
    }

}

export default ThemesController;

ThemesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};