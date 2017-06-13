import GIF from 'gif.js.optimized';

export default function createRecorder({ workers = 5, quality = 10, delay = 50 }) {
  const gif = new GIF({
    workers,
    quality,
    debug: true
  });

  function addFrame(canvas) {
    gif.addFrame(canvas, {
      delay,
      copy: true
    });
  }

  function save() {
    return new Promise((resolve) => {
      gif.on('finished', blob => resolve(URL.createObjectURL(blob)));
      gif.render();
    });
  }

  return {
    addFrame,
    save
  };
}
