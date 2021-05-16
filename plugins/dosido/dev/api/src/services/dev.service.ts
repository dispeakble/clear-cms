import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ModuleInterface} from "../interfaces/module.interface";
import {Observable, Subscriber} from "rxjs";
import * as fs from "fs";
const fsp = fs.promises;

@Injectable()
export class DevService {

    private methods = [];

    private help: any;

    constructor(@Inject('HelpService') private helpService, @Inject('ProtocolService') private protocolService, private httpService: HttpService) {
        //this.help = helpService.help;
        this.postUpload()
    }

    postUpload(){
        this.httpService.post('http://127.0.0.1:8686', {file:'hi'})
    }

    printProgress(progress) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(progress);
    }

    fileUploadNow() {return new Observable((observer) => {

        let fileName = 'text1.txt';
        let fileDest = 'text2.txt';
        let fileInfo, fileData;
        try {
            fileInfo = fs.statSync(this.help.path.realPath({path: fileName}));
            if(!fileInfo) return;
            fileData = fs.readFileSync(this.help.path.realPath({path: fileName}));
            const obs = this.protocolService.sendMessage({
                channel: 'bucket', api: 'bucket', act: 'put', payload: {
                    path: '.', name: fileDest, data: fileData, replace: true
                }
            });

            obs.subscribe((data)=>{
                console.log(data);
            }, (err) => {
                observer.error(err);
            }, () => {
                observer.complete();
            });
        } catch (err) {
            console.log(err);
        }

    })}

    testUpload(){
        (async () => {
            let filename = 'text1.txt';
            let filedest = 'text2.txt';
            let fileInfo;
            try {
                fileInfo = await fsp.stat(this.help.path.realPath({path: filename}))
            } catch (err) {
                console.log(err);
            }

            //const readStream = this.protocolService.createReadStream(this.help.path.realPath({path: filename}))

            const readableStream = fs.createReadStream(this.help.path.realPath({path: filename}));
            let zipSize = fileInfo.size;
            let uploadedSize = 0; // Incremented by on('data') to keep track of the amount of data we've uploaded

            readableStream.on('data', (buffer) => {
                let segmentLength = buffer.length;

                // Increment the uploaded data counter
                uploadedSize += segmentLength;

                // Display the upload percentage
                this.printProgress(`Progress: ${(uploadedSize / zipSize * 100).toFixed(2)}%`)
            })

            readableStream.on('close', (data) => {
                console.log('closed', data)

            })


            const obs = this.protocolService.sendMessage({
                channel: 'bucket', api: 'bucket', act: 'upload', payload: {
                    path: '.', name: filedest, bufferObserver: readableStream, replace: true
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
    }

    public perform(data: any, config?: ModuleInterface) {
        if (this.methods.includes(data.act)) {
            return this[data.act](data.payload, config);
        } else {
            console.log("dev.appService." + data.act + " not found");
        }
        return null;
    }

}
