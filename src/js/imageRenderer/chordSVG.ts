import { Position } from './interfaces/SVGImage';
import FretBox from './interfaces/FretBox';
import ImageBuilder from './classes/ImageBuilder';
import { appendChild as appendSvgChild } from './imageSVG';

import { StringDict } from '../tools';
import { Chord, Dot } from '../cpmImporter';
import { settings } from '../configs';

const Styles = {
  CHORD_IMG: 'ugs-diagrams--chord-img',
};

/**
 * Puts a new Canvas within ChordBox and draws the chord diagram on it.
 * @param chordBox Handle to the DOM element where the chord is to be drawn.
 * @param chord Chord Diagram to be drawn.
 * @param fretBox Appropriate ukeGeeks.settings.fretBox -- either "fretBox" or "inlineFretBox"
 * @param fontSettings (optional) Defaults to settings.fonts
 * @param colorSettings (optional) Defaults to settings.colors
 */
export function plot(chordBox: HTMLElement, chord: Chord, fretBox: FretBox, fontSettings: StringDict, colorSettings: StringDict): void {
  const img = generateChordSvg(chord, fretBox, fontSettings, colorSettings);
  if (!img) {
    return;
  }
  appendSvgChild(chordBox, img, Styles.CHORD_IMG);
}

export function generateChordSvg(chord: Chord, fretBox: FretBox, fontSettings: StringDict, colorSettings: StringDict): ImageBuilder | null {
  const img = new ImageBuilder().newImage(fretBox.width, fretBox.height);
  if (!img) {
    return null;
  }

  if (!fontSettings) {
    fontSettings = settings.fonts;
  }
  if (!colorSettings) {
    colorSettings = settings.colors;
  }

  // starting top-left position for chord diagram
  const pos = {
    x: fretBox.topLeftPos.x,
    y: fretBox.topLeftPos.y,
  };
  drawFretboard(img, pos, fretBox, colorSettings.fretLines);
  // find where the circle centers should be:
  const centers = {
    x: pos.x,
    y: pos.y + fretBox.dotRadius,
  };

  // find the vertical shift by dividing the freespace between top and bottom (freespace is the row height less circle diameter)
  const fudgeY = (fretBox.fretSpace - 2 * fretBox.dotRadius) / 2;
  const fretRange = getFretRange(chord.dots);
  const firstFret = (fretRange.last <= 5) ? 1 : fretRange.last - 4;

  if (Array.isArray(chord.dots)) {
    // now add Dots (with finger numbers, if present)
    chord.dots.forEach((dot) => {
      const s = dot.string || 0;
      const p = {
        x: (centers.x + s * fretBox.stringSpace),
        y: (fudgeY + centers.y + ((dot.fret ? dot.fret : 0) - firstFret) * fretBox.fretSpace),
      };
      img.circle(p.x, p.y, fretBox.dotRadius).setStyle({
        fillColor: colorSettings.dots,
      });
      // check that the dot's radius isn't stupidly small
      if (dot.finger && dot.finger > 0 && fretBox.showText && fretBox.dotRadius > 4) {
        img.text(p.x, p.y + 5, dot.finger.toString()).setStyle({
          fillColor: colorSettings.dotText,
          fontFamily: fontSettings.dot,
        });
      }
    });
  }

  // If the chord is above the normal first 5 frets we need to add labels for the first and last frets
  if (firstFret !== 1) {
    // Label the starting and ending frets (0-12). It's assumed that the fretboard covers frets 1-5.
    // If instead the top fret is 6, say, well, this is the method called to add that "6".
    // The Y position calculation is a bit klunky. How big of a fret range is present in the chord?
    const txtPos = {
      x: 0,
      y: pos.y + fretBox.fretSpace * (0.96 * (5.0 - (fretRange.last - fretRange.first))),
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

function drawFretboard(img: ImageBuilder, pos: Position, fretBox: FretBox, fretColor: string = '#000'): void {
  // width offset, a "subpixel" adjustment
  const offset = fretBox.lineWidth / 2;
  const stringHeight = settings.numFrets * fretBox.fretSpace;
  const fretWidth = 3 * fretBox.stringSpace;

  const fretboard = img
    .newGroup('fretboard')
    .setStyle({
      fillColor: 'none',
      strokeColor: fretColor,
      strokeWidth: fretBox.lineWidth.toString(),
    });

  // add "C" & "E" strings
  for (let i = 1; i < 3; i++) {
    const x = pos.x + i * fretBox.stringSpace + offset;
    fretboard.vLine(x, pos.y + offset, stringHeight);
  }
  // add frets
  for (let i = 1; i < settings.numFrets; i++) {
    const y = pos.y + i * fretBox.fretSpace + offset;
    fretboard.hLine(pos.x + offset, y, fretWidth);
  }

  fretboard
    .rectangle(pos.x + offset, pos.y + offset, fretWidth, stringHeight)
    .endGroup();
}

/**
 * TODO: Loop over the muted array, dropping X's whenever a string position is `true`
 * @param muted    Is this string "muted"?
 * @param strokeColor Valid CSS hex color (shorthand not recommended)
 */
function mutedStrings(img: ImageBuilder, fretBox: FretBox, muted: boolean[] | null, strokeColor: string): void {
  const x = fretBox.topLeftPos.x + fretBox.lineWidth / 2;
  const y = fretBox.topLeftPos.y + fretBox.lineWidth / 4;
  muted?.forEach((isMuted, i: number) => {
    if (isMuted) {
      drawX(img, {
        x: x + i * fretBox.stringSpace,
        y,
      }, fretBox, strokeColor);
    }
  });
}

/**
 * Plots an "X" centered at POSITION
 * @param  {JSON} fretBox  See Settings.fretBox
 * @param  {string} strokeColor Valid CSS hex color (shorthand not recommended)
 */
function drawX(img: ImageBuilder, pos: Position, fretBox: FretBox, strokeColor: string): void {
  const x = pos.x - fretBox.xWidth / 2;
  const y = pos.y - fretBox.xWidth / 2;

  img
    .newGroup('X')
    .setStyle({
      strokeColor: strokeColor || 'black',
      strokeWidth: fretBox.xStroke.toString(),
    })
    .line(x, y, x + fretBox.xWidth, y + fretBox.xWidth)
    .line(x, y + fretBox.xWidth, x + fretBox.xWidth, y)
    .endGroup();
}

/**
 * Returns first & last frets, 0 if none found.
 */
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
