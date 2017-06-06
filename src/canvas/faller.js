export default function createFaller(canvas, filename, width, height, scatter = 0) {
  const RANDOM_NUMBERS_COUNT = 512;
  const randomNumbers = Array(RANDOM_NUMBERS_COUNT).fill(0).map(() => (Math.random() * 255 << 0));
  const COLOR_WHITE = [255, 255, 255, 0];
  const invWidth = 1 / width;

  let canvasData;
  let ctx;
  let pixels;
  let startIndex = null;
  let randomIndex = 0;
  let pixelsLength = null;
  let flip = true;

  let left = null;
  let right = null;

  let firstRow = null;

  function loadImage(src) {
    const image = new Image();
    return new Promise((resolve) => {
      image.onload = () => resolve(image);
      image.src = src;
    });
  }

  function setPixel(data, index, color) {
    const previousColor = [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3]
    ];
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
    return previousColor;
  }

  function random() {
    randomIndex++;
    randomIndex %= RANDOM_NUMBERS_COUNT;
    return randomNumbers[randomIndex];
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
      if (pixels[index + 3] === 0) continue;

      if (newLeft === null || x < newLeft) newLeft = x;
      if (newRight === null || x > newRight) newRight = x;
    } while (looper >= 0);

    left = newLeft;
    right = newRight;
  }

  function update() {
    const minLooper = firstRow * width;

    let y;
    let x;
    let xx;
    let index;
    let newFirstRow;
    let beneathIndex;
    let looper = startIndex;
    let newLeft = left;
    let newRight = right;
    let leftOn;
    let rightOn;
    let offset;
    flip = !flip;

    do {
      looper--;
      y = (looper * invWidth) << 0;
      xx = looper % width;
      x = flip ? xx : width - xx - 1;

      if (x < newLeft - 1 || x > newRight + 1) continue;

      index = (x + y * width) << 2;
      if (pixels[index + 3] === 0) continue;

      if (x < newLeft) {
        newLeft = x;
      } else if (x > newRight) {
        newRight = x;
      }

      newFirstRow = y;

      if (random() < scatter) continue;
      beneathIndex = index + (width << 2);

      if (
        pixels[beneathIndex + 3] === 0 &&
        y < height - 1
      ) {
        setPixel(
          pixels,
          beneathIndex,
          setPixel(pixels, index, COLOR_WHITE)
        );
        continue;
      }

      if (pixels[beneathIndex + 3] === 0) continue;

      leftOn =
        x === 0 ||
        pixels[beneathIndex - 1] !== 0;

      rightOn =
        x === width ||
        pixels[beneathIndex + 7] !== 0;

      if (!leftOn && !rightOn) {
        offset = random() > 127 ? -4 : 4;
      } else if (!leftOn) {
        offset = -4;
      } else if (!rightOn) {
        offset = 4;
      } else {
        continue;
      }

      setPixel(
        pixels,
        beneathIndex + offset,
        setPixel(pixels, index, COLOR_WHITE)
      );
    } while (looper > minLooper);

    left = newLeft;
    right = newRight;
    firstRow = newFirstRow;
    ctx.putImageData(canvasData, 0, 0);
  }

  function getState() {
    return { left, firstRow, right };
  }

  function init() {
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = `${width / window.devicePixelRatio}px`;
    canvas.style.height = `${height / window.devicePixelRatio}px`;
    ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    return new Promise((resolve) => {
      loadImage(filename).then((image) => {
        ctx.drawImage(image, 0, 0);
        canvasData = ctx.getImageData(0, 0, width, height);
        pixels = canvasData.data;
        pixelsLength = pixels.length;
        startIndex = (pixelsLength >> 2) - 1;
        initBB();
        resolve();
      });
    });
  }
  return { init, update, getState };
}
