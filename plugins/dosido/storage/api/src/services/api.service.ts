import {ModuleInterface} from "../interfaces/module.interface";
import {Inject, Injectable} from "@nestjs/common";
import * as fs from 'fs';
import * as nodePath from 'path';
import * as fsExtra from 'fs-extra';

@Injectable()
export class ApiService {
    //exposed methods
    private methods = ["save", "delete", "copy", "rename", "move", "duplicate", "unzip", "archive"];

    private coreFolder = nodePath.resolve(__dirname + '/');

    constructor(@Inject('ProtocolService') private protocolService, @Inject('FileUtils') private fileUtils) {

    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Api.systemService." + data.act + " not found");
        }
        return null;
    }

    private save(params) {

    }

    private delete(params) {
        return new Promise((resolve) => {
            const pendingRequests = [];
            const errorDeleted = [];
            params.files.forEach((item, i, arr) => {
                item = this.fileUtils.escapePath(item);
                pendingRequests.push(
                    fsExtra.remove(`${this.coreFolder}${item}`, err => {
                        if (err) {
                            errorDeleted.push({item, err});
                        }
                    })
                )
            });
            Promise.all(pendingRequests)
                .then(values => {
                    resolve({
                        'status': 'success',
                        'message': 'File or folder succesfully deleted!'
                    });
                })
                .catch(error => {
                    resolve({
                        'status': 'error',
                        'message': 'incident logged'
                    });
                });
        });

    }

    private copy(params) {
        return new Promise(resolve => {
            params.destination = this.fileUtils.escapePath(params.destination);

            const pendingRequests = [];
            const errorCopy = [];
            params.items.forEach((item, i, arr) => {
                const newItem = this.fileUtils.escapePath(item);
                const newDestination = `${this.coreFolder}${params.destination}/` + item.split('/').pop();
                pendingRequests.push(
                    fsExtra.copy(`${this.coreFolder}${newItem}`, newDestination, err => {
                        if (err) {
                            errorCopy.push({newItem, err});
                        }
                    })
                )
            });
            Promise.all(pendingRequests)
                .then(values => {
                    resolve({
                        status: "success",
                        message: "items copied"
                    })
                })
                .catch(error => {
                    resolve({
                        status: "error",
                        message: "incident was logged"
                    })
                });
        });
    }

    private rename(params) {
        return new Promise((resolve) => {
            const path = this.fileUtils.escapePath(params.path);

            if (!this.fileUtils.checkExtension(nodePath.extname(params.newname))) {
                resolve({
                    status: "error",
                    message: "wrong format"
                })
                return;
            }

            const editPath = path.split("/");
            editPath.pop();
            editPath.push(params.newname);
            const renamePath = editPath.join('/');
            fs.rename(`${this.coreFolder}/${path}`, `${this.coreFolder}/${renamePath}`, function (err) {
                if (err) {
                    resolve({
                        status: "error",
                        message: "incident was logged"
                    })
                } else {
                    resolve({
                        status: "success",
                        message: "item renamed"
                    })
                }
            });
        });

    }

    private move(params) {
        return new Promise((resolve) => {
            params.destination = this.fileUtils.escapePath(params.destination);
            const pendingRequests = [];
            try {
                params.items.forEach(function(item, i, arr) {
                    const newItem = this.fileUtils.escapePath(item);
                    const newdestination =   `${this.coreFolder}${params.destination}/` + item.split('/').pop();
                    pendingRequests.push(
                        fsExtra.moveSync(`${this.coreFolder}${newItem}`, newdestination, { overwrite: true })
                    )
                });
                Promise.all(pendingRequests)
                    .then(values => {
                        resolve({
                            status: "success",
                            message: "items moved"
                        })
                    })
            } catch (error) {
                resolve({
                    status: "error",
                    message: "incident was logged"
                })
            }
        })

    }

    private folderTree(params) {
        return this.fileUtils(this.coreFolder + this.fileUtils(params.path), {
            normalizePath: true,
            removePath: this.coreFolder,
            withChildren: true
        });
    }

    private folderInfo(params) {

    }

    private createFile(params) {

    }

    private createFolder(params) {

    }

    private emptyDir(params) {

    }

    private duplicate(params) {

    }

    private unzip(params) {

    }

    private archive(params) {

    }

    private escapePath(path) {
        return (typeof path !== 'undefined' && path !== '' && !path.includes('..') && !path.includes('./')) ? path : '/uploads/';
    }

    private checkExtension(extension) {
        const allowedFiles = ['.jpg', '.png', '.gif', '.jpeg', '.svg', '.doc', '.txt', '.csv', '.docx', '.xls', '.xml', '.pdf', '.zip', '.ppt', '.mp4', '.ai', '.psd', '.mp3', '.avi'];
        return (extension !== '') ? ((allowedFiles.indexOf(extension) === -1) ? false : true) : true;
    }
}
