import { PLAY, PAUSE, IMAGE_REQUEST, IMAGE_LOADING, IMAGE_LOADED } from '../constants/ActionTypes';
import { loadImage } from '../helpers/load';

export function play() {
  return {
    type: PLAY
  };
}

export function pause() {
  return {
    type: PAUSE
  };
}

export function imageLoaded({ image }) {
  return {
    type: IMAGE_LOADED,
    image
  };
}

export function imageLoading() {
  return {
    type: IMAGE_LOADING
  };
}

export function imageRequest(filename) {
  return (dispatch) => {
    dispatch(imageLoading());
    loadImage(filename).then(image => dispatch(imageLoaded({ image })));
  };
}
