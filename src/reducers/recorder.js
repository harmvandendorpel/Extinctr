import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_ADD_FRAME,
  RECORDING_RENDERING,
  RECORDING_DONE
} from '../constants/ActionTypes';

const initState = {
  recording: false,
  rendering: false,
  blobURL: null
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

    case RECORDING_ADD_FRAME:
      return {
        ...state
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

    default:
      return state;
  }
}