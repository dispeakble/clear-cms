import {Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import path from "path";
import * as fs from "fs";

@Injectable()
export class HelpService {

    private methods = ["registerModule"];

    private config = {
        mainPath: path.join(__dirname, '..', '..', '..', '/var')
    }

    private help = {
        path: {
            sanitize: (params) => params.path.replace(/(\.\.(\/|\\))+/g, ''),
            realPath: (reqPath) => path.join(this.config.mainPath, this.help.path.sanitize({path: reqPath.path}))
        }, is: {
            empty: (params) => {
                switch (Object.prototype.toString.call(params)) {
                    default:
                        return undefined;
                        break;
                    case '[object Undefined]':
                        return true;
                        break;
                    case '[object Null]':
                        return true;
                        break;
                    case '[object Boolean]':
                        return !params;
                        break;
                    case '[object Array]':
                        return params.length === 0;
                        break;
                    case '[object Object]':
                        return Object.keys(params).length === 0 && params.constructor === Object;
                        break;
                }

            },
            object: (params) => params instanceof Object,
            array: (params) => params instanceof Array,
            string: (params) => params instanceof String,
            number: (params) => params instanceof Number,
            boolean: (params) => params instanceof Boolean,
            dir: (params) => {
                try {
                    return this.help.is.readable({path: params.path}) && fs.statSync(params.path).isDirectory();
                } catch (err) {
                    return false;
                }
            },
            readable: (params) => {
                let fd;
                try {
                    fd = fs.openSync(params.path, 'r');
                    return true;
                } catch (err) {
                    return false;
                } finally {
                    if (fd !== undefined) {
                        fs.closeSync(fd);
                    }
                }
            },
            writeable: (params) => {
                let fd;
                try {
                    fd = fs.openSync(params.path, 'wx');
                    return true;
                } catch (err) {
                    return err.code === 'EEXIST';
                } finally {
                    if (fd !== undefined) {
                        fs.closeSync(fd);
                    }
                }
            }
        }, not: {
            empty: (params) => !this.help.is.empty(params),
            object: (params) => !this.help.is.object(params),
            array: (params) => !this.help.is.array(params),
            string: (params) => !this.help.is.string(params),
            number: (params) => !this.help.is.number(params),
            boolean: (params) => !this.help.is.boolean(params),
            dir: (params) => !this.help.is.dir(params),
            readable: (params) => !this.help.is.readable(params),
            writeable: (params) => !this.help.is.writeable(params)
        },
        utils: {
            UID: (len) => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len),
            test: () => true
        },
        isZip:(pathToCheck = "") => {
            let res = false
            pathToCheck.split('/').forEach((item,index) => {
                if(item && path.extname(item) === ".zip"){
                    res = true
                }
            })
            return res
        },
        zipPathParse:(pathToParse = "") => {
            let zipPath = [];
            let insideZipPath = [];
            let zip = false;
            pathToParse.split('/').forEach(item => {
                if(zip){
                    insideZipPath.push(item)
                } else {
                    zipPath.push(item)
                }
                if(this.help.isZip(item) && !zip){
                    zip = true
                }
            })
            return {
                zipPath: zipPath.join('/'),
                insideZipPath: insideZipPath.join('/')
            }
        }

    }

    constructor() {
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this.help[data.act](data.payload, config);
        } else {
            console.log("Bucket.helpService." + data.act + " not found");
        }
        return null;
    }

}
