import {PageActionType, PageState} from "./types";
import {combineReducers} from "redux";

import {Reducer} from "../../../infrastructure/appTypes";

type ReducerOf<T extends keyof PageState> = Reducer<PageState, PageActionType, T>;

const data: ReducerOf<'data'> = (state = [], action) => {
  switch (action.type) {
    case "ADD_PAGE":
      return action.payload;

    default:
      return state
  }
}

export default combineReducers({
  data,
});
