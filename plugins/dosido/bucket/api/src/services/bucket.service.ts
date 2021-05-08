import {Inject, Injectable} from '@nestjs/common';
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

    private missing_methods = ["chmod", "chown", "write", "copy", "paste", "mkdir", "recycle", "archive", "extract"];
    private methods = ["info", "chmod", "chown", "list", "upload", "read", "write", "rename", "move", "copy", "paste", "rm", "mkdir", "recycle", "archive", "extract"];

    private help: any;

    private tests: any = {
        permissions: (params) => {
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
        }
    };

    constructor(@Inject('HelpService') private helpService) {
        this.help = helpService.help;
        setTimeout(async () => {

            let env = 'development';
            /*****TESTS*******/

            if (env !== 'production') {

                /*this.tests.permissions({
                    path: 'file1.txt',
                    mode: 0o777
                }).subscribe((response) => {
                    console.log(response);
                }, (response) => {
                    console.log(response);
                }, () => {
                    console.log('permissions set')
                });*/

                /*this.tests.upload().subscribe((response) => {
                    if (response.data && response.data.length) {
                        console.log('upload response');
                    }

                }, (err) => {
                    console.log(`ERROR: ${err}`);
                    console.log(`upload test failed`);
                    status = 'with catastrophic Exception';
                }, () => {
                    console.log(`file transfer finished`)
                })*/
                //this.tests.delete();


            }


        }, 0);
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
                    observer.next({
                        type: 'object', content_type: "object", data: {
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
                    type: 'error',
                    content_length: msg.length,
                    content_type: "500",
                    message: "Internal server error"
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
                    type: 'error',
                    content_length: msg.length,
                    content_type: "500",
                    message: "Internal server error"
                });
                observer.complete();
            }
        });
    }

    list(params) {
        return new Observable((observer) => {

            const realPath = this.help.path.realPath(params.path);

            if (this.help.not.dir({path: realPath}) || this.help.not.writeable({path: realPath})) {
                observer.next({type: 'error', data: null, message: 'cannot read directory'});
                observer.complete();
                return;
            }

            try {
                (async () => {
                    const entries = fs.readdirSync(realPath, {withFileTypes: true});
                    let response = [];
                    if (entries && entries.length) {
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
                })();

            } catch (err) {
                observer.next({type: 'error', data: null, message: 'cannot read directory'});
                observer.complete();
            }
        });
    }

    upload(params) {
        return new Observable((observer) => {
            const dir = this.help.path.realPath({path: params.path});
            const file = params.name;
            const realDestPath = path.join(dir, file);
            let message = "";
            try {
                if (!(params.readableStream instanceof fs.ReadStream)) {
                    throw new Error(`params.readableStream ! instanceof 'ReadStream'`)
                }
                if (this.help.not.readable({path: realDestPath})) {
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
                                const destWriteStream = fs.createWriteStream(realDestPath, {
                                    fd: fd, autoClose: true, highWaterMark: 50 * 1024
                                });

                                let streamingFlag = false;

                                let myIntId = setInterval(() => {
                                    if (!streamingFlag) {
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
                                        if (err) {
                                            console.log(err);
                                        }

                                    });
                                });

                                params.readableStream.on('close', () => {
                                    destWriteStream.close();
                                    observer.complete();
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

    write(params) {
        //todo file
    }

    rename(params) {
        return new Observable((observer) => {

            const realSourcePath = this.help.path.realPath(params.source_path);
            const realDestPath = this.help.path.realPath(params.dest_path);

            if (this.help.is.readable({path: realSourcePath}) && this.help.is.writeable({path: realSourcePath})) {
                //file source is readable and writeable. continue
                if (this.help.not.readable({path: realDestPath}) && this.help.not.writeable({path: realDestPath})) {
                    //file destination name/path doesn't exist. continue
                    fs.renameSync(realSourcePath, realDestPath);
                    observer.next({type: 'success', data: realDestPath})
                } else {
                    observer.next({
                        type: 'error', data: null, message: `cannot rename ${realSourcePath} to ${realDestPath}`
                    })
                }
            } else {
                observer.next({type: 'error', data: null, message: `cannot find ${realSourcePath}`})
            }

            observer.complete();

        })
    }

    move(params) {
        return new Observable((observer) => {
            const source_name = this.help.path.sanitize({path: params.source_path});
            const file = path.parse(source_name).base;

            const realSourcePath = this.help.path.realPath(params.source_path);
            const realDestPath = this.help.path.realPath(params.dest_path);

            if (this.help.is.readable({path: realSourcePath}) && this.help.is.writeable({path: realSourcePath})) {
                //file source is readable and writeable. continue
                if (this.help.is.readable({path: realDestPath}) && this.help.is.writeable({path: realDestPath})) {
                    //dest directory writeable. continue
                    const dest_complete_path = path.join(realDestPath, file);
                    if (this.help.not.readable({path: dest_complete_path}) && this.help.not.writeable({path: dest_complete_path})) {
                        //dest does not exits. continue
                        fs.renameSync(realSourcePath, dest_complete_path);
                        observer.next({type: 'success', data: dest_complete_path})
                    } else {
                        observer.next({type: 'error', data: null, message: `${realDestPath} already exists`})
                    }

                } else {
                    observer.next({
                        type: 'error',
                        data: null,
                        message: `cannot rename ${realSourcePath} to ${realDestPath}. destination path unreachable`
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
        //todo dir or file
    }

    paste(params) {
        //todo dir or file
    }

    rm(params) {
        return new Observable((observer) => {
            try {
                const realPath = this.help.path.realPath(params.path);

                const removeRecursively = (rem_path) => {
                    if (this.help.is.readable({path: rem_path}) && this.help.is.writeable({path: rem_path})) {
                        if (this.help.is.dir({path: rem_path})) {
                            const entities = fs.readdirSync(rem_path);
                            if (entities && entities.length) {
                                for (const entity of entities) {
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

    mkdir(params) {

    }

    recycle(params) {
        //todo dir or file
    }

    archive() {

    }

    extract() {

    }

    read(params) {
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
