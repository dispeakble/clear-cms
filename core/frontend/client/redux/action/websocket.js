import * as actionType from "../actionType/websocket";


export const websocketSuccess = (data) => ({
    type: actionType.WEB_SOCKET_CONNECTED,
    data,
});
