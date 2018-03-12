import {
  PLAY,
  PAUSE,
  IMAGE_LOADING,
  IMAGE_LOADED,
  IMAGE_UNLOAD,
  SET_TRANSPARENT_COLOR,
  SET_SCATTER,
  TOGGLE_INTERACTIVE,
} from '../constants/ActionTypes'

const initTransparentColor = [255, 255, 255, 255]
const initState = {
  loading: false,
  loaded: false,
  playing: false,
  interactive: false,
  image: null,
  filename: null,
  scatter: 0.1,
  transparentColor: initTransparentColor
}

export default function faller(state = initState, action) {
  switch (action.type) {
    case PAUSE:
      return { ...state, playing: false }

    case PLAY:
      if (state.loaded) {
        return { ...state, playing: true }
      }
      return state

    case IMAGE_LOADING:
      return {
        ...state,
        loading: true,
        playing: false
      }

    case IMAGE_LOADED:
      return {
        ...state,
        loaded: true,
        loading: false,
        playing: false,
        image: action.image,
        filename: action.filename,
      }

    case IMAGE_UNLOAD:
      return {
        ...state,
        loaded: false,
        playing: false,
        image: null,
        filename: null,
        transparentColor: initTransparentColor
      }

    case SET_TRANSPARENT_COLOR:
      return {
        ...state,
        transparentColor: action.color
      }

    case SET_SCATTER:
      return {
        ...state,
        scatter: action.scatter
      }

    case TOGGLE_INTERACTIVE:
      return {
        ...state,
        interactive: !state.interactive
      }

    default:
      return state
  }
}
