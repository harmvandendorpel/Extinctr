import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_RENDERING,
  PLAY,
  PAUSE,
  SET_FRAME_RECORD_INTERVAL,
  RECORDING_DONE,
  RECORDING_UPLOAD_START,
  RECORDING_UPLOAD_COMPLETE
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

export function changeFrameRecordInterval(sliderInfo) {
  return {
    type: SET_FRAME_RECORD_INTERVAL,
    frameRecordInterval: sliderInfo.values[0]
  };
}

export function startUpload(blobURL) {
  return (dispatch) => {
    dispatch({ type: RECORDING_UPLOAD_START });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', blobURL, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      const blob = this.response; // not happy with 'this' here at all
      const formData = new FormData();
      formData.append('animated_gif', blob);
      fetch('/api/upload', { method: 'POST', body: formData })
        .then(() => dispatch({ type: RECORDING_UPLOAD_COMPLETE }));
    };
    xhr.send();
  };
}

export function doneRecording(blobURL) {
  return (dispatch) => {
    dispatch({ type: RECORDING_DONE, blobURL });
    dispatch(startUpload(blobURL));
  };
}
