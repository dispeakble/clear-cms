import {Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import * as fs from "fs";

@Injectable()
export class HttpService {

    private methods = ["get"];

    constructor() {
    }


    public get(data: any){
        return new Promise((resolve_get) => {
            //const query = data.query;
            const params = data.params;
            let file_name = 'index.html';

            if(data.params[0] && data.params[0].length && data.params[0].indexOf('.') > -1){
                file_name = params[0];
            }

            try {
                const file = fs.readFileSync(__dirname + '/../../public/' + file_name);
                resolve_get(file);
            } catch (err) {
                const file = fs.readFileSync(__dirname + '/../../public/index.html');
                resolve_get(file);
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