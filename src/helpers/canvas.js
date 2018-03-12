export function getImageData(width, height, image) {
  const loadCanvas = document.createElement('canvas')
  loadCanvas.width = width
  loadCanvas.height = height
  const context = loadCanvas.getContext('2d')
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, width, height)
}

export function noSmoothing(context) {
  context.globalAlpha = 1
  context.imageSmoothingEnabled = false
  context.mozImageSmoothingEnabled = false
  context.webkitImageSmoothingEnabled = false
  context.msImageSmoothingEnabled = false
}
