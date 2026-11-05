/**
 * Tablature renderer -- reads tab data and draws canvas elements.
 * Creates "packed" versions of the tabs, including a "key line" that's comprised
 * only of '-' and '*' -- the asterisks denoting where a dot will eventually be placed.
 */
import { StringArray, ExpandedTabs, TabBlock, TabStaff } from './interfaces/SongBlock';
import { BlockTypes } from './interfaces/BlockTypesEnum';

import { getLastStringName, getNumStrings } from '../configs';

const RegExes = Object.freeze({
  /* eslint-disable key-spacing */
  INT:              /(\d+)/g,

  TWO_DIGITS:       /(\d{2})/g,
  ONE_DIGIT:        /(\d)/g,

  DOUBLE_DASH:      /--/g,
  SINGLE_DASH:      / -/g,
  TRAILING_DASH:    /-+$/g,
  /* eslint-enable key-spacing */
});

/**
 * Reads the lines of a `{start_of_tab}` block. Every `getNumStrings()` lines make one staff,
 * so a block can hold several staves; lines left over at the end that don't make a whole
 * staff are ignored, as the old library did. (Only the first staff used to be drawn.)
 * @param lines the block's lines, trimmed, without blank lines
 */
export function readTabBlock(lines: StringArray): TabBlock {
  const numStrings = getNumStrings();
  const staves: TabStaff[] = [];
  for (let i = 0; i + numStrings <= lines.length; i += numStrings) {
    staves.push(readTabs(lines.slice(i, i + numStrings)));
  }
  return {
    type: BlockTypes.TabBlock,
    staves,
  };
}

/**
 * This is insanely long, insanely kludgy, but, insanely, it works. This will read break a block of text into
 * four lines (the ukulele strings), then find which frets are used by each. Then, the hard part, pack un-needed
 * dashes. Once it's done that a 2-dimentional array (strings X frets) is created and returned.
 * @param tabStrings One staff: exactly one line per string
 */
export function readTabs(tabStrings: StringArray): TabStaff {
  // The bottom line starts with the lowest string's name, e.g. "G|--", if there are labels
  const hasLabels = tabStrings[getNumStrings() - 1]?.[0] === getLastStringName();
  if (hasLabels) {
    stripStringLabels(tabStrings);
  }
  const frets = getFretNumbers(tabStrings);
  const symbols = getSymbols(tabStrings);
  const minLength = getMinLineLength(tabStrings);
  const guide = getGuideLine(symbols, minLength);

  return {
    tabs: getPackedLines(frets, symbols, guide, minLength),
    hasLabels,
  };
}

/**
 * Processes tabStrings stripping the first character from each line
 */
function stripStringLabels(tabStrings: StringArray): void {
  tabStrings
    .forEach((string, i) => {
      tabStrings[i] = string.substr(1);
    });
}

/**
 * Finds the frets in use for each line. In other words, ignoring
 * spacers ("-" or "|") this returns arrays of numbers, the frets
 * in use, for each line.
 */
function getFretNumbers(tabStrings: StringArray): StringArray[] {
  const frets = [];
  for (let i = 0; i < getNumStrings(); i++) {
    frets[i] = tabStrings[i]?.match(RegExes.INT) || [];
  }
  return frets;
}

/**
 * Returns array of the strings with placeholders instead of the numbers.
 * This helps us pack because "12" and "7" now occupy the same space horizontally.
 */
function getSymbols(tabStrings: StringArray): StringArray {
  return tabStrings
    .slice(0, getNumStrings())
    .reduce((symbols: StringArray, sym) => {
      symbols.push(sym
        .replace(RegExes.TWO_DIGITS, '-*')
        .replace(RegExes.ONE_DIGIT, '*'));
      return symbols;
    }, []);
}

/**
 * Despite the name, this returns the LONGEST line's length (trailing dashes don't count),
 * so the TODO that used to be here, "get max!", is done. Shorter lines don't need padding:
 * getPackedLines() treats the missing end of a line as dashes.
 */
function getMinLineLength(tabStrings: StringArray): number {
  return tabStrings
    .slice(0, getNumStrings())
    .reduce((minLength, line) => {
      line = line.trim().replace(RegExes.TRAILING_DASH, '');
      if (line.length > minLength) {
        minLength = line.length;
      }
      return minLength;
    }, 0);
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
    if (symbols[0]?.[i] === '|') {
      guide += '|';
    } else {
      guide += symbols.some((sym) => sym[i] === '*') ? '*' : '-';
    }
  }

  guide = guide.replace(RegExes.DOUBLE_DASH, '- ');
  let lastGuide = guide;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    guide = guide.replace(RegExes.SINGLE_DASH, '  ');
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
  const packed = Array(getNumStrings()).fill('*').map((): string[] => []);
  packed
    .forEach((line, stringIdx) => {
      // index to single line within packed array (along a string)
      let lineIdx = 0;

      // fret marker counter
      let fretCount = 0;

      guide
        .split('')
        .slice(0, minLength)
        .forEach((char, guideIdx) => {
          if (char === ' ') {
            return;
          }
          // a temp variable to hold the 'note'
          let chrNote = '';
          if (symbols[stringIdx]?.[guideIdx] === '*') {
            chrNote = frets[stringIdx]?.[fretCount] ?? '';
            fretCount++;
          } else {
            chrNote = char === '|' ? '|' : '-';
          }
          line[lineIdx] = chrNote;
          lineIdx++;
        });
    });

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
