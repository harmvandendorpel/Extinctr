import { combineReducers } from 'redux'
import faller from './faller'
import recorder from './recorder'

const rootReducer = combineReducers({
  faller,
  recorder
})

export default rootReducer
