import updateObject from "../../utils/utils";
import * as actionTypes from "../actionType/page";

const initialState = {
    pageDataLoaded: false,
    pageLink: '',
    items: [],
    pageConfig: {},
    pageId: null
};



const updatePagedata = (state, action) => {
    return updateObject(state, {
        pageDataLoaded: true,
        ...action.data
    });
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    
    case actionTypes.PAGE_DATA_LOADED:
      return updatePagedata(state, action);
    
    default:
      return state;
  }
};

export default reducer;

