import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewPages from "../templates/ViewPages/ViewPages";
import ViewPagesEditor from "../templates/ViewPages/ViewPagesEditor";
import ViewPagesPreview from "../templates/ViewPages/ViewPagesPreview";
import axios from "axios";
import _ from "lodash";

class PagesController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        get: (params) => this.get(params),
        add: (params) => this.add(params),
        addCategory: (params) => this.addCategory(params),
        edit: (params) => this.edit(params),
        duplicate: (params) => this.duplicate(params),
        rem: (params) => this.rem(params),
        listCategories: (params) => this.listCategories(params),
        listTemplates: (params) => this.listTemplates(params),
        getPublicTheme: () => this.getPublicTheme(),
    };

    help = {
        fileExtension: (string) => {
            const p = string.split('.');
            return p[p.length - 1].toLowerCase();
        }
    }

    channel = 'pages';

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

    listCategories() {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'categories',
                    act: 'list',
                    payload: null
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    list(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'list',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    listTemplates() {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'list',
                    payload: {isTemplate: true}
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    get(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'get',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    getPublicTheme() {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'publicThemes',
                    act: 'getOne',
                    payload: {
                        isDefault: 1
                    }
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }


    add(params) {
        return new Promise(async resolve => {
            try {

                if (params.pageConfig.backgroundImageFile) {
                    params.pageConfig.backgroundImage = `background.${this.help.fileExtension(params.pageConfig.backgroundImageFile.name)}`;
                }

                const paramsClone = _.cloneDeep(params);
                
                delete paramsClone.pageConfig.backgroundImageFile;

                paramsClone.boxes = paramsClone.boxes.map((box) => {
                    if (box.data.backgroundImageFile) {
                        box.data.backgroundImage = `background.${this.help.fileExtension(box.data.backgroundImageFile.name)}`;
                    }

                    //for the DB we don't need to send binaries
                    delete box.data.backgroundImageFile;

                    if(Array.isArray(box.moduleOptions.files)) {
                        box.moduleOptions.files = box.moduleOptions.files.map(boxFile => {
                            delete boxFile.file;
                            return boxFile;
                        });
                    }

                    return box;
                });

                //we will add new boxes to get the page id and box ids
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'add',
                    payload: paramsClone
                });

                //Uploading page background
                if (params.pageConfig.backgroundImageFile) {
                    await this.uploadFiles({
                        path: "/pages/page-" + response.pageId + "/",
                        files: [{
                            name: params.pageConfig.backgroundImage,
                            file: params.pageConfig.backgroundImageFile
                        }]
                    })
                }

                await Promise.all(params.boxes.filter(box => !box.data.templateUsed).map((box, i) => {
                    return new Promise((resolve_upload) => {

                        //Uploading box background
                        if (box.data.backgroundImageFile) {
                            this.uploadFiles({
                                path: "/pages/page-" + response.pageId + "/box-" + response.boxes[i] + "/",
                                files: [{
                                    name: `background.${this.help.fileExtension(box.data.backgroundImageFile.name)}`,
                                    file: box.data.backgroundImageFile
                                }]
                            });
                        }

                        //Uploading box files
                        if (box.module && Array.isArray(box.data.files) && box.data.files.length) {

                            const newFiles = box.data.files.filter(fileObj => !!fileObj.file);

                            this.uploadFiles({
                                path: "/pages/page-" + response.pageId + "/box-" + response.boxes[i] + "/module/",
                                files: newFiles
                            });
                        }

                        resolve_upload(true);
                    });

                }))
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    rem(params) {
        return new Promise(async resolve => {
            try {
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'rem',
                    payload: params
                });
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    edit(params) {
        return new Promise(resolve => {
            try {
                (async () => {
                    if (params.pageConfig.hasBackgroundImage && params.pageConfig.backgroundImageFile) {
                        params.pageConfig.backgroundImage = `background.${this.help.fileExtension(params.pageConfig.backgroundImageFile.name)}`;
                        await this.uploadFiles({
                            path: "/pages/page-" + params.id + "/",
                            files: [{
                                name: params.pageConfig.backgroundImage,
                                file: params.pageConfig.backgroundImageFile
                            }],
                            progress: (evt) => {
                                params.uploadProgress(evt);
                            }
                        });
                    }

                    const paramsClone = _.cloneDeep(params);

                    if(paramsClone.pageConfig.backgroundImageFile.length || !paramsClone.pageConfig.hasBackgroundImage) {
                        paramsClone.pageConfig.deleteOldBackground = true;
                    }

                    delete paramsClone.pageConfig.backgroundImageFile;

                    //we will add new boxes to get the IDs
                    paramsClone.boxes = paramsClone.boxes.map((box) => {
                        if (box.data.backgroundImageFile) {
                            box.data.backgroundImage = `background.${this.help.fileExtension(box.data.backgroundImageFile.name)}`;
                        }

                        delete box.data.backgroundImageFile;//for the DB we don't need to send binaries

                        if (box.moduleOptions && box.moduleOptions && box.moduleOptions.files) {
                            box.moduleOptions.files = box.moduleOptions.files.map(boxFile => {
                                delete boxFile.file;
                                return boxFile;
                            });
                        }
                        return box;
                    });

                    const response = await this.sendMessage({
                        module: 'system',
                        api: 'pages',
                        act: 'edit',
                        payload: paramsClone
                    });

                    params.boxes = params.boxes.map((box) => {
                        response.boxes.map((dbBox) => {
                            if (Number(box.data.i) === Number(dbBox.ref)) {
                                box.id = dbBox.id;
                            }
                            return dbBox
                        });
                        return box;
                    });

                    await Promise.all(params.boxes.map(async (box) => {
                        if (box.data.backgroundImageFile) {
                            box.data.backgroundImage = box.data.backgroundImageFile.name;
                            await this.uploadFiles({
                                path: "/pages/page-" + params.id + "/box-" + box.id,
                                files: [{
                                    name: `background.${this.help.fileExtension(box.data.backgroundImageFile.name)}`,
                                    file: box.data.backgroundImageFile
                                }]
                            })
                        } /*else if (box.data.backgroundImage && box.data.backgroundImage.indexOf('__delete__') === 0) {
                        //not working anymore//TODO implement delete button for box background image
                            await this.sendMessage({
                                module: 'system',
                                api: 'bucket',
                                act: 'rm',
                                payload: {
                                    path: `/pages/page-${params.id}/box-${box.id}/`,
                                    selection: [box.data.backgroundImage.replace('__delete__', '')]
                                }
                            });
                        }*/

                        if (box.moduleOptions?.files && box.moduleOptions?.files.length) {
                            const fileList = [];
                            box.moduleOptions.files.forEach((fileData) => {
                                if(fileData.file) {
                                    fileList.push({file: fileData.file, name: fileData.name})
                                }
                            });

                            await this.uploadFiles({
                                path: "/pages/page-" + params.id + "/box-" + box.id + "/module",
                                files: fileList
                            });

                            box.moduleOptions.files.map((fileData) => {
                                return {
                                    name: fileData.name
                                }
                            });
                        }

                    }));

                    resolve(response);
                })()
            } catch (err) {
                resolve(null);
            }
        });
    }

    duplicate(params) {
        return new Promise((resolve) => {
            (async () => {
                const duplicateResponse = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'duplicate',
                    payload: {
                        id: params.id
                    }
                });
                console.log(duplicateResponse);
                resolve(true);
            })();
        });
    }

    uploadFiles(params) {
        var formData = new FormData();

        formData.append('path', params.path || "pages/page/");
        formData.append('replace', params.replace || true);
        formData.append('totalFiles', params.files.length);

        //always place the files at the end
        Array.from(params.files).forEach(fileData => {
            formData.append(fileData.name || fileData.file.name, fileData.file, fileData.name || fileData.file.name);
        });

        return axios.post("/bucket", formData, {
            onUploadProgress: evt => {
                if (evt.loaded === evt.total) {
                }
                params.progress && params.progress(evt)
            }
        });
    }

    addCategory(params) {
        return this.sendMessage({
            module: 'system',
            api: 'categories',
            act: 'add',
            payload: {
                title: params.title,
                description: params.description
            }
        });
    }

    render() {
        switch (this.props.location.pathObject[1]) {
            default:
                return <ViewPages control={this.control} {...this.props} />;
            case 'edit':
                return <ViewPagesEditor control={this.control} {...this.props} />;
            case 'add':
                return <ViewPagesEditor control={this.control} {...this.props} />;
            case 'preview':
                return <ViewPagesPreview control={this.control} {...this.props} />;
        }

    }

}

export default PagesController;

PagesController.propTypes = {
    services: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
};