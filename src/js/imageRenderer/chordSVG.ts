import { Position } from './interfaces/SVGImage';
import FretBox from './interfaces/FretBox';
import ImageBuilder from './classes/ImageBuilder';

import { StringDict, integer } from '../tools';
import { Chord, Dot } from '../cpmImporter';
import { settings } from '../configs';

export function generateChordSvg(chord: Chord, fretBox: FretBox, fontSettings: StringDict, colorSettings: StringDict): ImageBuilder | null {
  if (!fontSettings) {
    fontSettings = settings.fonts;
  }
  if (!colorSettings) {
    colorSettings = settings.colors;
  }

  const { numFrets = 5 } = settings;
  const { dotRadius } = fretBox;

  // starting top-left position for chord diagram
  const pos = {
    x: fretBox.topLeftPos.x,
    y: fretBox.topLeftPos.y,
  };

  const img = newFretboard(pos, fretBox, settings.getNumStrings(), numFrets, colorSettings.fretLines);

  // find where the circle centers should be:
  const centers = {
    x: pos.x,
    y: pos.y + dotRadius,
  };

  // find the vertical shift by dividing the freespace between top and bottom (freespace is the row height less circle diameter)
  const fudgeY = (fretBox.fretSpace - 2 * dotRadius) / 2;
  const fretRange = getFretRange(chord.dots);
  const firstFret = fretRange.last <= numFrets ? 1 : fretRange.last - (numFrets - 1);

  if (Array.isArray(chord.dots)) {
    // now add Dots (with finger numbers, if present)
    chord.dots.forEach((dot) => {
      const stringNbr = dot.string || 0;

      const dotPos = {
        x: (centers.x + stringNbr * fretBox.stringSpace),
        y: (fudgeY + centers.y + ((dot.fret ? dot.fret : 0) - firstFret) * fretBox.fretSpace),
      };

      img.circle(dotPos.x, dotPos.y, dotRadius).setStyle({
        fillColor: colorSettings.dots,
      });

      // check that the dot's radius isn't stupidly small
      if (dot.finger && dot.finger > 0 && fretBox.showText && dotRadius > 4) {
        img.text(dotPos.x, dotPos.y + 5, dot.finger.toString()).setStyle({
          fillColor: colorSettings.dotText,
          fontFamily: fontSettings.dot,
        });
      }
    });
  }

  // If the chord is above the normal first 5 frets we need to add labels for the first and last frets
  if (firstFret !== 1) {
    // Label the starting and ending frets (0-12). It's assumed that the fretboard covers frets 1-5 (or `numFrets`).
    // If instead the top fret is 6, say, well, this is the method called to add that "6".
    // The Y position calculation is a bit klunky. How big of a fret range is present in the chord?
    const txtPos = {
      x: 0,
      y: pos.y + fretBox.fretSpace * (0.96 * (numFrets - (fretRange.last - fretRange.first))),
      // Old Y caculcation: pos.y + (0.8 * fretBox.fretSpace)
    };
    img.text(txtPos.x, txtPos.y, fretRange.first.toString()).setStyle({
      fontFamily: fontSettings.fret,
      fillColor: colorSettings.fretText,
      textAlign: 'left',
    });

    // no point in double plotting a fret (i.e. barred 8th fret) so only add second label if
    // first and last frets are different. Also, it's odd to see both 8 & 9, so only show if there's
    // at least one fret between first and last (i.e. 8 & 10)
    if ((fretRange.last - fretRange.first) > 1) {
      txtPos.y = pos.y + (4.8 * fretBox.fretSpace);
      img.text(txtPos.x, txtPos.y, fretRange.last.toString()).setStyle({
        fontFamily: fontSettings.fret,
        fillColor: colorSettings.fretText,
        textAlign: 'left',
      });
    }
  }

  // TODO: top offset
  if (fretBox.showText) {
    img.text((pos.x + 1.5 * fretBox.stringSpace), (pos.y - 5), chord.name).setStyle({
      fontFamily: fontSettings.text,
      fillColor: colorSettings.text,
    });
  }

  mutedStrings(img, fretBox, chord.muted, colorSettings.xStroke);
  return img;
}

