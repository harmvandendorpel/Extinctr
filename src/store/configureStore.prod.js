import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import faller from '../middleware/faller'

const finalCreateStore = compose(
  applyMiddleware(thunk, faller)
)(createStore)

module.exports = function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}
