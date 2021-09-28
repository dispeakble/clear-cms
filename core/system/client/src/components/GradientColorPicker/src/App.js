import React, { Component } from 'react'
import { applySnapshot } from 'mobx-state-tree'
import Controls from './Components/Controls'
import Main from './Pages/Main'
import { RouterModel, syncHistoryWithStore } from 'mst-react-router'
import { observer } from 'mobx-react'
import Store from './Models/Store'
import defaultStore from './defaultStore'
import { createBrowserHistory } from 'history'
import './App.sass'

const routerModel = RouterModel.create()
const history = syncHistoryWithStore(createBrowserHistory(), routerModel)
const store = Store.create({ ...defaultStore, router: routerModel })

class App extends Component {
  componentDidMount = () => {
    let snapShot
    try {
      snapShot = JSON.parse(
        window.localStorage.getItem('__GRADIENTLAB_STORE__')
      )
      if (snapShot) {
        snapShot.uiHidden = false
        snapShot.uiHiddenLocked = false
        applySnapshot(store, snapShot)
      }
    } catch (err) {
      console.error('Could not load application state from snapshot.')
    }
  }

  render() {
    return (
        <div className="gradient-color-picker">
          <div className="container-controls">
            <Controls store={store} />
          </div>
          <Main store={store} selectColor={this.props.selectColor} />
        </div>
    )
  }
}
export default observer(App)
