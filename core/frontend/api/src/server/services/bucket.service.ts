import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import mime, {lookup} from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";
import {
    GotService
} from "@t00nday/nestjs-got";

@Injectable()
export class BucketService {

    private methods = ["checkAccess", "getMeta", "info", "get", "list", "completePath", "upload", "download"];
    private publicPaths = ["/static", "/manifest.json"];//TODO GET THIS FROM A CONFIG
    private defaultPath = 'index.html';


    constructor(@Inject('ProtocolService') private protocolService, private gotService: GotService) {
    }

    private info(params: any, options: any) {
        return new Promise((resolve) => {
            try {
                const metaPayload: payloadInterface = {
                    channel: 'bucket',
                    api: 'fs',
                    act: 'info',
                    payload: {
                        path: path.join('/frontend/public/', params.path)
                    }
                };

                const resolve_info = (data, file_name) => {
                    const etagId = etag.default(Buffer.from(JSON.stringify(data)));
                    resolve({modified: data.mtimeMs, size: data.size, "etagId": etagId, file_name: file_name});
                }

                this.protocolService.sendMessage(metaPayload).subscribe((data) => {
                    if(data.content_type === '404' && options.defaultFileName){
                        metaPayload.payload.path = `/frontend/public/${options.defaultFileName}`;
                        this.protocolService.sendMessage(metaPayload).subscribe((data) => {
                            resolve_info(data, options.defaultFileName);
                        });
                    } else {
                        resolve_info(data, params.path);
                    }
                }, (err) => {
                    resolve(err);
                }, () => {

                });

            } catch (err) {
                console.log(err);
                resolve(err);
            }

        });
    }

    private upload(params: any, config){
        return new Observable(subscriber => {

            const handshake = params.perform({
                channel: config.config.channel,
                api: 'protocol',
                act: 'startHandshake',
                payload: {
                    channel: 'bucket',
                    indication: {
                        api: 'fs',
                        act: 'upload'
                    }
                }
            });

            handshake.theObserver.subscribe(data => {
                //console.log(data);
            }, err => {
                console.log(err);
            }, () => {
                console.log('upload complete');
            })

            handshake.thePromise.then(handshakeResponse => {
                params.initiator.subscribe(data => {
                    handshakeResponse.thePusher.next(data)
                }, err => {
                    console.log(err);
                    handshakeResponse.thePusher.error(err);
                    subscriber.error(err);
                }, () => {
                    console.log('Bucket.service: upload complete');
                    handshakeResponse.thePusher.complete();
                    subscriber.complete();
                });

                subscriber.next('.');
            });

        });
    }

    private checkPaths(data: any){
        const params = data.params;
        let file_name = '';

        if (data.params[0] && data.params[0].length) {
            file_name = params[0];
        }
        this.publicPaths.forEach((e, i) => {
            if(file_name.indexOf(e) === 0){
                return true;
            }
        });
        return false;
    }

    public checkAccess(data: any) {
        return new Promise((resolve) => {
            if(!this.checkPaths(data)){
                return resolve({
                    access: false,
                    status: HttpStatus.TEMPORARY_REDIRECT,
                    location: this.publicPaths[0]
                });
            }

            return resolve({
                access: true
            });
        });
    }

    private _getBucketMeta(params) {
        return new Promise((resolve) => {
            const path_parts = params.path.split('/');
            this.protocolService.sendMessage({
                channel: 'bucket',
                api: 'fs',
                act: 'info',
                payload: {
                    path: '/' + path_parts.slice(1).join('/')
                }
            }).subscribe(response => {
                try {
                    resolve({
                        type: 'object',
                        data: {
                            modified: response.data.mtime,
                            size: response.data.size,
                            "etagId": response.data.etagId,
                            file_name: params.path
                        }
                    });
                } catch (err) {
                    resolve({
                        type: 'error',
                        message: {
                            type: '404 not found',
                            path: params.path
                        }
                    })
                }

            }, err => {
                resolve(err);
            }, () => {

            })
        });
    }

    public getMeta(data: any) {
        if(this._isBucket({path: data.params[0]})){
            return this._getBucketMeta({
                path: data.params[0]
            });
        }
        return new Promise((resolve) => {

            const params = data.params;
            let file_name = '';

            if (data.params[0] && data.params[0].length) {
                file_name = params[0];
            }

            try {
                const file_path = __dirname + '/../../public/';
                if (!fs.existsSync(file_path + file_name)) {
                    file_name = this.defaultPath;
                }
                const stats = fs.statSync(file_path + file_name);
                const etagId = etag.default(Buffer.from(JSON.stringify(stats)));
                resolve({
                    type: 'object',
                    content_type: 'object',
                    data: {
                        modified: stats.mtimeMs,
                        size: stats.size,
                        "etagId": etagId,
                        file_name: file_name
                    }
                });
            } catch (err) {
                resolve(null)
                console.log(err);
            }

        });
    }

    private _getFromBucket(params: any) {
        const path_parts = params.path.split('/');
        this.protocolService.sendMessage({
            channel: 'bucket',
            api: 'fs',
            act: 'read',
            payload: {
                path: '/' + path_parts.slice(1).join('/')
            }
        }).subscribe(data => {
            params.observer.next(data);
        }, err => {
            params.observer.error(err);
        }, () => {
            params.observer.complete();
        })
    }

    private _isBucket(params) {
        const path_parts = params.path.split('/');
        return (path_parts[0] === 'files')
    }


    public get(data: any) {
        return new Observable((observer) => {
            const params = data.params;
            let complete_path = this.defaultPath;

            if (data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1) {
                complete_path = params[0];
                if(this._isBucket({path: complete_path})){
                    this._getFromBucket({
                        path: complete_path,
                        observer
                    });
                    return;
                }
            }

            try {
                let file_path = __dirname + '/../../public/' + complete_path;
                if (!fs.existsSync(file_path)) {
                    complete_path = this.defaultPath;
                    file_path = `${__dirname}/../../public/${complete_path}`;
                }

                const stats = fs.statSync(file_path);
                observer.next({type: 'meta', content_length: stats.size, content_type: mime.lookup(complete_path)});

                const readStream = fs.createReadStream(file_path, {highWaterMark: 52428800});

                readStream.on('data', function (chunk) {
                    console.log('Buffering - ' + complete_path);
                    observer.next(chunk);
                }).on('end', function () {
                    console.log('Done - ' + complete_path);
                    observer.complete();
                });
            } catch (err) {
                //TODO should return 404
                fs.readFile(`__dirname /../../public/${this.defaultPath}`, (err, buffer) => {
                    observer.next(buffer);
                    observer.complete();
                });
            }
        });
    }

    public list (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'bucket',
                api: 'fs',
                act: 'list',
                payload: {
                    path: params.path
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public completePath (params: any){
        return new Observable(subscriber => {
            const payload: payloadInterface = {
                channel: 'bucket',
                api: 'fs',
                act: 'completePath',
                payload: {
                    path: params.path
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public download (params: any){
        return new Observable(subscriber => {

            const payload: payloadInterface = {
                channel: 'bucket',
                api: 'fs',
                act: 'download',
                payload: {
                    path: path.join(params.source_path, params.src)
                }
            };
            this.protocolService.sendMessage(payload).subscribe(data => {
                subscriber.next(data);
            }, err => {
                subscriber.error(err);
            }, () => {
                subscriber.complete();
            });
        })
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Frontend.httpService." + data.act + " not found");
        }
        return null;
    }

}