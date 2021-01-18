import {HttpStatus, Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";
import * as etag from "etag";

@Injectable()
export class HttpService {

    private methods = ["get", "getMeta", "checkAccess"];
    private publicPaths = ["/view-auth", "/static", "/manifest.json"];//TODO GET THIS FROM A CONFIG

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

    public get(data: any) {
        return new Observable((observer) => {
            const params = data.params;
            let file_name = 'index.html';

            if (data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1) {
                file_name = params[0];
            }

            try {
                let file_path = __dirname + '/../../public/' + file_name;
                if (!fs.existsSync(file_path)) {
                    file_name = 'index.html';
                    file_path = __dirname + '/../../public/index.html';
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
                fs.readFile(__dirname + '/../../public/index.html', (err, buffer) => {
                    observer.next(buffer);
                    observer.complete();
                });
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