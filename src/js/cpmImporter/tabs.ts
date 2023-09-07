/**
 * Tablature renderer -- reads tab data and draws canvas elements.
 * Creates "packed" versions of the tabs, including a "key line" that's comprised
 * only of '-' and '*' -- the asterisks denoting where a dot will eventually be placed.
 */

import { StringArray, ExpandedTabs, TabBlock } from './interfaces/SongBlock';

import { getLastStringName, getNumStrings } from '../configs';
import { BlockTypes } from './interfaces/BlockTypesEnum';

/**
 * This is insanely long, insanely kludgy, but, insanely, it works. This will read break a block of text into
 * four lines (the ukulele strings), then find which frets are used by each. Then, the hard part, pack un-needed
 * dashes. Once it's done that a 2-dimentional array (strings X frets) is created and returned.
 * @param tabStrings {array<string>} Block of tablbabure to be parsed
 * @return {2-dimentional array}
 */
export function readTabs(tabStrings: StringArray): TabBlock {
  const hasLabels = tabStrings[getNumStrings() - 1][0] === getLastStringName();
  if (hasLabels) {
    stripStringLabels(tabStrings);
  }
  const frets = getFretNumbers(tabStrings);
  const symbols = getSymbols(tabStrings);
  const minLength = getMinLineLength(tabStrings);
  const guide = getGuideLine(symbols, minLength);

  return {
    type: BlockTypes.TabBlock,
    tabs: getPackedLines(frets, symbols, guide, minLength),
    hasLabels,
  };
}

/**
 * Processes tabStrings stripping the first character from each line
 */
function stripStringLabels(tabStrings: StringArray): void {
  for (let i = 0; i < getNumStrings(); i++) {
    tabStrings[i] = tabStrings[i].substr(1);
  }
}

/**
 * Finds the frets in use for each line. In other words, ignoring
 * spacers ("-" or "|") this returns arrays of numbers, the frets
 * in use, for each line.
 */
function getFretNumbers(tabStrings: StringArray): StringArray[] {
  // first, get the frets
  const integerRegEx = /([0-9]+)/g;
  const frets = [];
  for (let i = 0; i < getNumStrings(); i++) {
    frets[i] = tabStrings[i].match(integerRegEx) || [];
  }
  return frets;
}

/**
 * Returns array of the strings with placeholders instead of the numbers.
 * This helps us pack because "12" and "7" now occupy the same space horizontally.
 */
function getSymbols(tabStrings: StringArray): StringArray {
  // convert to symbols
  const twoDigitRegEx = /([0-9]{2})/g;
  const singleDigitRegex = /([0-9])/g;
  const symbols = [];

  // TODO: verify why using getNumStrings() instead of tabStrings.length (appears in other methods, again, do you recall why?)
  for (let i = 0; i < getNumStrings(); i++) {
    symbols[i] = tabStrings[i]
      .replace(twoDigitRegEx, '-*')
      .replace(singleDigitRegex, '*');
  }
  return symbols;
}

/**
 * Run through all of the strings (array) and return the length of the shortest one.
 * would prefer the max length, but then I'd need to pad the shorter ones and ... well, it's complicated.
 * this gets a TODO: get max!
 */
function getMinLineLength(tabStrings: StringArray): number {
  let minLength = 0;
  const trailingDashesRegEx = /-+$/gi;

  for (let i = 0; i < tabStrings.length; i++) {
    const line = tabStrings[i].trim().replace(trailingDashesRegEx, '');
    if (line.length > minLength) {
      minLength = line.length;
    }
  }
  return minLength;
}

/**
 * OK, having created symbolic representations for the lines in earlier steps
 * here we go through and "merge" them into a single, master "guide" -- saying
 * "somewhere on this beat you'll pluck (or not) one note". This normalized
 * guide will be the master for the next step.
 */
function getGuideLine(symbols: StringArray, minLength: number): string {
  // Build a master pattern "guide" and eliminate double dashes
  let guide = '';
  for (let i = 0; i < minLength; i++) {
    if (symbols[0][i] === '|') {
      guide += '|';
    } else {
      // TODO: assumes 4 strings, use getNumStrings()
      guide += ((symbols[0][i] === '*') || (symbols[1][i] === '*') || (symbols[2][i] === '*') || (symbols[3][i] === '*')) ? '*' : '-';
    }
  }
  const doubleDashRegEx = /--/g;
  guide = guide.replace(doubleDashRegEx, '- ');
  const singleDashReg = / -/g;
  let lastGuide = guide;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    guide = guide.replace(singleDashReg, '  ');
    if (guide === lastGuide) {
      break;
    }
    lastGuide = guide;
  }
  return guide;
}

/**
 * Using the packed "guide" line we loop over the strings, rebuilding each string
 * with either a space, measure marker, or the note -- as an integer! Now the frets
 * are the same regardless of whether they are single or double digit numbers:
 * a "12" occupies no more horizontal space than a "5".
 */
function getPackedLines(frets: StringArray[], symbols: StringArray, guide: string, minLength: number): ExpandedTabs {
  // pack it!
  const packed: ExpandedTabs = [];

  for (let stringIdx = 0; stringIdx < getNumStrings(); stringIdx++) {
    packed.push([]);
  }

  for (let stringIdx = 0; stringIdx < getNumStrings(); stringIdx++) { // loop over lines
    // index to single line within packed array (along a string)
    let lineIdx = 0;
    // fret marker counter
    let fretCount = 0;
    for (let guideIdx = 0; guideIdx < minLength; guideIdx++) { // loop over guide
      if (guide[guideIdx] !== ' ') {
        // a temp variable to hold the 'note'
        let chrNote = '';
        if (symbols[stringIdx][guideIdx] === '*') {
          chrNote = frets[stringIdx][fretCount];
          fretCount++;
        } else {
          chrNote = ((guide[guideIdx] === '|')) ? '|' : '-';
        }
        packed[stringIdx][lineIdx] = chrNote;
        lineIdx++;
      }
    }
  }
  return packed;
}

export const __test__ = {
  getFretNumbers,
  getGuideLine,
  getMinLineLength,
  getPackedLines,
  getSymbols,
  stripStringLabels,
};
