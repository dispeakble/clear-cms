import {Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import {ProtocolService} from "./protocol.service";
import {payloadInterface} from "../interfaces/payload.interface";

@Injectable()
export class ModuleService {

    private actions = ["register"];
    private modules = {
        hub: {
            version: 'version',
            description: 'The main hub',
            started: new Date(),
            dependencies: []
        }
    };
    private moduleStatus = {};

    constructor(private protocolService: ProtocolService) {
    }

    public perform(params: any) {
        if (this.actions.includes(params.act)) {
            let _this = this;
            return _this[params.act](Object.assign({}, params.payload))
        }
    }

    private async register(params: ModuleInterface) {

        this.moduleStatus[params.name] = this.moduleStatus[params.name] || {tries: 0};

        this.moduleStatus[params.name].tries++;

        if(this.moduleStatus[params.name].tries >= 3){
            const moduleRegistrationFailed = {
                status: 'failed',
                resolution: {
                    action: 'stop'
                },
                reason: 'retry count exceeded',
                data: null
            };
            return moduleRegistrationFailed;
        }

        let missingDeps = [];
        let moduleAction = '';

        await Promise.all(params.dependencies.map(async (dep) => {
            if (!this.modules.hasOwnProperty(dep.name)) {
                console.log('could not find ' + dep.name + ' in this.modules.')
                missingDeps.push(dep);
                return dep;
            }
            const payload: payloadInterface = {
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
                        }, 5000);

                        const module_response = await this.protocolService.sendMessage({message: dep.name}, payload);
                        resolve_ping(module_response);
                    } catch (ex){
                        resolve_ping(null);
                    }
                });

                if(!pingResponse){
                    moduleAction = 'retry';
                } else if(pingResponse.version === dep.version){
                    console.log('found module: ' + pingResponse.name + '@' + pingResponse.version)
                } else if(dep.version === 'latest'){
                    console.log('using ' + pingResponse.name + '@' + pingResponse.version + ' as latest ')
                    dep.version = pingResponse.version;
                } else {
                    console.log('could not find ' + dep.name + ':' + dep.version);
                    console.log('got instead ' + pingResponse.name + '@' + pingResponse.version);
                    dep.version = pingResponse.version;
                    moduleAction = 'stop';
                    missingDeps.push({
                        name: dep.name,
                        version: pingResponse.version,
                        requestedVersion: dep.version
                    });
                }
                console.log('from ' + dep.name, pingResponse);
            } catch(ex){
                console.log(ex);
            }


        }));

        if (missingDeps.length === 0) {

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
            console.log(missingDeps);
            const moduleRegistrationFailed = {
                status: 'failed',
                resolution: {
                    action: moduleAction,
                    after: 10
                },
                reason: 'missing dependencies',
                data: missingDeps
            };
            return moduleRegistrationFailed;
        }


    }

}