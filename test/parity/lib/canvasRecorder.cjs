/**
 * jsdom has no <canvas>, so the old library would draw nothing. This replaces
 * `getContext('2d')` with a stand-in that records the calls the old library makes
 * (arc, lineTo, rect, fillText...) so a canvas can be compared with an SVG.
 */

function createRecorder() {
  const drawing = {
    dots: [],
    texts: [],
    lines: [],
    rects: [],
  };
  let path = { segments: [], rects: [], arcs: [] };
  let pen = { x: 0, y: 0 };

  const ctx = {
    font: '10px sans-serif',
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    textAlign: 'start',
    beginPath() {
      path = { segments: [], rects: [], arcs: [] };
    },
    closePath() {},
    moveTo(x, y) {
      pen = { x, y };
    },
    lineTo(x, y) {
      path.segments.push({ x1: pen.x, y1: pen.y, x2: x, y2: y });
      pen = { x, y };
    },
    rect(x, y, w, h) {
      path.rects.push({ x, y, w, h });
    },
    arc(x, y, r) {
      path.arcs.push({ x, y, r });
    },
    stroke() {
      const style = { color: ctx.strokeStyle, width: ctx.lineWidth };
      path.segments.forEach((s) => drawing.lines.push({ ...s, ...style }));
      path.rects.forEach((r) => drawing.rects.push({ ...r, ...style }));
    },
    fill() {
      path.arcs.forEach((a) => drawing.dots.push({ ...a, color: ctx.fillStyle }));
    },
    fillText(text, x, y) {
      drawing.texts.push({
        text: String(text),
        x,
        y,
        font: ctx.font,
        color: ctx.fillStyle,
        align: ctx.textAlign,
      });
    },
  };

  return { ctx, drawing };
}

/**
 * @returns a function that reads back what was drawn on one canvas element
 */
function installCanvasRecorder(window) {
  const recordings = new WeakMap();
  // eslint-disable-next-line func-names
  window.HTMLCanvasElement.prototype.getContext = function () {
    if (!recordings.has(this)) {
      recordings.set(this, createRecorder());
    }
    return recordings.get(this).ctx;
  };

  return (canvas) => {
    const { drawing } = recordings.get(canvas) || createRecorder();
    return {
      ...drawing,
      width: canvas.width,
      height: canvas.height,
    };
  };
}

module.exports = { installCanvasRecorder };
