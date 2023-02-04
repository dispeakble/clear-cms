import { Inject, Injectable, Logger } from "@nestjs/common";
import { ModuleInterface } from "../interfaces/module.interface";
import { PayloadInterface } from "../interfaces/PayloadInterface";
import { Observable } from "rxjs";

interface ListProps {
    where?: Record<string, any>
}

@Injectable()
export class CategoriesService {

  public logger: Logger = new Logger("Categories.Service");
  private methods = ["list"];

  constructor(@Inject("ProtocolService") private protocolService) {

  }

  public list(params: ListProps) {
    return new Observable(subscriber => {
      (async () => {

        try {
          const payload: PayloadInterface = {
            channel: `db`,
            api: "sql",
            act: "list",
            payload: {
              db: "main",
              data: {
                what: "category",
                attributes: ["id", "title", "description", "backgroundImage", "parentId"],
                where: params?.where
              }
            }
          };

          const res = await this.protocolService.sendMessage(payload).toPromise();

          subscriber.next(res);
          subscriber.complete();
        } catch (err) {
          subscriber.error(err);
          subscriber.complete();
        }
      })();
    });
  }

  public perform(data: any, config?: ModuleInterface) {
    if (this.methods.includes(data.act)) {
      return this[data.act](data.payload, config);
    } else {
      this.logger.log(`Frontend.categoriesService.${data.act} not found`);
    }
    return null;
  }

}