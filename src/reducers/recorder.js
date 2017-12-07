import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_RENDERING,
  RECORDING_DONE,
  IMAGE_UNLOAD,
  SET_FRAME_RECORD_INTERVAL
} from '../constants/ActionTypes';

const initState = {
  recording: false,
  rendering: false,
  blobURL: null,
  frameRecordInterval: 0 // 0 means every frame, 1 means every other frame, etc.
};

export default function recorderReducer(state = initState, action) {
  switch (action.type) {
    case RECORDING_START:
      return {
        ...state,
        recording: true,
        rendering: false,
        blobURL: null
      };

    case RECORDING_STOP:
      return {
        ...state,
        recording: false
      };

    case RECORDING_RENDERING:
      return {
        ...state,
        rendering: true
      };

    case RECORDING_DONE:
      return {
        ...state,
        rendering: false,
        blobURL: action.blobURL
      };

    case IMAGE_UNLOAD:
      return {
        ...state,
        blobURL: null
      };

    case SET_FRAME_RECORD_INTERVAL:
      return {
        ...state,
        frameRecordInterval: action.frameRecordInterval
      };
    default:
      return state;
  }
}
