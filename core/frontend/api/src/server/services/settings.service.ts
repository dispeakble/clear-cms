import { Inject, Injectable } from "@nestjs/common";
import {payloadInterface} from "../interfaces/payload.interface";
import { Observable } from "rxjs";
import path from "path";
import { ProtocolService } from "./protocol.service";
import { readFile, } from "fs/promises";

@Injectable()
export class SettingsService {

  private methods = ["getSettings", "getTranslations"];
  constructor(@Inject('ProtocolService') private protocolService: ProtocolService) {

  }

  getTranslations(params: any) {
    return new Observable((subscriber) => {
      (async () => {
        const json_data = await readFile( path.join(__dirname, '../../src/client/languages/agency', `${params.language}.json`), {
          encoding: 'utf-8'
        } );
        subscriber.next(json_data);
        subscriber.complete();
      })()
    });
  }

  getSettings() {
    const protocolService: any = this.protocolService;
    return new Observable((subscriber) => {
      (async () => {
        try {
          const payload: payloadInterface = {
            channel: `${process.env.app}_db`,
            api: "sql",
            act: "get",
            payload: {
              db: "main",
              channel: `${process.env.app}_frontend`,
              data: {
                what: "setting",
                limit: [0, 1]
              }
            }
          };

          const result = {};

          try {
            const res = await protocolService.sendMessage(payload).toPromise();
            const data = JSON.parse(res.data);

            result['websiteName'] = data['websiteName'];
            result['applicationVersion'] = data['applicationVersion'];
            result['selectedTheme'] = data['selectedTheme'];
            result['colorScheme'] = data['colorScheme'];

          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }

          subscriber.next(result);
          subscriber.complete();
          return true;
        } catch (err) {
          subscriber.error(err);
          subscriber.complete();
        }
      })()
    })
  }

  public perform(data: any) {
    if (this.methods.includes(data.act)) {
      return this[data.act](Object.assign({}, data.payload));
    } else {
      // eslint-disable-next-line no-console
      console.log("Frontend.SettingsService." + data.act + " not found");
    }
    return null;
  }

}
