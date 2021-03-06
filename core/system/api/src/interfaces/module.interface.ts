export interface DependencyInterface{
    name: string;
    version: string;
}

export interface ModuleInterface {
    name: string;
    version: string;
    description: string;
    started: Date;
    config: any;
    dependencies: DependencyInterface[];
}