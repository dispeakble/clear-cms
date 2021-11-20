import {Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import * as path from 'path';
import * as fs from "fs";
import {v4 as uuid} from "uuid";
import {Observable, Subscriber} from "rxjs";
import * as mime from "mime";
import * as AdmZip from "adm-zip";
import { Readable } from 'stream';
import * as etag from "etag";
const { randomUUID } = require('crypto');
const fsp = fs.promises;

@Injectable()
export class FsService {

    private methods = ["info", "chmod", "chown", "list", "completePath", "upload", "read", "rename", "move", "download", "copy", "rm", "mkdir", "recycle", "archive", "extract"];

    private help: any;

    constructor(@Inject('HelpService') private helpService) {
        this.help = helpService.help;
    }

    info(params) {
        return new Observable((observer) => {
            const realPath = this.help.path.realPath({path: params.path});
            try {
                if (this.help.not.writeable({path: realPath})) {
                    observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                    observer.complete();
                    return;
                }
                (async () => {
                    const stats = await fsp.stat(realPath);
                    const etagId = etag.default(Buffer.from(JSON.stringify(stats)));
                    observer.next({
                        type: 'object', content_type: "object", data: {
                            etagId: etagId,
                            size: stats.size,
                            atime: stats.atime,
                            mtime: stats.mtime,
                            ctime: stats.ctime,
                            birthtime: stats.birthtime
                        }
                    });
                    observer.complete();
                })()
            } catch (err) {
                console.log(err);
                observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                observer.complete();
            }
        })
    }

    chmod(params) {
        return new Observable((observer) => {
            try {
                const fd = fs.openSync(this.help.path.realPath({path: params.path}), 'r');
                fs.fchmodSync(fd, params.mode);
                observer.complete();
            } catch (err) {
                console.log(err);
                const msg = "Internal server error";
                observer.next({
                    type: 'error', content_length: msg.length, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    chown(params) {//may we never need you :)
        return new Observable((observer) => {
            try {
                const fd = fs.openSync(this.help.path.realPath({path: params.path}), 'r');
                fs.fchownSync(fd, params.uid, params.guid);
                observer.complete();
            } catch (err) {
                console.log(err);
                const msg = "Internal server error";
                observer.next({
                    type: 'error', content_length: msg.length, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    completePath(params) {
        //reading the path up a folder until the top level is reached
        return new Observable((observer) => {

            const realPath = this.help.path.realPath({path: params.path});
            const topPath = this.help.path.realPath({path: '/'});
            if(this.help.isZip(params.path)){

            } else if (this.help.not.dir({path: realPath}) || this.help.not.readable({path: realPath})) {
                observer.next({type: 'error', data: null, message: 'cannot read directory'});
                observer.complete();
                return;
            }

            let cpath = realPath;
            let entity = {};
            const paths = [];
            if(cpath !== topPath){
                while(cpath !== topPath){
                    entity = {
                        id: uuid(),
                        name: path.basename(cpath)
                    };
                    paths.push(entity);
                    cpath = path.join(cpath, '../');
                }
            }

            let topEntity = {
                id: uuid(),
                name: '/'
            };
            paths.push(topEntity);
            observer.next({type: 'folder_chain', data: paths.reverse()});
            observer.complete();

        });
    }

    list(params) {
        return new Observable((observer) => {

            let realPath = this.help.path.realPath({path: params.path});
            if(this.help.isZip(params.path)){

                if (realPath.charAt(realPath.length - 1) == '/') {
                    realPath = realPath.substr(0, realPath.length - 1);
                }

                const { zipPath, insideZipPath } = this.help.zipPathParse(realPath)
                const zip = new AdmZip.default(zipPath);
                let response = [];
                zip.getEntries().forEach(async function(entry, i) {
                    let entity = {
                        id: randomUUID(),
                        dir: entry.isDirectory,
                        file: !entry.isDirectory,
                        symlink: false,
                        name: entry.entryName,
                        stats: {
                            size: entry.header.size,
                            birthtime: entry.header.time
                        }
                    };
                    response.push(entity);
                });
                // if a nested folder is selected filter out everything else
                if(insideZipPath.length){
                    const p = insideZipPath + "/"
                    response = response.reduce((result, res) => {
                        if(p === res.name.substr(0, p.length) && (res.name !== p)){
                            let newName = res.name.substr(p.length, res.name.length)
                            result.push({...res, name: newName})
                        }
                        return result
                    }, [])
                }
                // filtering nested files
                response = response.filter(res => {
                    let p = res.name.split('/')
                    if(p.length > 1){
                        return !p[1]
                    }
                    return true
                })

                response = response.map(res => {
                    let newName = res.name;
                    if (res.name.charAt(res.name.length - 1) == '/') {
                        newName = res.name.substr(0, res.name.length - 1);
                    }
                    return {
                        ...res,
                        name: newName
                    }
                })
                observer.next({type: 'file_list', data: response});
                observer.complete();
                return;
            } else if (this.help.not.dir({path: realPath}) || this.help.not.readable({path: realPath})) {
                observer.next({type: 'error', data: null, message: 'cannot read directory'});
                observer.complete();
                return;
            }else {
                try {
                    const entries = fs.readdirSync(realPath, {withFileTypes: true});
                    let response = [];
                    if (entries && entries.length) {
                        entries.forEach((el) => {
                            let stats = fs.statSync(path.join(realPath, el.name));
                            let entity = {
                                id: (stats.dev + stats.ino),
                                dir: el.isDirectory(),
                                file: el.isFile(),
                                symlink: el.isSymbolicLink(),
                                name: el.name,
                                stats: {
                                    size: stats.size,
                                    atime: stats.atime,
                                    mtime: stats.mtime,
                                    ctime: stats.ctime,
                                    birthtime: stats.birthtime
                                }
                            };
                            response.push(entity);
                        })
                    }
                    observer.next({type: 'file_list', data: response});
                    observer.complete();

                } catch (err) {
                    observer.next({type: 'error', data: null, message: 'cannot read directory'});
                    observer.complete();
                }
            }


        });
    }

    upload(params) {return new Observable(subscriber => {
        //TODO get initial metadata
        const readable = new Readable()
        readable._read = () => {} // _read is required but you can noop it

        let uploadObs;

        let options: any = {};


        params.initiator.subscribe(data => {
            //first will be the meta data
            //create a write stream
            if(data && data.payload && data.payload.type){
                switch(data.payload.type) {
                    case 'meta':
                        uploadObs = this.writeFile({
                            name: data.payload.filename,
                            path: data.payload.path,
                            readable: readable,
                            replace: data.payload.replace || false
                        });
                        uploadObs.subscribe((data) => {
                            subscriber.next(data);
                        }, (err) => {
                            subscriber.error(err);
                        }, () => {
                            subscriber.complete();
                        });
                        break;
                    case 'data':
                        console.log(data.payload.index)
                        readable.push(Buffer.from(data.payload.buffer.data))
                        break;
                }


            }
           /* readable.push(data.buffer)
            readable.push(null)*/
        }, err => {
            readable.push(null);
            readable.emit("close");
        }, () => {
            readable.push(null);
            readable.emit("close");
        });

        /*if(params.files && params.files.length){
            let uploadPromises = [];
            let uploadObs = [];
            let resolve_upload;
            params.files.map(file => {
                const readable = new Readable()
                readable._read = () => {} // _read is required but you can noop it
                readable.push(file.buffer)
                readable.push(null)
                uploadObs[file.fieldname] = this.writeFile({
                    name: file.fieldname,
                    path: params.data.path,
                    readable: readable,
                    replace: +params.data.replace || false
                });
                uploadPromises.push(new Promise((resolve) => {
                    resolve_upload = resolve;
                }))
                uploadObs[file.fieldname].subscribe((data) => {

                }, (err) => {
                    resolve_upload(err);
                }, () => {
                    resolve_upload();
                });
            });
            Promise.all(uploadPromises).then((data: any[]) => {
                subscriber.next({message: 'upload complete', data: data});
            }).catch(err => {
                subscriber.error({message: err});
            }).finally(() => {
                subscriber.complete();
            })
        }*/
    })}

    private writeFile(params: any): Observable<any> {
        return new Observable((observer) => {
            const dir = this.help.path.realPath({path: params.path});
            const file = params.name;
            const realDestPath = path.join(dir, file);
            let message = "";
            try {
                if(this.help.not.dir({path: dir})){
                    fs.mkdirSync(dir, {recursive: true, mode: 0o777})
                }
                if (this.help.is.readable({path: realDestPath}) && !params.replace) {
                    throw new Error(`cannot upload ${file} because the destination path already exists. Use params.replace for overwrite`);
                }
                if (this.help.not.writeable({path: realDestPath})) {
                    throw new Error(`cannot upload ${file} because the destination path needs write permissions`);
                }

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

                        const destWriteStream = fs.createWriteStream(realDestPath, {
                            fd: fd, autoClose: true, highWaterMark: 50 * 1024
                        });

                        try {
                            params.readable.pipe(destWriteStream)

                            params.readable.on("error", (err) => {
                                fs.close(fd, (err) => {
                                    if (err) throw err;
                                });
                                observer.error(err);
                                observer.complete();
                            })

                            params.readable.on("data", () => {
                                observer.next('.');
                            })

                            params.readable.on("end", () => {
                                observer.complete();
                            })

                        } catch (err) {
                            console.log(err);
                            observer.error(err);
                        }
                    });
                });

            } catch (err) {
                observer.error(err.message);
                observer.next({type: 'error', message: err.message});
                observer.complete();
            }

        })
    }

    rename(params) {
        return new Observable((observer) => {

            const realSourcePath = this.help.path.realPath({path: params.source_path});
            const realDestPath = this.help.path.realPath({path: params.dest_path});

            if (this.help.is.readable({path: realSourcePath})) {
                //file source is readable and writeable. continue
                if (this.help.not.readable({path: realDestPath})) {
                    //file destination name/path doesn't exist. continue
                    fs.rename(realSourcePath, realDestPath, (err) => {
                        if(err){
                            observer.error({
                                type: 'error', data: null, message: `cannot rename ${params.source_path} to ${params.dest_path}`
                            });
                            return;
                        }
                        observer.next({type: 'success', data: realDestPath})
                    });

                } else {
                    observer.next({
                        type: 'error', data: null, message: `cannot rename ${params.source_path} to ${params.dest_path}`
                    })
                }
            } else {
                observer.next({type: 'error', data: null, message: `cannot find ${params.source_path}`})
            }

            observer.complete();

        })
    }

    download(params){
        return new Observable((observer) => {
           console.log("fs res", params)
            const source_name = this.help.path.sanitize({path: params.path});
            const file = path.parse(source_name).base;
            const realSourcePath = this.help.path.realPath({path: params.path});
            try {
                let mimeType = mime.getType(realSourcePath)
                let bs64 = fs.readFileSync(realSourcePath, {encoding: 'base64'})
                observer.next({
                    type: "success",
                    data: {
                        file: bs64,
                        fileName: file,
                        mimeType: mimeType,
                    }
                })
            } catch(e) {
                observer.next({
                    type: 'error',
                    data: null,
                    message: "Cannot read file"
                })
            }

            observer.complete()
        })
    }

    move(params) {
        return new Observable((observer) => {
            const source_name = this.help.path.sanitize({path: params.source_path});
            const file = path.parse(source_name).base;

            const realSourcePath = this.help.path.realPath({path: params.source_path});
            const realDestPath = this.help.path.realPath({path: params.dest_path});

            if (this.help.is.readable({path: realSourcePath})) {
                //file source is readable and writeable. continue
                if (this.help.is.readable({path: realDestPath})) {
                    //dest directory writeable. continue
                    const dest_complete_path = path.join(realDestPath, file);

                    // if (this.help.not.readable({path: dest_complete_path}) && this.help.not.writeable({path: dest_complete_path})) {
                        //dest does not exits. continue
                        try {
                            fs.renameSync(realSourcePath, dest_complete_path)
                            observer.next({type: 'success', data: params.dest_path})
                        } catch(err) {
                            observer.error({
                                type: 'error', data: null, message: `cannot rename ${params.source_path} to ${params.dest_path}`
                            });
                            return;
                        }
                    // } else {
                    //     observer.next({type: 'error', data: null, message: `${params.dest_path} already exists`})
                    // }

                } else {
                    observer.next({
                        type: 'error',
                        data: null,
                        message: `cannot rename ${params.source_path} to ${params.dest_path}. destination path unreachable`
                    })
                }
            } else {
                observer.next({
                    type: 'error',
                    data: null,
                    message: `cannot rename ${realSourcePath} to ${realDestPath}. source path unreachable`
                })
            }
            observer.complete();

        })
    }

    copy(params) {
        return new Observable((observer) => {
            (() => {
                try {
                    const replace_dest = params.replace ? 0 : fs.constants.COPYFILE_EXCL;

                    fs.copyFileSync(this.help.path.realPath({path: params.source}), this.help.path.realPath({path: params.destination}), replace_dest);

                    observer.complete();
                } catch (err) {
                    console.log(err);
                    const msg = "Internal server error";
                    observer.next({
                        type: 'error', content_length: msg.length, content_type: "500", message: "Internal server error"
                    });
                    observer.complete();
                }

            })();
        });
    }

    rm(params) {
        return new Observable((observer) => {
            try {
                // TODO: does not work 100% correctly need fix
                const removeRecursively = (rem_path) => {
                    // if (this.help.is.readable({path: rem_path}) && this.help.is.writeable({path: rem_path})) {
                        if (this.help.is.dir({path: rem_path})) {
                            // console.log("enter dir", rem_path)
                            // const entities = fs.readdirSync(rem_path);
                            // if (entities && entities.length) {
                            //     for (const entity of entities) {
                            //         removeRecursively(path.join(rem_path, entity));
                            //     }
                            // }
                            //
                            fs.rmdirSync(rem_path, {recursive: true})

                        } else {
                            fs.unlinkSync(rem_path);
                        }
                    // } else {
                    //     observer.next({type: 'error', data: null, message: `${rem_path} not writeable`});
                    // }
                }

                if(params.selection && params.selection.length){
                    params.selection.forEach(sel => {
                        removeRecursively(this.help.path.realPath({path: path.join(params.path, sel)}));
                    })
                }

                observer.next({type: 'message', message: 'done'});
                observer.complete();
            } catch (err) {
                console.log(err);
                observer.next({type: 'error', content_length: 0, content_type: "404", message: "not found"});
                observer.complete();
            }
        })
    }

    mkdir(params) {
        return new Observable((observer) => {
            try {
                const real_dest_path = this.help.path.realPath({path: path.join(params.path, params.name)});
                if(this.help.not.readable({path: real_dest_path})){
                    fs.mkdir(real_dest_path, {recursive: params.recursive || false}, () => {
                        observer.next({type: 'message', message: 'done'});
                        observer.complete();
                    });

                } else {
                    observer.next({
                        type: 'error', message: "Folder already exists"
                    });
                    observer.complete();
                }
            } catch (err) {
                console.log(err);
                const msg = "Internal server error";
                observer.next({
                    type: 'error', content_length: msg.length, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    recycle(params) {
        return new Observable((observer) => {
            try {
                const realPath = this.help.path.realPath({path: params.path});
                const trashPath = this.help.path.realPath({path: 'trash'});
                if (!this.help.is.dir({path: trashPath})) {
                    fs.mkdirSync(trashPath, {recursive: true})
                }
                const fd = fs.statSync(realPath);

                if (fd) {
                    const fileName = path.basename(realPath);
                    fs.renameSync(realPath, path.join(trashPath, fileName))
                }

                observer.complete();
            } catch (err) {
                console.log(err);
                observer.next({
                    type: 'error', content_length: 0, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    archive(params) {
        return new Observable((observer) => {
            try {
                const zip = new AdmZip.default();
                params.files.forEach((file,i) => {
                    const baseSource = this.help.path.realPath({path: params.basePath});
                    const source = path.join(baseSource, file)
                    if (this.help.is.dir({path: source})) {
                        zip.addLocalFolder(source);
                    } else {
                        zip.addLocalFile(source);
                    }
                })
                zip.writeZip(this.help.path.realPath({path: path.join(params.basePath,params.fileName + ".zip")}));
                observer.next({type: 'success', data: params.basePath})
                observer.complete();
            } catch (err) {
                console.log(err);
                observer.next({
                    type: 'error', content_length: 0, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    extract(params) {
        return new Observable((observer) => {
            try {
                const source = this.help.path.realPath({path: path.join(params.dest_path, params.file)});
                const destination = this.help.path.realPath({path: params.dest_path});

                const zip = new AdmZip.default(source);

                zip.extractAllTo(destination, true);

                observer.next({type: 'file_list', data: "the files were extracted"});

                observer.complete();
            } catch (err) {
                console.log(err);
                observer.next({
                    type: 'error', content_length: 0, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    readArchive(params) {
        return new Observable((observer) => {
            try {
                const source = this.help.path.realPath({path: params.path});

                const zip = new AdmZip.default(source);

                var zipEntries = zip.getEntries();

                const fileNames = zipEntries.map((el) => {
                    return {
                        name: el.entryName, directory: el.isDirectory, time: el.header.time, size: el.header.size
                    }
                })

                observer.next({type: 'file_list', data: fileNames});

                observer.complete();
            } catch (err) {
                console.log(err);
                observer.next({
                    type: 'error', content_length: 0, content_type: "500", message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    read(params) {
        return new Observable((observer) => {
            const file_name = params.path;
            const realPath = this.help.path.realPath({path: params.path});

            try {
                if (this.help.not.readable({path: realPath})) {
                    observer.error({type: 'error', content_length: 0, content_type: "404", message: "not found"});
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
                        //console.log('Buffering - ' + file_name);
                        observer.next(chunk);
                    }).on('end', function () {
                        //console.log('Done - ' + file_name);
                        observer.complete();
                    });
                })();

            } catch (err) {
                console.log(err);
                observer.error({type: 'error', content_length: 0, content_type: "404", message: "not found"});
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
/*setTimeout(async () => {

            let env = 'development';
            /!*****TESTS*******!/

            if (env !== 'production') {

                /!*this.archive({
                    path: 'trash',
                    destination:'test.zip'
                }).subscribe((response) => {
                    console.log(response);
                }, (response) => {
                    console.log(response);
                }, () => {
                    console.log('file was archived')
                })*!/

                /!*this.readArchive({
                    path: 'test.zip'
                }).subscribe((response) => {
                    console.log(response);
                }, (response) => {
                    console.log(response);
                }, () => {
                    console.log('archive contents listed')
                })*!/


                /!*this.recycle({
                    path: 'file1.txt'
                }).subscribe((response) => {
                    console.log(response);
                }, (response) => {
                    console.log(response);
                }, () => {
                    console.log('file was trashed')
                })*!/

                /!*this.tests.copy({
                    source: 'file1.txt', destination: 'file2.txt', replace: true
                }).subscribe((response) => {
                    console.log(response);
                }, (response) => {
                    console.log(response);
                }, () => {
                    console.log('file was copied')
                })*!/

                /!*this.tests.permissions({
                    path: 'file1.txt',
                    mode: 0o777
                }).subscribe((response) => {
                    console.log(response);
                }, (response) => {
                    console.log(response);
                }, () => {
                    console.log('permissions set')
                });*!/

                /!*this.tests.upload().subscribe((response) => {
                    if (response.data && response.data.length) {
                        console.log('upload response');
                    }

                }, (err) => {
                    console.log(`ERROR: ${err}`);
                    console.log(`upload test failed`);
                    status = 'with catastrophic Exception';
                }, () => {
                    console.log(`file transfer finished`)
                })*!/
                //this.tests.delete();


            }


        }, 0);*/

/*private tests: any = {
        copy: (params) => {
            return this.copy(params);
        }, permissions: (params) => {
            return this.chmod(params);
        }, printProgress: (progress) => {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(progress);
        }, upload: () => {
            return new Observable((observer) => {
                (async () => {
                    let fileInfo;
                    try {
                        fileInfo = await fsp.stat(this.help.path.realPath({path: 'ubuntu-20.04-desktop-amd64.iso'}))
                    } catch (err) {

                    }

                    const readableStream = fs.createReadStream(this.help.path.realPath({path: 'ubuntu-20.04-desktop-amd64.iso'}));
                    var zipSize = fileInfo.size;
                    var uploadedSize = 0; // Incremented by on('data') to keep track of the amount of data we've uploaded

                    readableStream.on('data', (buffer) => {
                        var segmentLength = buffer.length;

                        // Increment the uploaded data counter
                        uploadedSize += segmentLength;
                        observer.next(1);

                        // Display the upload percentage
                        //console.log("Progress:\t",((uploadedSize/zipSize*100).toFixed(2)+"%"));
                        this.tests.printProgress(`Progress: ${(uploadedSize / zipSize * 100).toFixed(2)}%`)
                    })

                    readableStream.on('close', (data) => {
                        console.log('closed', data)
                        observer.complete();
                    })

                    const obs = this.perform({
                        act: 'upload', payload: {
                            path: '.', name: 'ubuntu-20.04-copy.iso', readableStream: readableStream
                        }
                    });

                    let status = 'started';

                    obs.subscribe((response) => {
                        if (response.data && response.data.length) {
                            console.log(response.data);
                        }
                        status = `still in progress?`;
                    }, (err) => {
                        console.log(`ERROR: ${err}`);
                        status = 'with catastrophic Exception';
                    }, () => {
                        console.log(`file transfer finished ${status}`)
                    })
                })();
            })
        }, delete: () => {
            const obs = this.perform({
                act: 'rm', payload: {
                    path: '../../../deltest'
                }
            });
            obs.subscribe((response) => {
                console.log(response)
            }, (error) => {
                console.log(error);
            }, () => {

            });
        }, list: () => {
            const obs = this.perform({
                act: 'list', payload: {
                    path: '.'
                }
            });
            obs.subscribe((response) => {
                if (response.data && response.data.length) {
                    let testBuf = {};
                    response.data.forEach(el => {
                        if (el.isDirectory()) {
                            console.log(el);
                        } else if (el.isFile()) {
                            testBuf[el.name] = Buffer.from([]);
                            this.read({path: el.name}).subscribe((fileData) => {
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
            })
        }
    };*/