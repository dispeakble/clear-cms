import { all } from 'redux-saga/effects';

import PageSaga from '../../context/pages/state/sagas'

export default function* appSaga() {
  yield all([
    ...PageSaga,
  ])
}
