import {put, select, takeLatest} from 'redux-saga/effects';
import {addPageRequest, addPage} from "./actions";

import {AppState} from "../../../infrastructure/store/appState";

function* addPageRequestSaga() {
  const pageData = yield select((state: AppState) => state.pages.data);

  yield put(addPage([...pageData, pageData.length]));
}


export default [
  takeLatest(addPageRequest.type, addPageRequestSaga),
];
