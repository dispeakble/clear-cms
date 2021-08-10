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
        completePath: (params) => this.completePath(params),
        //set: (params) => this.setData(params),
        upload: (params) => this.upload(params),
        rename: (params) => this.rename(params),
        mkdir: (params) => this.mkdir(params),
        delete: (params) => this.delete(params),
        move: (params) => this.move(params),
        download: (params) => this.download(params),
        archive: (params) => this.archive(params),
        extract: (params) => this.extract(params)
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

    download(params){
        return new Promise(async resolve => {
            try {
                function base64ToArrayBuffer(base64) {
                    let binaryString = window.atob(base64);
                    let binaryLen = binaryString.length;
                    let bytes = new Uint8Array(binaryLen);
                    for (let i = 0; i < binaryLen; i++) {
                        let ascii = binaryString.charCodeAt(i);
                        bytes[i] = ascii;
                    }
                    return bytes;
                }

                function saveByteArray(reportName, byte, mimeType) {
                    let blob = new Blob([byte], {type: mimeType});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    let fileName = reportName;
                    link.download = fileName;
                    link.click();
                }
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'download',
                    payload: params
                });

                let bufArr = base64ToArrayBuffer(response.file);
                saveByteArray(response.fileName, bufArr, response.mimeType);
                resolve()
            } catch (err) {
                resolve(null);
            }
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

    completePath(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'completePath',
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

    move(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'move',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    archive(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'archive',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    extract(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'extract',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    mkdir(params){
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'bucket',
                    act: 'mkdir',
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