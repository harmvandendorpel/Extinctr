import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'
import DevTools from '../containers/DevTools'
import faller from '../middleware/faller'

const logger = createLogger()

const finalCreateStore = compose(
  applyMiddleware(logger, thunk, faller),
  DevTools.instrument()
)(createStore)

module.exports = function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  return store
}
