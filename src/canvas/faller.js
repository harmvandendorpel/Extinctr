import { arrayToRGB, around } from '../helpers/colors';
import { getImageData, noSmoothing } from '../helpers/canvas';
import random from '../helpers/random';

const EMPTY_SPACE = 0;
const NOT_MOVING = 1;
const MOVING = 2;

const CHANNEL_RED = 0;
const CHANNEL_GREEN = 1;
const CHANNEL_BLUE = 2;
const CHANNEL_ALPHA = 3;

export default function createFaller(canvas, { image, transparentColor, scatter }) {
  let scatter255 = scatter * 255;
  const pixelStatusBuffer = [];
  const width = image.width;
  const height = image.height;
  const invWidth = 1 / width;
  const transparentColorRGB = arrayToRGB(transparentColor);

  let canvasData;
  let ctx;

  let scratchCanvas;
  let scratchContext;

  let startIndex = null;
  let flip = true;

  let firstRow = 0;

  function draw() {
    ctx.fillRect(0, 0, width, height);
    scratchContext.putImageData(canvasData, 0, 0);
    ctx.drawImage(scratchCanvas, 0, 0);
  }

  function swapPixels(a, b) {
    const tempStatus = pixelStatusBuffer[a];
    pixelStatusBuffer[a] = pixelStatusBuffer[b];
    pixelStatusBuffer[b] = tempStatus;

    const a4 = a >> 2;
    const b4 = b >> 2;

    const pixelColorBuffer = canvasData.data;
    const tempColor = [
      pixelColorBuffer[a4 + CHANNEL_RED],
      pixelColorBuffer[a4 + CHANNEL_GREEN],
      pixelColorBuffer[a4 + CHANNEL_BLUE],
    ];

    pixelColorBuffer[a4 + CHANNEL_RED] = pixelColorBuffer[b4 + CHANNEL_RED];
    pixelColorBuffer[a4 + CHANNEL_GREEN] = pixelColorBuffer[b4 + CHANNEL_GREEN];
    pixelColorBuffer[a4 + CHANNEL_BLUE] = pixelColorBuffer[b4 + CHANNEL_BLUE];

    pixelColorBuffer[b4 + CHANNEL_RED] = tempColor[CHANNEL_RED];
    pixelColorBuffer[b4 + CHANNEL_GREEN] = tempColor[CHANNEL_GREEN];
    pixelColorBuffer[b4 + CHANNEL_BLUE] = tempColor[CHANNEL_BLUE];
  }

  function update() {
    const minLooper = firstRow * width;
    flip = !flip;

    let y;
    let x;
    let pixelStatusIndex;
    let newFirstRow;
    let pixelStatusBeneathIndex;
    let looper = startIndex;
    let offset = null;

    let leftOn;
    let rightOn;

    console.log('minLooper = ', minLooper, ', startIndex = ', startIndex)

    do {
      looper--;
      y = (looper * invWidth) << 0;
      x = looper - y * width;
      if (flip) x = width - x - 1;

      pixelStatusIndex = x + y * width;
      if (pixelStatusBuffer[pixelStatusIndex] === EMPTY_SPACE) continue;

      newFirstRow = y;

      if (random() < scatter255) continue;
      pixelStatusBeneathIndex = pixelStatusIndex + width;

      if (
        pixelStatusBuffer[pixelStatusBeneathIndex] === EMPTY_SPACE &&
        y < height
      ) {
        swapPixels(pixelStatusIndex, pixelStatusBeneathIndex);
        continue;
      }

      if (pixelStatusBuffer[pixelStatusBeneathIndex] === EMPTY_SPACE) continue;

      leftOn = (x === 0) ?
        true
      :
        pixelStatusBuffer[pixelStatusBeneathIndex - 1] !== EMPTY_SPACE;

      rightOn = (x === width - 1) ?
        true
       :
        pixelStatusBuffer[pixelStatusBeneathIndex + 1] !== EMPTY_SPACE;

      if (leftOn === false && rightOn === false) {
        offset = random() > 127 ? -1 : 1;
      } else if (leftOn === false) {
        offset = -1;
      } else if (rightOn === false) {
        offset = 1;
      } else {
        continue;
      }

      swapPixels(pixelStatusIndex, pixelStatusBeneathIndex + offset);
    } while (looper > minLooper);

    firstRow = newFirstRow - 1;

    draw();
  }

  function similarColor(a, b) {
    const margin = 8;
    return (
      around(a[CHANNEL_RED], b[CHANNEL_RED], margin) &&
      around(a[CHANNEL_GREEN], b[CHANNEL_GREEN], margin) &&
      around(a[CHANNEL_BLUE], b[CHANNEL_BLUE], margin)
    );
  }

  function calculatePixelStatus(data) {
    const pixels = data.data;
    const pixelCount = canvasData.data.length >> 2;

    for (let index = 0; index < pixelCount; index++) {
      const pixelIndex = index << 2;
      const pixelColor = pixels.slice(pixelIndex, pixelIndex + 3);
      pixelStatusBuffer[index] =
        similarColor(pixelColor, transparentColor)
      ?
        EMPTY_SPACE
      :
        NOT_MOVING;
    }
  }

  function initScratchCanvas() {
    scratchCanvas = document.createElement('canvas');
    scratchCanvas.width = width;
    scratchCanvas.height = height;
    scratchContext = scratchCanvas.getContext('2d');
    noSmoothing(scratchContext);
  }

  function initVisibleCanvas() {
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = `${width / window.devicePixelRatio}px`;
    canvas.style.height = `${height / window.devicePixelRatio}px`;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = transparentColorRGB;
    noSmoothing(ctx);
  }

  function init() {
    initScratchCanvas();
    initVisibleCanvas();

    canvasData = getImageData(width, height, image);
    calculatePixelStatus(canvasData);
    console.log(`${pixelStatusBuffer.filter(el => el === EMPTY_SPACE).length / pixelStatusBuffer.length * 100 >> 0}% empty space in image`);
    startIndex = (canvasData.data.length >> 2) - 1;
    draw();
  }

  function getContext() {
    return ctx;
  }

  function destroy() {
    // ....
  }

  function setScatter(newScatter) {
    scatter255 = newScatter * 255;
  }

  init();
  return {
    update,
    getContext,
    destroy,
    setScatter
  };
}
