import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewThemes from "../templates/ViewThemes/ViewThemes";

class ThemesController extends Component {
    messageCallbacks = {};
    control = {
        get: (params) => this.get(params),
        list: (params) => this.list(params),
        set: (params) => this.set(params),
        add: (params) => this.add(params),
        rem: (params) => this.rem(params)
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

    get(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "get",
            payload: {
                where: params.data
            }
        });
    }

    list(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "list",
            payload: null
        });
    }

    async set(params) {
        if(params.data.isDefault) {
            localStorage.setItem('adminTheme', params.data.data)
        }

        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "set",
            payload: {
                data: params.data,
                where: params.where,
            }
        });
    }

    add(params) {
        if(params.data.isDefault) {
            localStorage.setItem('adminTheme', params.data.data)
        }

        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "add",
            payload: params.data
        });
    }

    rem(params) {
        return this.sendMessage({
            module: "system",
            api: params.type + "Themes",
            act: "rem",
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