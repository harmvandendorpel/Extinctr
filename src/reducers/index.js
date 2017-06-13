import { combineReducers } from 'redux';
import faller from './faller';
import recorder from './recorder';
import colorpicker from './colorpicker';

const rootReducer = combineReducers({
  faller,
  recorder,
  colorpicker
});

export default rootReducer;
