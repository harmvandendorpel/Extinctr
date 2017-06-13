import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_DONE,
  RECORDING_RENDERING,
  RECORDING_ADD_FRAME,
  PLAY,
  PAUSE
} from '../constants/ActionTypes';
import createRecorder from '../canvas/recorder';

let recorder = null;

export function start() {
  return (dispatch, getState) => {
    recorder = createRecorder({});

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

export function addFrame(frame) {
  recorder.addFrame(frame);

  return {
    type: RECORDING_ADD_FRAME
  };
}

export function stop() {
  return (dispatch) => {
    dispatch({ type: PAUSE });
    dispatch({ type: RECORDING_STOP });
    dispatch({ type: RECORDING_RENDERING });

    recorder.save().then((blobURL) => {
      dispatch({ type: RECORDING_DONE, blobURL });
    });
  };
}
