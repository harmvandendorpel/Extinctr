import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_DONE,
  RECORDING_RENDERING,
  RECORDING_ADD_FRAME
} from '../constants/ActionTypes';
import createRecorder from '../canvas/recorder';

let recorder = null;

export function start() {
  return (dispatch, getState) => {
    if (getState().faller.playing) {
      recorder = createRecorder({});

      dispatch({
        type: RECORDING_START
      });
    }
  };
}

export function addFrame(frame) {
  recorder.addFrame(frame);

  return {
    type: RECORDING_ADD_FRAME
  };
}


export function stop() {
  return (dispatch, getState) => {
    dispatch({ type: RECORDING_STOP });
    dispatch({ type: RECORDING_RENDERING });

    recorder.save().then((blobURL) => {
      dispatch({ type: RECORDING_DONE, blobURL });
    });
  };
}
