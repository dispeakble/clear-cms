import {Injectable} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";
import has = Reflect.has;

@Injectable()
export class ModuleService{

    private actions = ["register"];
    private modules = {};

    public perform(params: any){
        if(this.actions.includes(params.act)){
            let _this = this;
            console.log(params);
            return _this[params.act](Object.assign({}, params.payload))
        }
    }

    private register(params: ModuleInterface){

        let missingDeps = [];

        params.dependencies.forEach((dep) => {
            if(!this.modules.hasOwnProperty(dep)){//TODO PING THE MODULE AND WAIT FOR PONG
                missingDeps.push(dep);
            }
        });

        if(missingDeps.length === 0){
            this.modules[params.name] = {
                version: params.version,
                description: params.description,
                registered: Date,
                dependencies: params.dependencies
            }
            return this.modules[params.name];
        } else {
            const moduleRegistrationFailed = {
                status: 'failed',
                reason: 'missing dependencies',
                data: missingDeps
            };
            return moduleRegistrationFailed;
        }



    }

}