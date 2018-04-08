import { combineReducers } from 'redux'
import faller from './faller'
import recorder from './recorder'
import ui from './ui'

const rootReducer = combineReducers({
  faller,
  recorder,
  ui
})

export default rootReducer
