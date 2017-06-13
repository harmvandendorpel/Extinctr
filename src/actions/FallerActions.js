import {
  PLAY,
  PAUSE,
  IMAGE_LOADING,
  IMAGE_LOADED,
  IMAGE_UNLOAD
} from '../constants/ActionTypes';

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

export function imageLoaded({ image, filename }) {
  return {
    type: IMAGE_LOADED,
    image,
    filename
  };
}

export function imageLoading() {
  return {
    type: IMAGE_LOADING
  };
}

export function unloadImage() {
  return {
    type: IMAGE_UNLOAD
  };
}

export function imageRequest(filename) {
  return (dispatch) => {
    dispatch(imageLoading());
    loadImage(filename, { maxWidth: 1024, maxHeight: 1024 })
      .then(image => dispatch(imageLoaded({ image, filename })))
      .catch((error) => alert(error));
  };
}

export function resetImage() {
  return (dispatch, getState) => {
    const filename = getState().faller.filename;
    dispatch(unloadImage());
    dispatch(imageRequest(filename));
  };
}
