import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";
import {payloadInterface} from "../interfaces/payload.interface";
import path from "path";
import {
    GotService
} from "@t00nday/nestjs-got";

@Injectable()
export class BucketService {

    private methods = ["getMeta", "get", "chmod", "chown", "list", "uploadFiles","read", "rename", "move", "copy", "rm", "mkdir", "recycle", "archive", "extract"];
    private bucketUrl = process.env.bucket_server;


    constructor(@Inject('ProtocolService') private protocolService, private gotService: GotService) {
    }

    public getMeta(data: any) {
        return new Promise((resolve) => {

            const params = data.params;
            let file_name = '';

            if (data.params[0] && data.params[0].length) {
                file_name = params[0];
            }

            try {
                const file_path = __dirname + '/../../public/';
                if (!fs.existsSync(file_path + file_name)) {
                    file_name = 'index.html';
                }
                const stats = fs.statSync(file_path + file_name);
                const etagId = etag.default(Buffer.from(JSON.stringify(stats)));
                resolve({modified: stats.mtimeMs, size: stats.size, "etagId": etagId, file_name: file_name});
            } catch (err) {
                console.log(err);
            }

        });
    }

    public get(data: any) {//TODO change hard-coded paths
        return new Observable((observer) => {
            const params = data.params;
            let file_name = 'index.html';

            if (data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1) {
                file_name = params[0];
            }

            try {
                let file_path = path.join(__dirname, '..', '..', 'public', file_name);
                if (!fs.existsSync(file_path)) {
                    file_name = 'index.html';
                    file_path = path.join(__dirname, '..', '..', 'public', file_name);
                }

                if(file_name.split("/").find((val, index) => index === 0 && val === "bucket")){
                    this.getBucketBuffer({
                        file_path
                    }).subscribe((data) => {
                        console.log('Buffering - ' + file_name);
                        observer.next(data)
                    }, (err) => {
                        observer.error(err)
                    }, () => {
                        console.log('Done - ' + file_name);
                        observer.complete()
                    })
                    return;
                }

                const stats = fs.statSync(file_path);
                observer.next({type: 'meta', content_length: stats.size, content_type: mime.getType(file_name)});

                const readStream = fs.createReadStream(file_path, {highWaterMark: 52428800});

                readStream.on('data', function (chunk) {
                    console.log('Buffering - ' + file_name);
                    observer.next(chunk);
                }).on('end', function () {
                    console.log('Done - ' + file_name);
                    observer.complete();
                });
            } catch (err) {
                observer.next({content_type: '404'})
                fs.readFile(__dirname + '/../../public/index.html', (err, buffer) => {
                    observer.next(buffer);
                    observer.complete();
                });
            }
        });
    }

    private getBucketMeta(params: any, options: any) {
        return new Promise((resolve) => {
            try {
                const metaPayload: payloadInterface = {
                    channel: 'bucket',
                    api: 'fs',
                    act: 'info',
                    payload: {
                        path: path.join('/system/public/', params.path)
                    }
                };

                const resolve_info = (data, file_name) => {
                    const etagId = etag.default(Buffer.from(JSON.stringify(data)));
                    resolve({modified: data.mtimeMs, size: data.size, "etagId": etagId, file_name: file_name});
                }

                this.protocolService.sendMessage(metaPayload).subscribe((data) => {
                    if(data.content_type === '404' && options.defaultFileName){
                        metaPayload.payload.path = `/system/public/${options.defaultFileName}`;
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

    private getBucketBuffer(params: any) {
        return new Observable((observer) => {
            try {
                (async () => {
                    const stats = await this.getBucketMeta({path: params.path}, {defaultFileName: 'index.html'});
                    observer.next({type: 'meta', content_length: stats['size'], content_type: mime.getType(stats['file_name']), file_name: stats['file_name']});

                    this.gotService.get(`${this.bucketUrl}/${params.path}`, {}).subscribe((data) => {
                        observer.next({type: 'Buffer', data});
                    }, (err) => {
                        observer.error(err);
                        observer.complete();
                    }, () => {
                        observer.complete();
                    });
                })();
            } catch (err) {
                observer.error(err);
                observer.complete();
            }
        });
    }

    private initUpload(data: any){
        return new Observable(subscriber => {
            //console.log(data);

            if(data){

            }




            subscriber.next('blah')
        });
    }

    private uploadFiles(data: any){
        return new Observable(subscriber => {

            console.log(data);

            switch (data.type) {
                case "init":
                    //TODO make a handshake with the bucket service

                    subscriber.next('done')
                    break;
                case "data":
                    break;
            }





        });
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("System.httpService." + data.act + " not found");
        }
        return null;
    }

}