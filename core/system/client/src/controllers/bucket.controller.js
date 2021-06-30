import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewBucket from "../templates/ViewBucket/ViewBucket";
import axios from 'axios';

class BucketController extends Component {

    messageCallbacks = {};
    control = {
        //getOne: (params) => this.getOne(params),
        list: (params) => this.list(params),
        //set: (params) => this.setData(params),
        upload: (params) => this.upload(params),
        rename: (params) => this.rename(params),
        delete: (params) => this.delete(params),
        //rem: (params) => this.remData(params)
    };
    channel = 'bucket';

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
        console.log('got message in bucket controller', params);
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

    upload(params){
        return new Promise(resolve => {
            var formData = new FormData();

            formData.append('path', params.path);
            formData.append('replace', params.replace || true);
            formData.append('totalFiles', params.files.length);

            //always place the files at the end
            Array.from(params.files).forEach(file => {
                formData.append(file.name, file, file.name);
            });
            axios.post("/bucket", formData, {
                onUploadProgress: evt => {
                    if(evt.loaded === evt.total){
                        resolve();
                    }
                    params.progress(evt)
                }
            });
        });

    }

    delete (params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'rm',
                    payload: {
                        path: params.path,
                        selection: params.selection
                    }
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
                    api: 'bucket',
                    act: 'list',
                    payload: {
                        path: params.path
                    }
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    rename(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'rename',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    render() {
        return <ViewBucket control={this.control} {...this.props} />;
    }

}

export default BucketController;

BucketController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
};