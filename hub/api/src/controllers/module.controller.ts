import {Controller, Inject} from "@nestjs/common";
import {ModuleInterface} from "../interfaces/module.interface";

@Controller()
export class ModuleController {

    private modules: ModuleInterface[];

    constructor() {

    }

    public registerModule(module: ModuleInterface) {
        let foundModule: ModuleInterface = this.getModuleByName(module.name);

        if (foundModule) {
            //the module is already registered.
            return;
        }

        let dependenciesLoaded = true;

        module.dependencies.forEach((dep: string) => {
            let depModule: ModuleInterface = this.getModuleByName(dep);
            if (!depModule) {
                dependenciesLoaded = false;
            }
        });

        if (!dependenciesLoaded) {
            return;//TODO send back to try again soon
        }

        module.registered = new Date();

        this.modules.push(module);

    }

    private getModuleByName(name: string): ModuleInterface | null {
        let foundModule: ModuleInterface;
        this.modules.forEach((module) => {
            if (module.name === name) {
                foundModule = module;
            }
        });
        return foundModule || null;
    }

}