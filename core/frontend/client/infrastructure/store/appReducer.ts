import { combineReducers } from 'redux';

import PagesState from "../../context/pages/state";

export default combineReducers({
  pages: PagesState,
});
