import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {GotService} from "@t00nday/nestjs-got";
import FormData from "form-data";
import * as fs from "fs";
import path from "path";
import {Observable} from "rxjs";



@Injectable()
export class BucketService {

    constructor(private readonly gotService: GotService, @Inject('REDIS_SERVICE') private readonly protocolService) {
        //this.tests();
    }

    //TODO SERVER FROM BUCKET MICROSEVISE USING DOWNLOAD METHOD

   /* //exposed methods
    private methods: string[] = [
        "info",
        "chmod",
        "chown",
        "list",
        "upload",
        "read",
        "rename",
        "move",
        "copy",
        "rm",
        "mkdir",
        "recycle",
        "archive",
        "extract"
    ];

    private async tests() {
        try {

            const uploadObserver = this.upload({
                replace:"1",
                files: [{
                    name: 'nvidia_drivers.exe',
                    path: '/',
                    readStream: fs.createReadStream(path.join(__dirname, '..', '..', 'var', 'nvidia_drivers.exe'), {
                        autoClose: true,
                        highWaterMark: 128 * 1024
                    })
                }]
            });
            uploadObserver.subscribe((data) => {
                console.log(data);
            }, err => {
                console.log(err);
            }, () => {
                console.log('upload complete');
            })

        } catch (err) {
            console.log(err);
        }

    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("Frontend.bucketService." + data.act + " not found");
        }
        return null;
    }

    private upload(params) {
        return new Observable(subscriber => {
            /!*const form = new FormData();
            form.append("act", "uploadFiles");
            form.append("path", "/");
            form.append("replace", +params.replace || "0");
            if(params && params.files && params.files.length) {
                params.files.map(file => {
                    form.append(file.name, file.readStream);
                    return file;
                });
            }

            try {
                const bucketObserver = this.gotService.post(`${this.bucketHost}`, {
                    body: form,
                    responseType: 'json'
                });

                bucketObserver.subscribe((data) => {
                    subscriber.next(data.body);
                }, (err) => {
                    subscriber.error(err);
                }, () => {
                    subscriber.complete();
                });
            } catch (err) {
                console.log(err.message);
            }*!/


        });

    }

    private remove(params) {//includes (empty) directories, files, recursive
        return new Observable(subscriber => {
            this.protocolService.sendMessage();
            subscriber.next('hi')
        });
    }

    private copy(params) {

    }

    private move(params) {

    }

    private mkdir(params){

    }*/


}