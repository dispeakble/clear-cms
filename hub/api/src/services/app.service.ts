import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";

interface performInterface {
  act: string;
  payload: any;
}

@Injectable()
export class AppService {

  private actions = ["handShake"];

  constructor(

  ) { }

  public perform(params: performInterface){
    if(this.actions.includes(params.act)){
      let _this = this;
      return _this[params.act].call(params.payload)
    }
  }

  private handShake(data){
    return new Promise((resolve_handshake, reject_handshake) => {
      console.log('some handshake request ', data);

      setTimeout(() => {
        resolve_handshake({message: 'got your registration'});
      }, 300);
    });
    //TODO check if the module has access
    //TODO check what other module dependencies
    //
  }


}
