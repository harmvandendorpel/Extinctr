import {
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_RENDERING,
  RECORDING_DONE,
  IMAGE_UNLOAD,
  SET_FRAME_RECORD_INTERVAL,
  RECORDING_UPLOAD_START,
  RECORDING_UPLOAD_COMPLETE
} from '../constants/ActionTypes'

const initState = {
  recording: false,
  rendering: false,
  uploading: false,
  blobURL: null,
  blob: null,
  giphyURL: null,
  frameRecordInterval: 0 // 0 means every frame, 1 means every other frame, etc.
}

export default function recorderReducer(state = initState, action) {
  switch (action.type) {
    case RECORDING_START:
      return {
        ...state,
        recording: true,
        rendering: false,
        blobURL: null,
        giphyURL: null,
        blob: null
      }

    case RECORDING_STOP:
      return {
        ...state,
        recording: false
      }

    case RECORDING_RENDERING:
      return {
        ...state,
        rendering: true
      }

    case RECORDING_DONE: {
      const { blobURL, blob } = action.payload
      return {
        ...state,
        rendering: false,
        blobURL,
        blob
      }
    }

    case RECORDING_UPLOAD_START:
      return {
        ...state,
        uploading: true,
        giphyURL: null
      }

    case RECORDING_UPLOAD_COMPLETE: {
      const { giphyURL } = action.payload
      return {
        ...state,
        giphyURL,
        uploading: false
      }
    }

    case IMAGE_UNLOAD:
      return {
        ...state,
        blobURL: null
      }

    case SET_FRAME_RECORD_INTERVAL:
      return {
        ...state,
        frameRecordInterval: action.frameRecordInterval
      }
    default:
      return state
  }
}
