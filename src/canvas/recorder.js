import GIF from 'gif.js.optimized';

export default function createRecorder({ workers = 3, quality = 10, delay = 100 }) {
  const gif = new GIF({
    workers,
    quality
  });

  function addFrame(canvas) {
    gif.addFrame(canvas, {
      delay,
      copy: true
    });
  }

  function save() {
    return new Promise((resolve) => {
      gif.on('finished', (blob) => {
        const result = URL.createObjectURL(blob);
        window.open(result);
        resolve(result);
      });
      gif.render();
    });
  }

  return {
    addFrame,
    save
  };
}
