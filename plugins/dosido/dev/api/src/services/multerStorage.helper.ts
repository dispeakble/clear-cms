import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export class MulterStorageHelper {
    public multerOptions = {
        storage: {
            _handleFile: (req, file, cb) => {
                try {

                    //const rs = fs.createReadStream(file);
                    file.stream.on("data", (data) => {
                        console.log(':)')
                    })

                    /*const lockTarget = this.protocolService.startHandshake({
                        channel: 'system',
                        payload: {

                        }
                    });

                    lockTarget.subscribe((handshake) => {
                        if (handshake.obs) {
                            file.stream.on("data", data => {
                                handshake.obs.next({fieldname: file.fieldname, chunk: data});
                            })
                        }
                    }, err => {
                        console.log(err);
                    }, () => {
                        console.log('complete');
                    });

                    file.stream.on('error', err => {
                        console.log(`finish ${file.fieldname}`)
                    })
                    file.stream.on('finish', function () {
                        console.log(`finish ${file.fieldname}`)
                    })*/

                } catch (err) {
                    console.log(err.message);
                }
            }, _removefile: (req, file, cb) => {

            }
        }
    }

    testMe(){
        console.log('test me')
    }

}