export default function createFaller(canvas, filename, width, height, scatter = 0) {
  const RANDOM_NUMBERS_COUNT = 2048;
  const randomNumbers = Array(RANDOM_NUMBERS_COUNT).fill(0).map(() => (Math.random() * 255 << 0));
  const invWidth = 1 / width;

  let canvasData;
  let ctx;
  let startIndex = null;
  let randomIndex = 0;
  let pixelsLength = null;
  let flip = true;
  const widthx4 = width << 2;

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
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = color[3];
  }

  function setReturnPixel(data, index, color) {
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
    if (randomIndex > RANDOM_NUMBERS_COUNT) randomIndex = 0;
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
      if (canvasData.data[index + 3] === 0) continue;

      if (newLeft === null || x < newLeft) newLeft = x;
      if (newRight === null || x > newRight) newRight = x;
    } while (looper >= 0);

    left = newLeft;
    right = newRight;
  }

  function startUpdating() {
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

      if (random() < scatter) continue;
      beneathIndex = index + widthx4;

      if (
        pixels[beneathIndex + 3] === 0 &&
        y < height
      ) {
        setPixel(
          pixels,
          beneathIndex,
          setReturnPixel(pixels, index, [255, 255, 255, 0])
        );
        continue;
      }

      if (pixels[beneathIndex + 3] === 0) continue;

      if (x === 0) {
        leftOn = true;
      } else {
        leftOn = pixels[beneathIndex - 1] !== 0;
      }

      if (x === width - 1) {
        rightOn = true;
      } else {
        rightOn = pixels[beneathIndex + 7] !== 0;
      }

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
        setReturnPixel(pixels, index, [255, 255, 255, 0])
      );
    } while (looper > minLooper);

    left = newLeft;
    right = newRight;
    firstRow = newFirstRow;
    setTimeout(startUpdating, 0);
  }

  function draw() {
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
        pixelsLength = canvasData.data.length;
        startIndex = (pixelsLength >> 2) - 1;
        initBB();
        resolve();
      });
    });
  }
  return { init, startUpdating, draw, getState };
}
