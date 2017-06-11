import { PLAY, PAUSE, FILE_LOADED, IMAGE_REQUEST } from '../constants/ActionTypes';

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

    case IMAGE_REQUEST:
      return { ...state, loading: true, playing: false };

    case FILE_LOADED:
      return { ...state, loaded: true, loading: false, image: action.image };

    default:
      return state;
  }
}
