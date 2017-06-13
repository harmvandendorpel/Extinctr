export function loadImage(src, options) {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => {
      if (
        options.maxWidth && image.width > options.maxWidth ||
        options.maxHeight && image.height > options.maxHeight) {
        reject(`image is too large: maximum dimensions ${options.maxWidth} x ${options.maxHeight} pixels`);
      }

      resolve(image);
    };
    image.onerror = () => reject('is that really an image?');
    image.src = src;
  });
}
