import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {Observable, Subscriber} from "rxjs";
import {ProtocolService} from "./protocol.service";

interface performInterface {
  act: string;
  payload: any;
}

@Injectable()
export class AppService {

  private actions = ["handShake"];

  constructor(private protocolService: ProtocolService) {

  }

  public perform(params: performInterface){
    if(this.actions.includes(params.act)){
      let _this = this;
      return _this[params.act].call(params.payload)
    }
  }

  private handShake(data){
    console.log('some handshake request ', data)


    return {message: 'got your registration'};

    //TODO check if the module has access
    //TODO check what other module dependencies
    //
  }


}
