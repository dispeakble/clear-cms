import {ClientProxy, Ctx, EventPattern, Payload, RedisContext} from "@nestjs/microservices";
import {Inject, Injectable} from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import {ModuleInterface} from "../interfaces/module.interface";
import fs from 'fs';

@Injectable()
export class VolumeService {

    private volume_path: string = process.env.VOLUME_PATH;//TODO GET THIS FROM A CONFIG ENV
    private methods = ["scandir", "readfile", "writefile", "writedir", "removefile", "removedir"];

    constructor(
        @Inject('REDIS_SERVICE') private redisService: ClientProxy
    ) {
    }



    public start() {
        return this.redisService.connect();
    }

    public readfile(data) {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(this.volume_path + data.name, (err, result) => {
                    if(err) {
                        console.log(err);
                        return resolve(null)
                    }
                    resolve(result.toString())
                });
            } catch (e){
                console.log(e);
                resolve(null);
            }
        });
    }

    public scandir(data) {
        return new Promise((resolve, reject) => {
            try {
                fs.readdir(this.volume_path + data.name, (err, result) => {
                    if(err) {
                        console.log(err);
                        return resolve(null)
                    }
                    resolve(result.toString())
                });
            } catch (e){
                console.log(e);
                resolve(null);
            }
        });
    }

    public writefile(data){
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(this.volume_path + data.name, data.content, () => {
                    resolve(true)
                });
            } catch (e){
                console.log(e);
                resolve(null);
            }
        });

    }

    public writedir(data){
        return new Promise((resolve, reject) => {
            try {
                fs.mkdir(this.volume_path + data, data.options, (err, result) => {
                    if(err) {
                        console.log(err);
                        return resolve(null)
                    }
                    resolve(result.toString())
                });
            } catch (e){
                console.log(e);
                resolve(null);
            }
        });

    }

    public removefile(data){
        return new Promise((resolve, reject) => {
            try {
                fs.unlink(this.volume_path + data.name,() => {
                    resolve(true)
                });
            } catch (e){
                console.log(e);
                resolve(null);
            }
        });

    }

    public removedir(data){
        return new Promise((resolve, reject) => {
            try {
                fs.unlink(this.volume_path + data.name,() => {
                    resolve(true)
                });
            } catch (e){
                console.log(e);
                resolve(null);
            }
        });

    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
            return this[data.act](data.payload);
        } else {
            console.log("Storage.storageService." + data.act + " not found");
        }
        return null;
    }

}