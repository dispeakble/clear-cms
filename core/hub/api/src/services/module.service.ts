import {Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {ProtocolService} from "./protocol.service";
import {payloadInterface} from "../interfaces/payload.interface";
import { RedisCacheService } from '../cache/redisCache.service';

@Injectable()
export class ModuleService {

    private methods = ["register", "mapPort", "getPort", "getChannel"];
    private modules = {
        hub: {
            version: 'version',
            description: 'The main hub',
            started: new Date(),
            dependencies: []
        }
    };
    private moduleStatus = {};

    constructor(
        private protocolService: ProtocolService,
        private cacheService: RedisCacheService) {
    }

    private async register(params: ModuleInterface) {

        //

        this.moduleStatus[params.name] = this.moduleStatus[params.name] || {tries: 0};

        this.moduleStatus[params.name].tries++;

        if(this.moduleStatus[params.name].tries >= 10){
            const moduleRegistrationFailed = {
                status: 'failed',
                resolution: {
                    action: 'stop'
                },
                reason: 'retry count exceeded for ' + params.name,
                data: null
            };

            this.moduleStatus[params.name].tries = 0;

            return moduleRegistrationFailed;
        }

        let missingDeps = [];
        let moduleAction = '';

        if(!params.dependencies){
            const moduleRegistrationFailed = {
                status: 'succeeded',
                resolution: {
                    action: 'start',
                    after: 1
                },
                reason: 'missing dependencies',
                data: missingDeps
            };
            return moduleRegistrationFailed;
        }

        await Promise.all(params.dependencies.map(async (dep) => {
            if (!this.modules.hasOwnProperty(dep.name)) {
                moduleAction = 'retry';
                console.log('could not find ' + dep.name + ' in this.modules.')
                missingDeps.push(dep);
                return dep;
            }
            const payload: payloadInterface = {//todo export this globally. lazy load
                api: 'protocol',
                act: 'ping',
                channel: 'hub',
                payload: dep
            };

            try {
                const pingResponse = await new Promise<any>(async (resolve_ping, reject_ping) => {
                    try {
                        setTimeout(() => {
                            resolve_ping(null);
                        }, 1000);

                        const module_response = await this.protocolService.sendMessage({
                            channel: dep.name,
                            payload: payload
                        });
                        resolve_ping(module_response);
                    } catch (ex){
                        resolve_ping(null);
                    }
                });

                if(!pingResponse){
                    moduleAction = 'retry';
                } else if(pingResponse.version === dep.version){
                    //console.log('found module: ' + pingResponse.name + '@' + pingResponse.version)
                } else if(dep.version === 'latest'){
                    //console.log('using ' + pingResponse.name + '@' + pingResponse.version + ' as latest ')
                    dep.version = pingResponse.version;
                } else {
                    //console.log('could not find ' + dep.name + ':' + dep.version);
                    //console.log('got instead ' + pingResponse.name + '@' + pingResponse.version);
                    dep.version = pingResponse.version;
                    moduleAction = 'restart';
                    missingDeps.push({
                        name: dep.name,
                        version: pingResponse.version,
                        requestedVersion: dep.version
                    });
                }
            } catch(ex){
                console.log(ex);
            }


        }));

        if (missingDeps.length === 0) {

            this.moduleStatus[params.name].tries = 0;

            this.modules[params.name] = {
                version: params.version,
                description: params.description,
                started: params.started,
                dependencies: params.dependencies
            };

            const moduleRegistrationSucceeded = {
                status: 'registered',
                data:this.modules[params.name]
            };
            return moduleRegistrationSucceeded;
        } else {
            const moduleRegistrationFailed = {
                status: 'failed',
                resolution: {
                    action: moduleAction,
                    after: 1
                },
                reason: 'missing dependencies',
                data: missingDeps
            };
            return moduleRegistrationFailed;
        }

    }

    async mapPort(data: any){
        let p_string = await this.cacheService.get('ports');
        let ports = JSON.parse(p_string);
        ports = ports || {};
        ports[data.port] = data.channel;
        await this.cacheService.set('ports', JSON.stringify(ports));
        return this.protocolService.sendMessage({
            channel: data.target || 'proxy',
            payload: {
                api: 'app',
                act: 'updatePortMapping',
                payload: ports
            }
        })
    }

    async getPortByChannel(data: any){
        let p_string = await this.cacheService.get('ports');
        let ports = JSON.parse(p_string);
        if(ports){
            for(let port in ports){
                if(ports[port] === data.channel){
                    return +port;
                }
            }
        }
        return null;
    }

    async getPortByPort(data: any){
        let p_string = await this.cacheService.get('ports');
        let ports = JSON.parse(p_string);
        if(ports){
            return ports[data.port];
        }
        return null;
    }

    public perform(data: any) {
        if (this.methods.includes(data.act)) {
            //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
            return this[data.act](data.payload);
        } else {
            console.log("Hub.moduleService." + data.act + " not found");
        }
        return null;
    }

}