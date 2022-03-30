
class DataController {

    private context: any;

    private dependencyMap: any = {
        'Categories Module': ['categories']
    };


    constructor(context: any) {
        this.context = context;
    }

    public async GetDependencies(data: any) {

        const dependencyList: string[] = [];

        for(const item of data.items) {
            const dep = this.dependencyMap[item.module];
            if(dep) {
                if(!dependencyList.includes(dep)) {
                    dependencyList.push(dep);
                }
            }
        }

        const result: any = {};

        if(dependencyList.length) {
           for(const dep of dependencyList) {
               switch(dep) {
                   case 'categories':
                       result[dep] = await this.listCategories();
                       break;
                   default:
                       break;
               }
           }
        }

        return result;
    }

    private async listCategories() {
        const data = await this.context.req.apiHub({
            protocolMethod: 'sendMessage',
            channel: `${process.env.app}_frontend`,
            api: 'categories',
            act: 'list',
            payload: {}
        });

        return data;
    }

}

export default DataController;