export function loadImage(src) {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = src;
  });
}
