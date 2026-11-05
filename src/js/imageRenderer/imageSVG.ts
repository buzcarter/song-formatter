/**
 * Converts image JSON data to SVG XML.
 * Limits: no checks for unique Ids.
 */

import { LayerTypes, StyleDef, SVGImage, SVGLayer } from './interfaces/SVGImage';
import { ImageBuilder } from './classes/ImageBuilder';

/** SVG anchors for StyleDef's textAlign */
const TEXT_ANCHORS: Record<NonNullable<StyleDef['textAlign']>, string> = {
  left: 'start',
  center: 'middle',
  right: 'end',
};

/** The CSS property and value for one StyleDef entry, or `null` to leave it out */
function toCss(key: keyof StyleDef, value: string): [string, string] | null {
  switch (key) {
    case 'fillColor':
      return ['fill', value];
    case 'fontFamily':
      return ['font', value];
    case 'textAlign':
      return ['text-anchor', TEXT_ANCHORS[value as keyof typeof TEXT_ANCHORS] || 'middle'];
    case 'strokeColor':
      return ['stroke', value];
    case 'strokeWidth':
      return ['stroke-width', value];
    default:
      return null;
  }
}

function getStyle(type: LayerTypes, style: StyleDef): string {
  // Object.entries() loses the key types (an object can have extra keys at runtime), hence the cast
  let result = (Object.entries(style) as [keyof StyleDef, string | undefined][])
    .reduce((acc, [key, value]) => {
      const css = value ? toCss(key, value) : null;
      return css ? `${acc}${css[0]}:${css[1]};` : acc;
    }, '');

  if (type === LayerTypes.TEXT && !style.textAlign) {
    result += 'text-anchor:middle;';
  }

  return result;
}

function renderLayer(layer: SVGLayer): string {
  let style = layer.style ? getStyle(layer.type, layer.style) : '';
  style = style ? `style="${style}"` : '';

  // `layer.type` tells TypeScript which kind of layer this is, so each case can use its fields
  switch (layer.type) {
    case LayerTypes.CIRCLE:
      return `<circle cx="${layer.center.x}" cy="${layer.center.y}" r="${layer.radius}" ${style} />`;
    case LayerTypes.LINE:
      return `<line x1="${layer.endPoints[0].x}" y1="${layer.endPoints[0].y}" x2="${layer.endPoints[1].x}" y2="${layer.endPoints[1].y}" ${style} />`;
    case LayerTypes.RECTANGLE:
      return `<rect x="${layer.pos.x}" y="${layer.pos.y}" width="${layer.width}" height="${layer.height}" ${style} />`;
    case LayerTypes.TEXT:
      return `<text x="${layer.pos.x}" y="${layer.pos.y}" ${style}>${layer.text}</text>`;
    default:
      return '';
  }
}

function renderLayers(layers: SVGLayer[]): string {
  return layers.reduce((acc: string, layer) => {
    if (layer.type === LayerTypes.GROUP) {
      const { name } = layer;
      const style = layer.style ? getStyle(LayerTypes.GROUP, layer.style) : '';
      // No need to hand the group's style to its children ("renderLayers(layer.layers,
      // layer.style)"): in SVG, shapes inherit fill, stroke and font from their <g>.
      acc += `<g ${name ? (`id="${name}"`) : ''} style="${style}">${renderLayers(layer.layers)}</g>`;
    } else {
      acc += renderLayer(layer);
    }
    return acc;
  }, '');
}

/** The SVG markup for an image's data; toString() below is the usual way in, from an ImageBuilder */
export function toSVGString(image: SVGImage): string {
  const { width, height } = image.dimensions;
  return ('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" '
      + `viewBox="0 0 ${width} ${height}" `
      + `width="${width}px" height="${height}px">`
      + `${renderLayers(image.layers)}</svg>`
  );
}

export function toString(image: ImageBuilder): string {
  return toSVGString(image.getData());
}
