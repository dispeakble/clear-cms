import { combineReducers } from "redux";
import websocket from "./websocket";
import page from "./page";


export default combineReducers({
    websocket,
    page
});
