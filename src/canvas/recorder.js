import GIF from 'gif.js.optimized';

export default function createRecorder(canvas, { workers = 5, quality = 10, delay = 50 }) {
  const gif = new GIF({
    workers,
    quality,
    debug: true,
    background: '#ffffff'
  });

  function addFrame() {
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

  function destroy() {
    // ...
  }

  return {
    addFrame,
    save,
    destroy,
  };
}
