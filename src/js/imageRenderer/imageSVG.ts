/**
 * Converts image JSON data to SVG XML.
 * Limits: no checks for unique Ids.
 */

import {
  LayerTypes,
  StyleDef,
  SVGImage, SVGLayer,
  CircleSVGLayer, GroupSVGLayer, LineSVGLayer, RectangleSVGLayer, TextSVGLayer,
} from './interfaces/SVGImage';
import { ImageBuilder } from './classes/ImageBuilder';

function getStyle(type: LayerTypes, style: StyleDef): string | null {
  if (!style) {
    return null;
  }

  let result = Object.keys(style)
    .reduce((acc, key) => {
      let property: string | null;
      let value: string | null;
      value = style[key];
      switch (key) {
        case 'fillColor':
          property = 'fill';
          break;
        case 'fontFamily':
          property = 'font';
          break;
        case 'textAlign':
          property = 'text-anchor';
          switch (value) {
            case 'right':
              value = 'end';
              break;
            case 'left':
              value = 'start';
              break;
            default:
              value = 'middle';
          }
          break;
        case 'strokeColor':
          property = 'stroke';
          break;
        case 'strokeWidth':
          property = 'stroke-width';
          break;
        default:
          property = null;
      }

      return (property && value)
        ? `${acc}${property}:${value};`
        : acc;
    }, '');

  if (type === LayerTypes.TEXT && !style.textAlign) {
    result += 'text-anchor:middle;';
  }

  return result;
}

// type guards
const isCircle = (shape: SVGLayer): shape is CircleSVGLayer => shape.type === LayerTypes.CIRCLE;
const isGroup = (shape: SVGLayer): shape is GroupSVGLayer => shape.type === LayerTypes.GROUP;
const isLine = (shape: SVGLayer): shape is LineSVGLayer => shape.type === LayerTypes.LINE;
const isRectangle = (shape: SVGLayer): shape is RectangleSVGLayer => shape.type === LayerTypes.RECTANGLE;
const isText = (shape: SVGLayer): shape is TextSVGLayer => shape.type === LayerTypes.TEXT;

function renderLayer(layer: SVGLayer): string {
  let style = layer.style ? getStyle(layer.type, layer.style) : '';
  style = style ? `style="${style}"` : '';

  if (isCircle(layer)) {
    return `<circle cx="${layer.center.x}" cy="${layer.center.y}" r="${layer.radius}" ${style} />`;
  }
  if (isLine(layer)) {
    return `<line x1="${layer.endPoints[0].x}" y1="${layer.endPoints[0].y}" x2="${layer.endPoints[1].x}" y2="${layer.endPoints[1].y}" ${style} />`;
  }
  if (isRectangle(layer)) {
    return `<rect x="${layer.pos.x}" y="${layer.pos.y}" width="${layer.width}" height="${layer.height}" ${style} />`;
  }
  if (isText(layer)) {
    return `<text x="${layer.pos.x}" y="${layer.pos.y}" ${style}>${layer.text}</text>`;
  }
  return '';
}

function renderLayers(layers: SVGLayer[]): string {
  return layers.reduce((acc: string, layer) => {
    if (isGroup(layer)) {
      const { name } = layer;
      const style = layer.style ? getStyle(LayerTypes.GROUP, layer.style) : '';
      // TODO: what was intent 15 years ago, bud? "renderLayers(layer.layers, layer.style)"
      acc += `<g ${name ? (`id="${name}"`) : ''} style="${style}">${renderLayers(layer.layers)}</g>`;
    } else {
      acc += renderLayer(layer);
    }
    return acc;
  }, '');
}

function toSVGString(image: SVGImage): string {
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

export function appendChild(element: HTMLElement, image: ImageBuilder, className: string): HTMLElement {
  const wrapper = document.createElement('span');
  if (className) {
    wrapper.classList.add(className);
  }
  wrapper.innerHTML = toSVGString(image.getData());
  element.appendChild(wrapper);
  return wrapper;
}
