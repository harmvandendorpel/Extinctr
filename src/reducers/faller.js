import {
  PLAY,
  PAUSE,
  IMAGE_LOADING,
  IMAGE_LOADED,
  IMAGE_UNLOAD,
  IMAGE_REQUEST
} from '../constants/ActionTypes';

const initState = {
  loading: false,
  loaded: false,
  playing: false,
  image: undefined
};

export default function faller(state = initState, action) {
  switch (action.type) {
    case PAUSE:
      return { ...state, playing: false };

    case PLAY:
      if (state.loaded) {
        return { ...state, playing: true };
      }
      return state;

    case IMAGE_LOADING:
      return { ...state, loading: true, playing: false };

    case IMAGE_LOADED:
      return {
        ...state,
        loaded: true,
        loading: false,
        playing: true,
        image: action.image
      };

    case IMAGE_UNLOAD:
      return {
        ...state,
        loaded: false,
        playing: false,
        image: undefined
      };
    default:
      return state;
  }
}
