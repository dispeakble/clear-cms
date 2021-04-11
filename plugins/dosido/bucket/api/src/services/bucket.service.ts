import {Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import * as path from 'path';
import * as fs from "fs";
import {Observable} from "rxjs";
import * as mime from "mime";

const fsp = fs.promises;

@Injectable()
export class BucketService {

    private config = {
        mainPath: path.join(__dirname, '..', '..', '..', '/var')
    }

    private methods = ["list", "write", "recycle", "permissions", "copy", "add", "move", "rename", "delete", "info", "get"];
    private help = {
        path: {
            sanitize: (params) => params.path.replace(/(\.\.(\/|\\))+/g, ''),
            realPath: (reqPath)=>path.join(this.config.mainPath, this.help.path.sanitize({path: reqPath.path}))
        },
        is: {
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
                } catch (err){
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
                    if (fd !== undefined){
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
                    if (fd !== undefined){
                        fs.closeSync(fd);
                    }
                }
            }
        },
        not: {
            empty: (params) => !this.help.is.empty(params),
            object: (params) => !this.help.is.object(params),
            array: (params) => !this.help.is.array(params),
            string: (params) => !this.help.is.string(params),
            number: (params) => !this.help.is.number(params),
            boolean: (params) => !this.help.is.boolean(params),
            dir: (params) => !this.help.is.dir(params),
            readable: (params) => !this.help.is.readable(params),
            writeable: (params) => !this.help.is.writeable(params)
        }

    }

    constructor() {
        setTimeout(() => {
            /*const obs = this.perform({
                act: 'delete',
                payload: {
                    path: '../../../deltest'
                }
            });
            obs.subscribe((response) => {
                console.log(response)
            }, (error) => {
                console.log(error);
            }, () => {

            });*/
            /*const obs = this.perform({
                act: 'list',
                payload:{
                    path:'.'
                }
            });*/
            /*obs.subscribe((response)=>{
                if(response.data && response.data.length){
                    let testBuf = {};
                    response.data.forEach(el => {
                        if (el.isDirectory()) {
                            console.log(el);
                        } else if (el.isFile()) {
                            testBuf[el.name] = Buffer.from([]);
                            this.get({path: el.name}).subscribe((fileData) => {
                                if (Buffer.isBuffer(fileData)) {
                                    testBuf[el.name] = Buffer.concat([testBuf[el.name], fileData]);
                                } else {
                                    console.log(fileData)
                                }

                            }, (data) => {

                            }, () => {
                                if (Buffer.isBuffer(testBuf[el.name])) {
                                    //console.log(Buffer.from(testBuf[el.name]).toString('utf-8'))
                                }
                            })
                        }
                    });
                }
            })*/
            /*const obs = this.perform({
                act: 'list',
                payload:{
                    path:'.'
                }
            });

            obs.subscribe((response)=>{

                if(response.data && response.data.length){

                    console.log(response.data)
                }
            })*/


            const readableStream = fs.createReadStream(this.help.path.realPath({path: 'ubuntu-20.04-desktop-amd64.iso'}));

            readableStream.on('close', (data) => {
                console.log('closed', data)
            })

            const obs = this.perform({
                act: 'add',
                payload: {
                    path: '.',
                    name:'ubuntu-20.04-copy.iso',
                    readableStream: readableStream
                }
            });

            let status = 'started';

            obs.subscribe((response) => {
                if(response.data && response.data.length){
                    console.log(response.data);
                }
                status = `still in progress??????`;
            }, (err) => {
                console.log(`ERROR: ${err}`);
                status = 'with catastrophic Exception';
            }, () => {
                console.log(`file transfer finished ${status}`)
            })
        }, 0);
    }

    list(params) {
        return new Observable((observer) => {

            const realPath = this.help.path.realPath(params.path);

            if(this.help.not.dir({path: realPath}) || this.help.not.writeable({path: realPath})){
                observer.next({type: 'error', data: null, message: 'cannot read directory'});
                observer.complete();
                return;
            }

            try {
                (async () => {
                    const entries = fs.readdirSync(realPath, {withFileTypes: true});
                    let response = [];
                    if(entries && entries.length){
                        entries.forEach((el) => {
                            let stats = fs.statSync(path.join(realPath, el.name));
                            let entity = {
                                dir: el.isDirectory(),
                                file: el.isFile(),
                                symlink: el.isSymbolicLink(),
                                name: el.name,
                                stats: {
                                    size: stats.size,
                                    atime: stats.atime,
                                    mtime:stats.mtime,
                                    ctime:stats.ctime,
                                    birthtime:stats.birthtime
                                }
                            };
                            response.push(entity);
                        })
                    }
                    observer.next({type: 'file_list', data: response});
                    observer.complete();
                })();

            } catch (err) {
                observer.next({type: 'error', data: null, message: 'cannot read directory'});
                observer.complete();
            }
        });
    }

    write(params) {
        //todo file
    }

    recycle(params) {
        //todo dir or file
    }

    permissions(params) {
        //todo dir or file
    }

    copy(params) {
        //todo dir or file
    }

    add(params) {
        return new Observable((observer) => {
            const dir = this.help.path.realPath({ path: params.path });
            const file = params.name;
            const realDestPath = path.join(dir, file);
            let message = "";
            try {
                if(!(params.readableStream instanceof fs.ReadStream)){
                    throw new Error(`params.readableStream ! instanceof 'ReadStream'`)
                }
                if(this.help.not.readable({path: realDestPath})){
                    if (this.help.is.writeable({path: realDestPath})) {
                        fs.open(realDestPath, 'w', (err, fd) => {
                            if (err) {
                                message = JSON.stringify(err);
                                fs.close(fd, (err) => {
                                    if (err) throw err;
                                });
                                throw new Error(JSON.stringify(err));
                            }

                            fs.fstat(fd, (err, stat) => {
                                if (err) throw err;
                                // use stat

                                console.log('will add file')
                                const destWriteStream = fs.createWriteStream(realDestPath, {fd:fd, autoClose: true, highWaterMark: 50 * 1024});

                                let streamingFlag = false;

                                let myIntId = setInterval(() => {
                                    if(!streamingFlag){
                                        fs.close(fd, (err) => {
                                            if (err) throw err;
                                        });
                                        clearInterval(myIntId);
                                    }
                                    streamingFlag = false;
                                }, 1000);

                                params.readableStream.on('error', () => {
                                    fs.unlink(realDestPath, () => {
                                        fs.close(fd, (err) => {
                                            if (err) throw err;
                                        });
                                    });
                                })
                                params.readableStream.on('data', (evt) => {
                                    streamingFlag = true;
                                    destWriteStream.write(evt, (err) => {
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                });

                                params.readableStream.on('close', () => {

                                });
                            });
                        });
                    } else {
                        message = `cannot add ${file} because the destination path needs write permissions`;
                        throw new Error();
                    }
                } else {
                    message = `cannot add ${file} because the destination path already exists`;
                    throw new Error();
                }

            } catch (err) {
                observer.error(message);
                observer.next({type: 'error', message: message});
                observer.complete();
            }

        })
    }

    move(params) {
        return new Observable((observer) => {
            const source_name = this.help.path.sanitize({path: params.source_path});
            const file = path.parse(source_name).base;

            const realSourcePath = this.help.path.realPath(params.source_path);
            const realDestPath = this.help.path.realPath(params.dest_path);

            if (this.help.is.readable({path: realSourcePath}) && this.help.is.writeable({path: realSourcePath})){
                //file source is readable and writeable. continue
                if (this.help.is.readable({path: realDestPath}) && this.help.is.writeable({path: realDestPath})){
                    //dest directory writeable. continue
                    const dest_complete_path = path.join(realDestPath, file);
                    if (this.help.not.readable({path: dest_complete_path}) && this.help.not.writeable({path: dest_complete_path})){
                        //dest does not exits. continue
                        fs.renameSync(realSourcePath, dest_complete_path);
                        observer.next({type:'success', data: dest_complete_path})
                    } else {
                        observer.next({type:'error', data: null, message: `${realDestPath} already exists`})
                    }

                } else {
                    observer.next({type:'error', data: null, message: `cannot rename ${realSourcePath} to ${realDestPath}. destination path unreachable`})
                }
            } else {
                observer.next({type:'error', data: null, message: `cannot rename ${realSourcePath} to ${realDestPath}. source path unreachable`})
            }

            observer.complete();

        })
    }

    rename(params) {
        return new Observable((observer) => {

            const realSourcePath = this.help.path.realPath(params.source_path);
            const realDestPath = this.help.path.realPath(params.dest_path);

            if (this.help.is.readable({path: realSourcePath}) && this.help.is.writeable({path: realSourcePath})){
                //file source is readable and writeable. continue
                if (this.help.not.readable({path: realDestPath}) && this.help.not.writeable({path: realDestPath})){
                    //file destination name/path doesn't exist. continue
                    fs.renameSync(realSourcePath, realDestPath);
                    observer.next({type:'success', data: realDestPath})
                } else {
                    observer.next({type:'error', data: null, message: `cannot rename ${realSourcePath} to ${realDestPath}`})
                }
            } else {
                observer.next({type:'error', data: null, message: `cannot find ${realSourcePath}`})
            }

            observer.complete();

        })
    }

    delete(params) {
        return new Observable((observer) => {
            try {
                const realPath = this.help.path.realPath(params.path);

                const removeRecursively = (rem_path) => {
                    if (this.help.is.readable({path: rem_path}) && this.help.is.writeable({path: rem_path})) {
                        if(this.help.is.dir({path: rem_path})) {
                            const entities = fs.readdirSync(rem_path);
                            if(entities && entities.length){
                                for(const entity of entities) {
                                    removeRecursively(path.join(rem_path, entity));
                                }
                            }
                            fs.rmdirSync(rem_path);
                        } else {
                            fs.unlinkSync(rem_path);
                        }
                    } else {
                        observer.next({type: 'error', data: null, message: `${rem_path} not writeable`});
                    }
                }

                removeRecursively(realPath);
                observer.complete();
            } catch (err) {
                console.log(err);
                observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                observer.complete();
            }
        })
    }

    info(params) {
        return new Observable((observer) => {
            const realPath = this.help.path.realPath(params.path);
            try {
                if (this.help.not.writeable({path: realPath})) {
                    observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                    observer.complete();
                    return;
                }
                (async () => {
                    const stats = await fsp.stat(realPath);
                    observer.next({type: 'object', content_type: "object", data: {
                        size: stats.size,
                        atime: stats.atime,
                        mtime: stats.mtime,
                        ctime: stats.ctime,
                        birthtime: stats.birthtime
                    }});
                    observer.complete();
                })()
            } catch (err) {
                console.log(err);
                observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                observer.complete();
            }
        })
    }

    get(params) {
        return new Observable((observer) => {
            const file_name = params.path;
            const realPath = this.help.path.realPath(params.path);

            try {
                if (this.help.not.readable({path: realPath})) {
                    observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                    observer.complete();
                    return;
                }

                (async () => {
                    let stats;
                    try {
                        stats = await fsp.stat(realPath);
                    } catch (error) {
                        console.log(error);
                    }

                    observer.next({type: 'meta', content_length: stats.size, content_type: mime.getType(realPath)});

                    const readStream = fs.createReadStream(realPath);

                    readStream.on('data', function (chunk) {
                        console.log('Buffering - ' + file_name);
                        observer.next(chunk);
                    }).on('end', function () {
                        console.log('Done - ' + file_name);
                        observer.complete();
                    });
                })();

            } catch (err) {
                console.log(err);
                observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                observer.complete();
            }
        });
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("bucket.appService." + data.act + " not found");
        }
        return null;
    }

}
