import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from 'redux-saga';
import {createWrapper} from "next-redux-wrapper";

import appReducer from "./appReducer";
import appSaga from "./appSaga";

const USE_DEV_TOOLS = process.env.NODE_ENV !== 'production'

const makeAppStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const storeEnhancers = USE_DEV_TOOLS ?
    composeWithDevTools({
      trace: true,
      traceLimit: 20,
    })(applyMiddleware(sagaMiddleware)) : applyMiddleware(sagaMiddleware);

  const appStore = createStore(
    appReducer,
    initialState,
    storeEnhancers,
  );

  sagaMiddleware.run(appSaga);

  return appStore;
}

export default createWrapper(makeAppStore);
