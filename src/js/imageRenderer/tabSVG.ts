import ImageBuilder from './classes/ImageBuilder';
import { toString } from './imageSVG';
import { Position } from './interfaces/SVGImage';

import { settings, getNumStrings } from '../configs';
import { ExpandedTabs, TabBlock } from '../cpmImporter';

const { tabs: tabSettings } = settings;

/**
 * Create the staff -- really the four tablature strings
 */
function drawStaff(img: ImageBuilder, pos: Position, length: number): void {
  const offset = tabSettings.lineWidth / 2;
  const x = pos.x + offset;
  let y = pos.y + offset;
  const staff = img
    .newGroup('staff')
    .setStyle({
      strokeColor: tabSettings.lineColor,
      strokeWidth: `${tabSettings.lineWidth}`,
    });
  for (let i = 0; i < getNumStrings(); i++) {
    staff.hLine(x, y, length);
    y += tabSettings.lineSpacing;
  }
  staff.endGroup();
}

/**
 * @param isTruncate If `true` returns the length of the line, allowing
 * for a terminating "|" character, othwrwise, it's for image width
 */
function getWidth(tabs: ExpandedTabs, labelOffset: number, isTruncate: boolean): number {
  if (!isTruncate) {
    return (tabSettings.noteSpacing * tabs[0].length) + labelOffset + tabSettings.dotRadius;
  }

  let len = tabs[0].length;
  let plusDot = tabSettings.dotRadius;
  if (tabs[0][len - 1] === '|') {
    // TODO: too much??? retest
    len -= 1;
    plusDot = 0;
  }

  return tabSettings.noteSpacing * len + labelOffset + plusDot;
}

/**
 * Loop over the normalized tabs emitting the dots/fingers on the passed in SVG
 * @param tabs {array} Array of normalized string data -- space (character) or int (fret number)
 * @param lineWidth Length in pixels (used only when line ends with a measure mark)
 */
function drawNotes(img: ImageBuilder, pos: Position, tabs: ExpandedTabs, lineWidth: number): void {
  const center: Position = {
    x: 0,
    y: pos.y,
  };

  const numberOfStrings = settings.getNumStrings();
  tabs
    .filter((tab, stringIndex) => stringIndex < numberOfStrings)
    .forEach((tab) => {
      center.x = pos.x;
      tab.forEach((char, charIndex) => {
        // (c !== '-'){
        if (char === '|') {
          const jnum = charIndex; // parseInt(chrIdx, 10);
          const heavy = (((jnum + 1) < (tab.length - 1)) && (tab[jnum + 1] === '|')) || ((jnum === (tab.length - 1)) && (tab[jnum - 1] === '|'));
          drawMeasure(img, {
            x: (charIndex === tab.length - 1) ? pos.x + lineWidth : center.x,
            y: pos.y,
          }, heavy);
        // eslint-disable-next-line no-restricted-globals
        } else if (!isNaN(parseInt(char, 10))) {
          img
            .circle(center.x, center.y, tabSettings.dotRadius)
            .setStyle({
              fillColor: tabSettings.dotColor,
            });
          img
            .text(center.x, center.y + 0.5 * tabSettings.dotRadius, char)
            .setStyle({
              fontFamily: tabSettings.textFont,
              fillColor: tabSettings.textColor,
            });
        }
        center.x += tabSettings.noteSpacing;
      });

      center.y += tabSettings.lineSpacing;
    });
}

/**
 * Draws a vertical "measure" demarcation line
 */
function drawMeasure(img: ImageBuilder, pos: Position, isHeavyStroke: boolean): void {
  const offset = tabSettings.lineWidth / 2;
  img
    .vLine(pos.x + offset, pos.y, (getNumStrings() - 1) * tabSettings.lineSpacing)
    .setStyle({
      strokeColor: tabSettings.lineColor,
      strokeWidth: `${(isHeavyStroke ? 4.5 : 1) * tabSettings.lineWidth}`,
    });
}

/**
 * Adds the string letters on the left-side of the chord diagram, before
 * the tablature string lines, ex. ['A','E','C','G'];
 */
function drawLabels(img: ImageBuilder, pos: Position): void {
  const labels = settings.tuning.slice(0).reverse();
  for (let i = 0; i < getNumStrings(); i++) {
    img.text(1, (pos.y + (i + 0.3) * tabSettings.lineSpacing), labels[i]).setStyle({
      fontFamily: tabSettings.labelFont,
      fillColor: tabSettings.lineColor,
      textAlign: 'left',
    });
  }
}

export function generateTabSvg({ hasLabels, tabs }: TabBlock): string {
  const labelOffset = (hasLabels) ? tabSettings.labelWidth : 0;
  // how much space?
  const height = ((getNumStrings() - 1) * tabSettings.lineSpacing) + (2 * tabSettings.dotRadius) + tabSettings.bottomPadding;

  const img = new ImageBuilder().newImage(getWidth(tabs, labelOffset, false), height);
  const pos = {
    x: tabSettings.dotRadius + labelOffset,
    y: 1 + tabSettings.dotRadius,
  };
  const lineWidth = getWidth(tabs, labelOffset, true);
  drawStaff(img, pos, lineWidth);
  drawNotes(img, pos, tabs, lineWidth);
  if (hasLabels) {
    drawLabels(img, pos);
  }

  return toString(img);
}
