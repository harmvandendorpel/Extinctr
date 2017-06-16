import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_RENDERING,
  PLAY,
  PAUSE
} from '../constants/ActionTypes';

export function start() {
  return (dispatch, getState) => {
    if (!getState().faller.playing) {
      dispatch({
        type: PLAY
      });
    }

    dispatch({
      type: RECORDING_START
    });
  };
}

export function stop() {
  return (dispatch) => {
    dispatch({ type: PAUSE });
    dispatch({ type: RECORDING_STOP });
    dispatch({ type: RECORDING_RENDERING });
  };
}
