import { StringDict } from '../tools';
import { FretBox } from '../imageRenderer';

const RegExes = {
  VALUE: /\b(\d+)(pt|px|%|em)\b/,
};

/** The FretBox sizes that scale; `topLeftPos` scales too, see scale() */
const SCALED_SIZES = [
  'height', 'width', 'fretSpace', 'stringSpace', 'dotRadius', 'lineWidth', 'xWidth', 'xStroke',
] as const;

/**
 * TODO: determine minimum font size... 5pt/px?
 */
function scaleFont(font: string, multiplier: number): string {
  const matches = font.match(RegExes.VALUE);
  if (!matches || matches.length < 2) {
    return font;
  }
  const size = parseInt(matches[1], 10) * multiplier;
  return font.replace(RegExes.VALUE, size + matches[2]);
}

/**
 * Scales the standard chord diagram's dimensions and font sizes by multiplying
 * all values by the passed in value. Note: this is currently a destructive change: no
 * backup of original values is retained.
 */
export function scale({ fonts, fretBox }: { fonts: StringDict, fretBox: FretBox }, multiplier: number): void {
  if (multiplier === 1.0) {
    return;
  }

  Object.keys(fonts).forEach((key) => {
    fonts[key] = scaleFont(fonts[key], multiplier);
  });

  // (This used to walk every key of fretBox recursively, scaling whatever was a number, which
  // needed FretBox to allow any key. Listing them says which values change.)
  SCALED_SIZES.forEach((key) => {
    fretBox[key] *= multiplier;
  });
  fretBox.topLeftPos.x *= multiplier;
  fretBox.topLeftPos.y *= multiplier;
}