/** When requested diminsions won't accomodate other settings force adjustments. Allow for padding for text above and on sides. */
function adjustDimensions(width: number, height: number, numStrings: integer, numFrets: integer, fretSpace: integer, stringSpace: integer): {
    width: number,
    height: number,
  } {
  const requiredWidth = (numStrings + 0.9) * stringSpace;
  const requiredHeight = (numFrets + 1.3) * fretSpace;

  return {
    width: requiredWidth < width ? width : requiredWidth,
    height: requiredHeight < height ? height : requiredHeight,
  };
}

function newFretboard(
  { x: topX, y: topY }: Position,
  { width, height, lineWidth, fretSpace, stringSpace }: FretBox,
  numStrings: integer,
  numFrets: integer,
  fretColor: string = '#000',
): ImageBuilder {
  // width offset, a "subpixel" adjustment
  const offset = lineWidth / 2;
  const stringLinesHeight = numFrets * fretSpace;
  const fretLinesWidth = (numStrings - 1) * stringSpace;

  const newDims = adjustDimensions(width, height, numStrings, numFrets, fretSpace, stringSpace);

  const fretboard = new ImageBuilder()
    .newImage(newDims.width, newDims.height)
    .newGroup('fretboard')
    .setStyle({
      fillColor: 'none',
      strokeColor: fretColor,
      strokeWidth: lineWidth.toString(),
    });

  // add middle strings
  for (let i = 1; i < numStrings - 1; i++) {
    const lineX = topX + i * stringSpace + offset;
    fretboard.vLine(lineX, topY + offset, stringLinesHeight);
  }
  // add frets
  for (let i = 1; i < numFrets; i++) {
    const lineX = topY + i * fretSpace + offset;
    fretboard.hLine(topX + offset, lineX, fretLinesWidth);
  }

  // The border/rectangle takes care of first & last strings & frets
  return fretboard
    .rectangle(topX + offset, topY + offset, fretLinesWidth, stringLinesHeight)
    .endGroup();
}

/** TODO: Loop over the muted array, dropping X's whenever a string position is `true` */
function mutedStrings(img: ImageBuilder, fretBox: FretBox, muted: boolean[] | null, strokeColor: string): void {
  const { lineWidth, topLeftPos } = fretBox;

  const x = topLeftPos.x + lineWidth / 2;
  const y = topLeftPos.y + lineWidth / 4;

  muted?.forEach((isMuted, i: number) => {
    if (isMuted) {
      drawX(img, {
        x: x + i * fretBox.stringSpace,
        y,
      }, fretBox, strokeColor);
    }
  });
}

/** Plots an "X" centered at POSITION */
function drawX(img: ImageBuilder, pos: Position, fretBox: FretBox, strokeColor: string): void {
  const { xWidth } = fretBox;
  const x = pos.x - xWidth / 2;
  const y = pos.y - xWidth / 2;

  img
    .newGroup('X')
    .setStyle({
      strokeColor: strokeColor || 'black',
      strokeWidth: fretBox.xStroke.toString(),
    })
    .line(x, y, x + xWidth, y + xWidth)
    .line(x, y + xWidth, x + xWidth, y)
    .endGroup();
}

/** Returns first & last frets, 0 if none found. */
function getFretRange(dots: Dot[]): {
  first: number,
  last: number
} {
  let max = -1;
  let min = 300;

  dots?.forEach((dot) => {
    if (dot.fret && dot.fret > max) {
      max = dot.fret;
    }
    if (dot.fret && dot.fret < min) {
      min = dot.fret;
    }
  });

  return {
    first: (min < 300) ? min : 0,
    last: (max > 0) ? max : 0,
  };
}

export const __test__ = {
  newFretboard,
};
