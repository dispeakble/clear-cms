import { Inject, Injectable, Logger } from "@nestjs/common";
import { ModuleInterface } from "../../interfaces/module.interface";
import { Observable } from "rxjs";

@Injectable()
export class HomeSearchHotelsService {
  private methods = ["hotels"];

  constructor(@Inject('ProtocolService') private protocolService) {
  }

  /*
  Hotels filters

  INPUT:
      1 destination: {
        name: string
      }

  OUTPUT:
      1 destination result = destination[]
  * */

  private searchDestination = async (params: any) => {
    let response = [];

    try {
      response = await this.protocolService.sendMessage({
        channel: `db`,
        api: 'sql',
        act: 'list',
        payload: {
          db: 'agency',
          data: {
            count: false,
            what: 'hotelsCache',
            as: 'HotelsCache',
            attributes: ['DestinationGeography.Id', 'DestinationGeography.Name', 'DestinationGeography.IntName'],
            include: [{
              required: true,
              model: 'geography',
              as: 'DestinationGeography',
              attributes: ['Id', 'Name', 'IntName'],
              where: {
                or: [{
                  Name: {
                    iLike: `%${params.data.name}%`
                  }
                },{
                  IntName: {
                    iLike: `%${params.data.name}%`
                  }
                }]
              }
            }],
            limit: [0,10],
            order: [
              [ "DestinationGeography", "Name", "asc" ]
            ],
            group: ['Destination', 'DestinationGeography.Id']
          }
        }
      }).toPromise();

      if(response && response.length) {
        const result = response.map((el: any) => {
          return el['DestinationGeography'];
        });
        return {
          destination: result
        }
      } else {
        return null;
      }

    } catch (err) {
      Logger.log(err);
      return null;
    }
    return null;
  }

  private hotels(params: any) {
    return new Observable(subscriber => {
      (async () => {
        let result;

        if(params.type === 'destination') {
          result = await this.searchDestination(params);
        }

        subscriber.next({id: params.id, data: result});
        subscriber.complete();
      } )();
    })
  }

  public perform(data: any, config?: ModuleInterface) {
    if (this.methods.includes(data.act)) {
      return this[data.act](data.payload, config);
    } else {
      // eslint-disable-next-line no-console
      console.log("Admin.searchService." + data.act + " not found");
    }
    return null;
  }
}