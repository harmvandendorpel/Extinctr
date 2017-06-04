export default function createFaller(canvas, filename, width, height) {
  const RANDOM_NUMBERS_COUNT = 512;
  const randomNumbers = Array(RANDOM_NUMBERS_COUNT).fill(0).map(() => Math.random());

  const COLOR_WHITE = [255, 255, 255, 0];
  let canvasData;
  let ctx;
  let pixels;

  let randomIndex = 0;
  let startIndex = null;
  let pixelsLength = null;
  let flip = true;
  const bb = [null, null];

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

  function calculateBoundingBox(start, previous) {
    let l = 10000;
    let r = -10000;
    let i = start;

    do {
      const index = i--;
      if (pixels[(index << 2) + 3] === 0) continue;
      const x = index % width;
      if (previous !== null && x === previous[0] - 1) {
        i -= (previous[0]) + (width - previous[1]) + 1;
      }
      if (x < l) l = x;
      if (x > r) r = x;
    } while (i >= 0);

    return [l, r];
  }

  function update() {
    let looper = startIndex || ((pixelsLength >> 2) - 1);
    let firstPixelIndex = null;
    const newBB = calculateBoundingBox(looper, bb);
    bb[0] = newBB[0];
    bb[1] = newBB[1];
    flip = !flip;
    do {
      const i = looper--;
      const y = i / width << 0;
      const xx = i % width;
      const x = flip ? xx : width - xx - 1;

      if (x < bb[0] || x > bb[1]) continue;

      const index = (x + y * width) << 2;
      if (pixels[index + 3] === 0) continue;

      if (firstPixelIndex === null) firstPixelIndex = looper;

      if (random() < 0.5) continue;
      const beneathIndex = index + (width << 2);

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

      const leftOn =
        x === 0 ||
        pixels[beneathIndex - 4 + 3] !== 0;

      const rightOn =
        x === width ||
        pixels[beneathIndex + 4 + 3] !== 0;

      let offset;
      if (!leftOn && !rightOn) {
        offset = random() > 0.5 ? -4 : 4;
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
    } while (looper >= 0);

    startIndex = firstPixelIndex;

    ctx.putImageData(canvasData, 0, 0);
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
        resolve();
      });
    });
  }
  return { init, update, bb };
}
