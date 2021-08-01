import * as pageActions from './actions';
import {ValueOf} from "../../../infrastructure/appTypes";

export type PageActionType = ReturnType<ValueOf<typeof pageActions>>;

export type PageState = {
  data: number[]
};
