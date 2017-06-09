import { PAUSE, PLAY, FILE_LOADED, FILE_REQUEST } from '../constants/ActionTypes';

export default function faller(state = { loaded: false, playing: false }, action) {
  switch (action.type) {
    case PAUSE:
      return state + 1;
    case PLAY:
      return state - 1;
    case FILE_LOADED:
      return state + 1;
    case FILE_REQUEST:
      return state - 1;
    default:
      return state;
  }
}
