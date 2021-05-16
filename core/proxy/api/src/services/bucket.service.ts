import {Inject, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {GotService} from "@t00nday/nestjs-got";
import FormData from "form-data";
import * as fs from "fs";
import path from "path";


@Injectable()
export class BucketService {

    private bucketHost = process.env.bucket_server;

    constructor(private readonly gotService: GotService) {
        this.tests();
    }

    //exposed methods
    private methods = [];

    private async tests(){
        try {
            this.upload({
                files: [/*{
                    name: 'test1.txt',
                    path: '/',
                    readStream: fs.createReadStream(path.join(__dirname, '..', '..', 'var', 'test.txt'), {
                        autoClose: true,
                        highWaterMark: 52428800
                    })
                }, {
                    name: 'test2.txt',
                    path: '/',
                    readStream: fs.createReadStream(path.join(__dirname, '..', '..', 'var', 'test.txt'), {
                        autoClose: true,
                        highWaterMark: 52428800
                    })
                }, */{
                    name: 'test3.txt',
                    path: '/',
                    readStream: fs.createReadStream(path.join(__dirname, '..', '..', 'var', 'test.txt'), {
                        autoClose: true,
                        highWaterMark: 52428800
                    })
                }]
            })

        } catch (err) {
            console.log(err);
        }

    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("BucketService.protocolService." + data.act + " not found");
        }
        return null;
    }

    private start() {

    }

    private upload(params) {
        const form = new FormData();
        form.append("act", "uploadFiles");
        form.append("path", "/");
        form.append("replace", "1");
        if(params && params.files && params.files.length){
            params.files.map(file => {
                form.append(file.name, file.readStream);
                return file;
            });
        }
        this.gotService.post(`${this.bucketHost}`, {
            body: form
        });
    }

    private remove(params) {

    }

    private copy(params) {

    }

    private move(params) {

    }

    private mkdir(params){

    }

}