import { Primitive, StringDict } from '../tools';
import { FretBox } from '../imageRenderer';

const RegExes = {
  VALUE: /\b(\d+)(pt|px|%|em)\b/,
};

/**
 * TODO: determine minimum value... 1?
 * @param node {datatype} Description
 * @param mulitplier {int} see scale method's parameter
 * @return mixed
 */
function scaleNode(node: FretBox | Primitive, mulitplier: number): FretBox | number {
  if (typeof (node) === 'number') {
    return node * mulitplier;
  }

  if (node && typeof (node) === 'object') {
    Object
      .keys(node)
      // eslint-disable-next-line no-return-assign
      .forEach((key) => node[key] = scaleNode(node[key], mulitplier));
    return node;
  }

  // @ts-ignore-next-line
  return node;
}

/**
 * TODO: determine minimum font size... 5pt/px?
 */
function scaleFont(font: string, mulitplier: number): string {
  const matches = font.match(RegExes.VALUE);
  if (!matches || matches.length < 2) {
    return font;
  }
  const size = parseInt(matches[1], 10) * mulitplier;
  return font.replace(RegExes.VALUE, size + matches[2]);
}

/**
 * Scales the standard chord diagram's dimensions and font sizes by multiplying
 * all falues by passed in value. Note: this is currently a destructive change: no
 * backup of original values is retained.
 */
export function scale({ fonts, fretBox }: { fonts: StringDict, fretBox: FretBox }, mulitplier: number): void {
  if (mulitplier === 1.0) {
    return;
  }

  Object.keys(fonts).forEach((key) => {
    fonts[key] = scaleFont(fonts[key], mulitplier);
  });

  // Note getting x/y scaled.
  Object.assign(fretBox, scaleNode(fretBox, mulitplier) as FretBox);
}
