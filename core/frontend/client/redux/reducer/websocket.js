import updateObject from "../../utils/utils";
import * as actionTypes from "../actionType/websocket";

const initialState = {
    websocketConnected: false,
    wsInstance: null,
};



const websocketSuccess = (state, action) => {
    return updateObject(state, {
        websocketConnected: true,
        websocketConnectionFailed: false,
        wsInstance: action.data
    });
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    
    case actionTypes.WEB_SOCKET_CONNECTED:
      return websocketSuccess(state, action);
    
    default:
      return state;
  }
};

export default reducer;

