import {
  IMAGE_CANVAS_READY,
  PLAY,
  PAUSE,
  RECORDING_START,
  RECORDING_STOP,
  IMAGE_LOADED,
  RECORDING_DONE
} from '../constants/ActionTypes';
import createFaller from '../canvas/faller';
import createRecorder from '../canvas/recorder';

let recorder = null;
let faller = null;
let canvas = null;
let image = null;

let playing = false; // these are copies of the store for increased performance
let recording = false;

function update() {
  window.requestAnimationFrame(update);
  if (!playing) return;
  faller.update();
  if (recording) {
    recorder.addFrame();
  }
}

function initFaller(store) {
  if (!image || !canvas) return;
  const settings = { ...store.getState().faller, image };

  if (faller) faller.destroy();
  faller = createFaller(
    canvas, settings
  );

  if (recorder) recorder.destroy();
  recorder = createRecorder(canvas, {});
}

const fallerMiddleware = store => next => (action) => {
  const result = next(action);
  switch (action.type) {
    case IMAGE_LOADED:
      image = action.image;
      initFaller(store);
      break;

    case IMAGE_CANVAS_READY:
      canvas = action.canvas;
      initFaller(store);
      break;

    case PLAY:
      playing = true;
      break;

    case PAUSE:
      playing = false;
      break;

    case RECORDING_START:
      recording = true;
      break;

    case RECORDING_STOP:
      recording = false;
      recorder.save().then((blobURL) => {
        store.dispatch({ type: RECORDING_DONE, blobURL });
      });
      break;

    default:
      break;
  }
  return result;
};

update();

export default fallerMiddleware;
