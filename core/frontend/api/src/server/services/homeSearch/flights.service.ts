import { Inject, Injectable, Logger } from "@nestjs/common";
import { ModuleInterface } from "../../interfaces/module.interface";
import { Observable } from "rxjs";

@Injectable()
export class HomeSearchFlightsService {
    private methods = ["flights"];

    constructor(@Inject('ProtocolService') private protocolService) {
    }

    /*
    Flights filters

    INPUT:
        1 nothing (initial search call for the departure destinations)
        2 departure: {
          name: string
        }

        3 destination: {
          name: string
          departure: number
        }

        4 dateReturn: {
          departure: number
          destination: number
        }

    OUTPUT:
        1 departure result = departure[]
        2 destination result = destination[]
        3 dateLeave: = dateLeave[]
        4 dateReturn: = dateReturn[]
    * */

    private searchInit = async () => {
        const result = {}

        result['departure'] = await this.protocolService.sendMessage({
            channel: `db`,
            api: 'sql',
            act: 'list',
            payload: {
                db: 'agency',
                data: {
                    count: false,
                    what: 'geography',
                    attributes: ['Id', 'Name', 'IntName'],
                    include: [{
                        required: true,
                        model: 'flightsCache',
                        as: 'FlightsCacheDeparture',
                        attributes: []
                    }],
                    limit: [0,10],
                    group: ['Geography.Id']
                }
            }
        }).toPromise();

        return result;
    }

    private searchDeparture = async (params: any) => {
        //searching for the departure by name
        const result = {};

        result['departure'] = await this.protocolService.sendMessage({
            channel: `db`,
            api: 'sql',
            act: 'list',
            payload: {
                db: 'agency',
                data: {
                    count: false,
                    what: 'geography',
                    attributes: ['Id', 'Name', 'IntName'],
                    include: [{
                        required: true,
                        model: 'flightsCache',
                        as: 'FlightsCacheDeparture',
                        attributes: []
                    }],
                    limit: [0,10],
                    group: ['Geography.Id'],
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
                }
            }
        }).toPromise();

        return result;
    }

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
                        what: 'flightsCache',
                        as: 'FlightsCache',
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
                        where: {
                            'Departure': {
                                eq: params.data.departure
                            }
                        },
                        group: ['Destination', 'DestinationGeography.Id']
                    }
                }
            }).toPromise();

            if(response && response.length) {
                const result = response.map((el: any, i: any) => {
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

    private async searchStartDate(params: any) {
        let response = [];

        try {
            response = await this.protocolService.sendMessage({
                channel: `db`,
                api: 'sql',
                act: 'get',
                payload: {
                    db: 'agency',
                    data: {
                        count: false,
                        what: 'flightsCache',
                        attributes: [['fn.min', 'DepartureDate', 'minDate'], ['fn.max', 'ReturnDate', 'maxDate']],
                        where: {
                            Departure: {
                                eq: params.data.departure
                            },
                            Destination: {
                                eq: params.data.destination
                            }
                        }
                    }
                }
            }).toPromise();

            if(response && response.length) {
                return {
                    dateInterval: response
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

    private flights(params: any) {
        return new Observable(subscriber => {
            (async () => {
                let result;
                if(params.type === 'init') {
                    result = await this.searchInit();
                }
                if(params.type === 'departure') {
                    result = await this.searchDeparture(params);
                }

                if(params.type === 'destination') {
                    result = await this.searchDestination(params);
                }

                if(params.type === 'dates') {
                    result = await this.searchStartDate(params);
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
            console.log("Frontend.searchService." + data.act + " not found");
        }
        return null;
    }
}