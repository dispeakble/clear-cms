export interface DependencyInterface{
    name: string;
    version: number;
}

export interface ModuleInterface {
    name: string;
    version: number;
    description: string;
    started: Date;
    dependencies: DependencyInterface[];
}