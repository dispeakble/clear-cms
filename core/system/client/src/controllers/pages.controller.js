import React, {Component} from "react";
import * as shortId from "shortid";
import PropTypes from "prop-types";
import ViewPages from "../templates/ViewPages/ViewPages";
import ViewPagesEditor from "../templates/ViewPages/ViewPagesEditor";
import axios from "axios";
import _ from "lodash";

class PagesController extends Component {

    messageCallbacks = {};
    control = {
        list: (params) => this.list(params),
        get: (params) => this.get(params),
        add: (params) => this.add(params),
        edit: (params) => this.edit(params),
        remove: (params) => this.remove(params),
        uploadImages: (params) => this.uploadImages(params),
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

    get(params){
        return new Promise(async resolve => {
            try {
                const downloadParams = {
                    module: 'system',
                    api: 'bucket',
                    act: 'download',
                }
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'get',
                    payload: params
                });
                console.log({...response})
                const editPage = _.cloneDeep(response)
                const file = await this.sendMessage({
                    ...downloadParams,
                    payload: {
                        src: response.pageConfig.backgroundImage,
                        source_path: '/pages/page-'+response.id+'/'
                    }
                });
                response.pageConfig.backgroundImage = file && "data:"+file.mimeType+";base64," +file.file
                await Promise.all(response.items.map(async (item, i) => {
                    if(item.backgroundImage){
                        const file = await this.sendMessage({
                            ...downloadParams,
                            payload: {
                                src: item.backgroundImage,
                                source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                            }
                        });
                        response.items[i].backgroundImage = file &&  "data:"+file.mimeType+";base64," +file.file
                    }

                    if(item.module === "Header Module"  ){
                        if(item.moduleOptions.data.bg){
                            const file = await this.sendMessage({
                                ...downloadParams,
                                payload: {
                                    src: item.moduleOptions.data.bg,
                                    source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                                }
                            });
                            editPage.items[i] = {...editPage.items[i], module: item.module, modulePath1: '/pages/page-'+response.id+'/box-'+item.i+'/'+item.moduleOptions.data.bg}
                            response.items[i].moduleOptions.data.bg = file && "data:"+file.mimeType+";base64," +file.file
                        }
                        if(item.moduleOptions.data.logoImage){
                            const file = await this.sendMessage({
                                ...downloadParams,
                                payload: {
                                    src: item.moduleOptions.data.logoImage,
                                    source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                                }
                            });
                            editPage.items[i] = {...editPage.items[i], module: item.module, modulePath2: '/pages/page-'+response.id+'/box-'+item.i+'/'+item.moduleOptions.data.logoImage}
                            response.items[i].moduleOptions.data.logoImage = file && "data:"+file.mimeType+";base64," +file.file
                        }
                    } else if(item.module === "Banner Module" && item.moduleOptions.data?.backgroundImageFile) {
                        const file = await this.sendMessage({
                           ...downloadParams,
                            payload: {
                                src: item.moduleOptions.data.backgroundImage,
                                source_path: '/pages/page-'+response.id+'/box-'+item.i+'/'
                            }
                        });
                        response.items[i].moduleOptions.data.backgroundImage = file && "data:"+file.mimeType+";base64," +file.file
                    }
                }))
                response.editPage = editPage
                resolve(response)
            } catch (err) {
                resolve(null);
            }
        });
    }

    add(params){
        return new Promise(async resolve => {
            try {

                params.pageConfig.backgroundImage = params.pageConfig.backgroundImageFile && params.pageConfig.backgroundImageFile.name
                params.items.forEach((item, i) => {
                    params.items[i].backgroundImage = item.backgroundImageFile && item.backgroundImageFile.name
                    if(item.module === "Header Module"  ){
                        if(item.moduleOptions.data.file){
                            params.items[i].moduleOptions.data.bg = item.moduleOptions.data.file && "/header/"+item.moduleOptions.data.file.name
                        }
                        if( item.moduleOptions.data.logoImageFile){
                            params.items[i].moduleOptions.data.logoImage = item.moduleOptions.data.logoImageFile && "/header/"+item.moduleOptions.data.logoImageFile.name
                        }
                    } else if(item.module === "Banner Module" && item.moduleOptions.data?.backgroundImageFile) {
                        params.items[i].moduleOptions.data.backgroundImage = item.moduleOptions.data.backgroundImageFile && "/banner/"+item.moduleOptions.data.backgroundImageFile.name
                    }
                })
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'add',
                    payload: _.cloneDeep(params)
                });
                console.log(response)
                // uploading images (response should have page + boxes ID)
                if(params.pageConfig.backgroundImageFile){
                    await this.uploadImages({
                        path: "/pages/page-" + response.pageId + "/",
                        files: [params.pageConfig.backgroundImageFile]
                    })
                }

                await Promise.all(params.items.map(async (item, i) => {
                    if(item.backgroundImageFile){
                        await this.uploadImages({
                            path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/",
                            files: [item.backgroundImageFile]
                        })
                    }

                    if(item.module === "Header Module" && (item.moduleOptions.data.file || item.moduleOptions.data.logoImageFile)){
                        const images = [];
                        if(item.moduleOptions.data.file){
                            images.push(item.moduleOptions.data.file)
                        }
                        if(item.moduleOptions.data.logoImageFile){
                            images.push(item.moduleOptions.data.logoImageFile)
                        }
                        await this.uploadImages({
                            path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/header/",
                            files: images
                        })
                    } else if(item.module === "Banner Module" && item.moduleOptions.data.backgroundImageFile) {
                        await this.uploadImages({
                            path: "/pages/page-" + response.pageId + "/box-" + response.items[i] + "/banner/",
                            files: [item.backgroundImageFile]
                        })
                    }
                }))
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
                let deletePaths = []
                if(params.pageConfig.backgroundImage){
                    if(params.pageConfig.backgroundImageFile) {
                        params.pageConfig.backgroundImage = params.pageConfig.backgroundImageFile.name
                        await this.uploadImages({
                            path: "/pages/page-" + params.id + "/",
                            files: [params.pageConfig.backgroundImageFile]
                        })
                        deletePaths.push(params.editPage.pageConfig.backgroundImage)
                    } else {
                        params.pageConfig.backgroundImage = params.editPage.pageConfig.backgroundImage
                    }
                } else {
                    if(params.editPage.pageConfig.backgroundImage){
                        deletePaths.push(params.editPage.pageConfig.backgroundImage)
                    }
                }
                let allIds = params.editPage.items.map(item => item.i)
                await Promise.all(params.items.map(async (item, i) => {
                    if(!item.toBeSave){
                        allIds = allIds.filter(el => el != item.i)
                        if (item.backgroundImage ) {
                            if (item.backgroundImageFile) {
                                params.items[i].backgroundImage =  item.backgroundImageFile.name
                                await this.uploadImages({
                                    path: "/pages/page-" + params.id + "/box-" + item.i,
                                    files: [item.backgroundImageFile]
                                })
                                deletePaths.push('/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i)?.backgroundImage)
                            } else {
                                params.items[i].backgroundImage = params.editPage.items.find(el => el.i === item.i).backgroundImage
                            }
                        }
                        if(!item.backgroundImage && params.editPage.items.find(el => el.i === item.i)?.backgroundImage){
                            deletePaths.push('/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i)?.backgroundImage)
                        }
                        if (item.module === "Header Module" ) {
                            if (item.moduleOptions.data?.bg) {
                                if (item.moduleOptions.data?.file) {
                                    params.items[i].moduleOptions.data.bg = '/header/' + item.moduleOptions.data.file.name
                                    await this.uploadImages({
                                        path: "/pages/page-" + params.id + "/box-" + item.i + "/header/",
                                        files: [item.moduleOptions.data.file]
                                    })
                                    deletePaths.push( '/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i).moduleOptions.data.bg)
                                } else {
                                    params.items[i].moduleOptions.data.bg = params.editPage.items.find(el => el.i === item.i).moduleOptions.data.bg
                                }
                            }
                            if(!item.moduleOptions.data?.bg && params.editPage.items.find(el => el.i === item.i).moduleOptions.data.bg){
                                deletePaths.push( '/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i).moduleOptions.data.bg)
                            }
                            if (item.moduleOptions.data?.logoImage) {
                                if (item.moduleOptions.data?.logoImageFile) {
                                    params.items[i].moduleOptions.data.logoImage = '/header/' + item.moduleOptions.data.logoImageFile.name
                                    await this.uploadImages({
                                        path: "/pages/page-" + params.id + "/box-" + item.i + "/header/",
                                        files: [item.moduleOptions.data.logoImageFile]
                                    })
                                    deletePaths.push('/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i).moduleOptions.data.logoImage)
                                } else {
                                    params.items[i].moduleOptions.data.logoImage = params.editPage.items.find(el => el.i === item.i).moduleOptions.data.logoImage
                                }
                            }
                            if(!item.moduleOptions.data?.logoImage && params.editPage.items.find(el => el.i === item.i).moduleOptions.data.logoImage){
                                deletePaths.push('/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i).moduleOptions.data.logoImage)
                            }
                        }
                        if(item.module === "Banner Module") {
                            if(item.moduleOptions.data?.backgroundImage){
                                if(item.moduleOptions.data?.backgroundImageFile){
                                    params.items[i].moduleOptions.data.backgroundImage =  '/banner/' + item.moduleOptions.data.backgroundImageFile.name
                                    await this.uploadImages({
                                        path: "/pages/page-" + params.id + "/box-" + item.i + "/banner/",
                                        files: [item.moduleOptions.data.backgroundImageFile]
                                    })
                                    deletePaths.push('/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i).moduleOptions.data.backgroundImage)
                                } else {
                                    params.items[i].moduleOptions.data.backgroundImage = params.editPage.items.find(el => el.i === item.i).moduleOptions.data.backgroundImage
                                }
                            }
                            if(!item.moduleOptions.data?.backgroundImage && params.editPage.items.find(el => el.i === item.i).moduleOptions.data.backgroundImage){
                                deletePaths.push('/box-' + item.i + '/' + params.editPage.items.find(el => el.i === item.i).moduleOptions.data.backgroundImage)
                            }
                        }
                    }else {
                        if (item.backgroundImage && item.backgroundImageFile) {
                             params.items[i].backgroundImage =  item.backgroundImageFile.name
                        }
                        if (item.module === "Header Module" ) {
                            if (item.moduleOptions.data?.bg && item.moduleOptions.data?.file) {
                               params.items[i].moduleOptions.data.bg = '/header/' + item.moduleOptions.data.file.name
                            }

                            if (item.moduleOptions.data?.logoImage && item.moduleOptions.data?.logoImageFile) {
                                params.items[i].moduleOptions.data.logoImage = '/header/' + item.moduleOptions.data.logoImageFile.name
                            }
                        }
                        if(item.module === "Banner Module") {
                            if(item.moduleOptions.data?.backgroundImage && item.moduleOptions.data?.backgroundImageFile){
                              params.items[i].moduleOptions.data.backgroundImage =  '/banner/' + item.moduleOptions.data.backgroundImageFile.name
                            }
                        }
                    }

                }))
                allIds.forEach(id => deletePaths.push("box-"+id))
                await this.delete({path:'/pages/page-' + params.id, selection: deletePaths})

                console.log("before edit 2")
                const response = await this.sendMessage({
                    module: 'system',
                    api: 'pages',
                    act: 'edit',
                    payload: _.cloneDeep(params)
                });
                let counter = -1
                await Promise.all(params.items.map(async (item, i) => {
                    if(item.toBeSave){
                        counter++
                        if(item.backgroundImageFile){
                            await this.uploadImages({
                                path: "/pages/page-" + params.id + "/box-" + response.items[counter] + "/",
                                files: [item.backgroundImageFile]
                            })
                        }

                        if(item.module === "Header Module" && (item.moduleOptions.data.file || item.moduleOptions.data.logoImageFile)){
                            const images = [];
                            if(item.moduleOptions.data.file){
                                images.push(item.moduleOptions.data.file)
                            }
                            if(item.moduleOptions.data.logoImageFile){
                                images.push(item.moduleOptions.data.logoImageFile)
                            }
                            await this.uploadImages({
                                path: "/pages/page-" + params.id+ "/box-" + response.items[counter] + "/header/",
                                files: images
                            })
                        } else if(item.module === "Banner Module" && item.moduleOptions.data.backgroundImageFile) {
                            await this.uploadImages({
                                path: "/pages/page-" + params.id + "/box-" + response.items[counter] + "/banner/",
                                files: [item.backgroundImageFile]
                            })
                        }

                    }

                }))

                resolve(response)
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


    uploadImages(params) {
        return new Promise(resolve => {
            var formData = new FormData();

            formData.append('path', params.path || "pages/page/");
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
                    // params.progress(evt)
                }
            });
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