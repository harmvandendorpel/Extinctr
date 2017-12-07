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

export default function createFaller(canvas, { image, interactive, transparentColor, scatter }) {
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

    const a4 = a << 2;
    const b4 = b << 2;

    const pixelColorBuffer = canvasData.data;
    const tempColor = [
      pixelColorBuffer[a4 + CHANNEL_RED],
      pixelColorBuffer[a4 + CHANNEL_GREEN],
      pixelColorBuffer[a4 + CHANNEL_BLUE],
      pixelColorBuffer[a4 + CHANNEL_ALPHA],
    ];

    pixelColorBuffer[a4 + CHANNEL_RED] = pixelColorBuffer[b4 + CHANNEL_RED];
    pixelColorBuffer[a4 + CHANNEL_GREEN] = pixelColorBuffer[b4 + CHANNEL_GREEN];
    pixelColorBuffer[a4 + CHANNEL_BLUE] = pixelColorBuffer[b4 + CHANNEL_BLUE];
    pixelColorBuffer[a4 + CHANNEL_ALPHA] = pixelColorBuffer[b4 + CHANNEL_ALPHA];

    pixelColorBuffer[b4 + CHANNEL_RED] = tempColor[CHANNEL_RED];
    pixelColorBuffer[b4 + CHANNEL_GREEN] = tempColor[CHANNEL_GREEN];
    pixelColorBuffer[b4 + CHANNEL_BLUE] = tempColor[CHANNEL_BLUE];
    pixelColorBuffer[b4 + CHANNEL_ALPHA] = tempColor[CHANNEL_ALPHA];
  }

  function update() {
    const minIterator = interactive ? 0 : firstRow * width;
    flip = !flip;

    let y;
    let x;
    let pixelStatusIndex;
    let newFirstRow;
    let pixelStatusBeneathIndex;
    let iterator = startIndex;
    let offset = null;

    let leftOn;
    let rightOn;

    do {
      iterator--;
      y = (iterator * invWidth) << 0;
      x = iterator - y * width;
      if (flip) x = width - x - 1;

      pixelStatusIndex = x + y * width;
      if (pixelStatusBuffer[pixelStatusIndex] === EMPTY_SPACE) continue;
      if (pixelStatusBuffer[pixelStatusIndex] === NOT_MOVING) continue;

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

      switch (leftOn + rightOn) {
        case 0:
          offset = random() > 127 ? -1 : 1;
          break;

        case 1:
          offset = !leftOn * -1 + !rightOn;
          break;

        default:
          continue;
      }

      swapPixels(pixelStatusIndex, pixelStatusBeneathIndex + offset);
    } while (iterator > minIterator);

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

      if (
        similarColor(pixelColor, transparentColor) ||
        pixels[pixelIndex + CHANNEL_ALPHA] === 0
      ) {
        pixelStatusBuffer[index] = EMPTY_SPACE;
      } else {
        pixelStatusBuffer[index] = interactive ? NOT_MOVING : MOVING;
      }
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

  function onTouchPixel(x, y) {
    const r = 8;

    for (let iy = Math.max(0, y - r); iy < Math.min(height, y + r); iy++) {
      for (let ix = Math.max(0, x - r); ix < Math.min(width, x + r); ix++) {
        const index = ix + iy * width;
        if (pixelStatusBuffer[index] === NOT_MOVING) {
          pixelStatusBuffer[index] = MOVING;
        }
      }
    }
  }

  function initEvents() {
    canvas.addEventListener('mousemove', (e) => {
      const x = e.offsetX * window.devicePixelRatio;
      const y = e.offsetY * window.devicePixelRatio;
      onTouchPixel(x, y);
    });
  }

  function init() {
    initEvents();
    initScratchCanvas();
    initVisibleCanvas();

    canvasData = getImageData(width, height, image);
    calculatePixelStatus(canvasData);
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
