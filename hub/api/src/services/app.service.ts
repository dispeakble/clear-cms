import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";

interface performInterface {
  act: string;
  payload: any;
}

@Injectable()
export class AppService {
  private methods = ["register"];

  constructor(private protocolService: ProtocolService) { }

  public perform(data: any) {
    if (this.methods.includes(data.act)) {
      //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
      return this[data.act](data.payload);
    } else {
      console.log("Hub.appService." + data.act + " not found");
    }
    return null;
  }

}
