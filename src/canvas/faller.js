import { arrayToRGB, around } from '../helpers/colors';
import { getImageData, noSmoothing } from '../helpers/canvas';
import random from '../helpers/random';

export default function createFaller(canvas, { image, transparentColor, scatter }) {
  let scatter255 = scatter * 255;
  const width = image.width;
  const height = image.height;
  const invWidth = 1 / width;
  const widthx4 = width << 2;
  const transparentColorRGB = arrayToRGB(transparentColor);

  let canvasData;
  let ctx;

  let scratchCanvas;
  let scratchContext;

  let startIndex = null;
  let pixelsLength = null;
  let flip = true;
  let left = null;
  let right = null;

  let firstRow = null;

  function setPixel(data, index, color) {
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
  }

  function getValueSetFixed(data, index) {
    const previousColor = [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3]
    ];
    data[index + 3] = 0;
    return previousColor;
  }

  function initBB() {
    let newLeft = left;
    let newRight = right;
    let looper = startIndex;
    do {
      const i = looper--;
      const y = (i * invWidth) << 0;
      const x = i % width;

      if (newLeft !== null && x < newLeft - 2) continue;
      if (newRight !== null && x > newRight + 2) continue;

      const index = (x + y * width) << 2;
      if (canvasData.data[index + 3] === 0) continue;

      if (newLeft === null || x < newLeft) newLeft = x;
      if (newRight === null || x > newRight) newRight = x;
    } while (looper >= 0);

    left = newLeft;
    right = newRight;
  }

  function draw() {
    ctx.fillStyle = transparentColorRGB;
    ctx.fillRect(0, 0, width, height);
    scratchContext.putImageData(canvasData, 0, 0);
    ctx.drawImage(scratchCanvas, 0, 0);
  }

  function update() {
    const minLooper = firstRow * width;
    flip = !flip;

    let y;
    let x;
    let index;
    let newFirstRow;
    let beneathIndex;
    let looper = startIndex;
    let newLeft = left;
    let newRight = right;
    let leftOn;
    let rightOn;
    let offset;
    const pixels = canvasData.data;

    do {
      looper--;
      y = (looper * invWidth) << 0;
      x = looper - y * width;
      if (flip) x = width - x - 1;

      if (x < newLeft - 1) {
        if (!flip) {
          looper -= newLeft + (width - newRight);
        }
        continue;
      }
      if (x > newRight + 1) continue;

      index = (x + y * width) << 2;
      if (pixels[index + 3] === 0) continue;

      if (x < newLeft) {
        newLeft = x;
      } else if (x > newRight) {
        newRight = x;
      }

      newFirstRow = y;

      if (random() < scatter255) continue;
      beneathIndex = index + widthx4;

      if (
        pixels[beneathIndex + 3] === 0 &&
        y < height
      ) {
        setPixel(
          pixels,
          beneathIndex,
          getValueSetFixed(pixels, index)
        );
        continue;
      }

      if (pixels[beneathIndex + 3] === 0) continue;

      leftOn = (x === 0) ? true : pixels[beneathIndex - 1] !== 0;
      rightOn = (x === width - 1) ? true : pixels[beneathIndex + 7] !== 0;

      if (leftOn === false && rightOn === false) {
        offset = random() > 127 ? -4 : 4;
      } else if (leftOn === false) {
        offset = -4;
      } else if (rightOn === false) {
        offset = 4;
      } else {
        continue;
      }

      setPixel(
        pixels,
        beneathIndex + offset,
        getValueSetFixed(pixels, index)
      );
    } while (looper > minLooper);

    left = newLeft;
    right = newRight;
    firstRow = newFirstRow - 1;

    draw();
  }
  function calculateAlphaChannel(data) {
    const pixels = data.data;
    const margin = 8;
    let looper = pixels.length / 4;

    do {
      const i = looper--;
      const index = i * 4;
      if (
        around(pixels[index], transparentColor[0], margin) &&
        around(pixels[index + 1], transparentColor[1], margin) &&
        around(pixels[index + 2], transparentColor[2], margin)
      ) {
        pixels[index + 3] = 0;
      }
    } while (looper >= 0);
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
    noSmoothing(ctx);
  }

  function init() {
    initScratchCanvas();
    initVisibleCanvas();

    canvasData = getImageData(width, height, image);
    pixelsLength = canvasData.data.length;
    calculateAlphaChannel(canvasData);
    startIndex = (pixelsLength >> 2) - 1;
    initBB();
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
