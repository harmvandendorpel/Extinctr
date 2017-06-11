export function loadImage(src) {
  const image = new Image();
  return new Promise((resolve) => {
    image.onload = () => resolve(image);
    image.src = src;
  });
}
