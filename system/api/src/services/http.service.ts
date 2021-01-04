import {Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";
import * as mime from "mime";
import {Observable} from "rxjs";

@Injectable()
export class HttpService {

    private methods = ["get"];

    constructor() {
    }

    public get(data: any) {
        return new Observable((observer) => {
            const params = data.params;
            let file_name = 'index.html';

            if (data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1) {
                file_name = params[0];
            }

            try {
                const file_path = __dirname + '/../../public/' + file_name;
                const stats = fs.statSync(file_path);
                observer.next({type: 'meta', content_length: stats.size, content_type: mime.getType(file_name)});

                const readStream = fs.createReadStream(file_path,{ highWaterMark: 1024});

                readStream.on('data', function(chunk) {
                    observer.next(chunk);
                }).on('end', function() {
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