/**
 * Reads an SVG element made by song-formatter into the same shape the canvas recorder
 * produces, so the two can be compared. Style comes from the element's own `style`,
 * falling back to its ancestor <g> groups (that's where the fretboard's stroke lives).
 */

/** canvas `textAlign` values, keyed by SVG `text-anchor` */
const ALIGN = {
  start: 'left',
  middle: 'center',
  end: 'right',
};

function parseStyle(value) {
  return (value || '')
    .split(';')
    .map((rule) => rule.split(':'))
    .filter(([key, val]) => key && val !== undefined)
    .reduce((acc, [key, ...val]) => ({ ...acc, [key.trim()]: val.join(':').trim() }), {});
}

function styleOf(el, svg) {
  const chain = [];
  for (let node = el; node && node !== svg; node = node.parentNode) {
    chain.unshift(node);
  }
  return chain.reduce((acc, node) => ({ ...acc, ...parseStyle(node.getAttribute('style')) }), {});
}

const num = (el, name) => parseFloat(el.getAttribute(name));

function readSvg(svg) {
  const all = (tag) => [...svg.querySelectorAll(tag)];
  return {
    width: num(svg, 'width'),
    height: num(svg, 'height'),
    dots: all('circle').map((el) => ({
      x: num(el, 'cx'),
      y: num(el, 'cy'),
      r: num(el, 'r'),
      color: styleOf(el, svg).fill,
    })),
    texts: all('text').map((el) => {
      const style = styleOf(el, svg);
      return {
        text: el.textContent,
        x: num(el, 'x'),
        y: num(el, 'y'),
        font: style.font,
        color: style.fill,
        align: ALIGN[style['text-anchor']] || style['text-anchor'],
      };
    }),
    lines: all('line').map((el) => {
      const style = styleOf(el, svg);
      return {
        x1: num(el, 'x1'),
        y1: num(el, 'y1'),
        x2: num(el, 'x2'),
        y2: num(el, 'y2'),
        color: style.stroke,
        width: parseFloat(style['stroke-width']),
      };
    }),
    rects: all('rect').map((el) => {
      const style = styleOf(el, svg);
      return {
        x: num(el, 'x'),
        y: num(el, 'y'),
        w: num(el, 'width'),
        h: num(el, 'height'),
        color: style.stroke,
        width: parseFloat(style['stroke-width']),
      };
    }),
  };
}

module.exports = { readSvg };
