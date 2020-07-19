import {Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";

@Injectable()
export class ModuleService {

    private actions = ["register"];
    private modules = {};
    private moduleStatus = {};

    public perform(params: any) {
        if (this.actions.includes(params.act)) {
            let _this = this;
            console.log(params);
            return _this[params.act](Object.assign({}, params.payload))
        }
    }

    private register(params: ModuleInterface) {

        console.log(params);

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
            console.log(moduleRegistrationFailed);
            return moduleRegistrationFailed;
        }

        let missingDeps = [];

        params.dependencies.forEach((dep) => {
            if (!this.modules.hasOwnProperty(dep)) {//TODO PING THE MODULE AND WAIT FOR PONG
                missingDeps.push(dep);
            }
        });

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
            const moduleRegistrationFailed = {
                status: 'failed',
                resolution: {
                    action: 'retry',
                    after: 10
                },
                reason: 'missing dependencies',
                data: missingDeps
            };
            console.log(moduleRegistrationFailed);
            return moduleRegistrationFailed;
        }


    }

}