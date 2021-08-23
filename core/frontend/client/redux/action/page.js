import * as actionType from "../actionType/page";


export const updatePageData = (data) => ({
    type: actionType.PAGE_DATA_LOADED,
    data,
});
