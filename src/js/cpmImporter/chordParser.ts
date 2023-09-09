import Dot from './classes/Dot';
import Chord from './classes/Chord';
import { log } from './errorWriter';

import { settings } from '../configs';

const RegExes = Object.freeze({
  /* eslint-disable key-spacing */
  ADD_SPLIT:         /\b(string|fret|finger)\b/,
  KEYWORDS_SPLIT:    /(\bdefine\s*:\s*|\bfrets\b|\bfingers\b|\badd\s*:\s*\b)/,
  SPACES_SPLIT:      /\s+/,

  KEYWORDS:          /.*(define|frets|fingers|add).*/g,

  TRIM:              /^\s*{\s*|\s*}\s*$/g,

  HAS_DEFINE_TAG:    /^\s*{\s*define\s*:.*}\s*$/,
  /* eslint-enable key-spacing */
});

const MUTED_CHAR = 'x';

/** Pass in integer arrays, frets is list of frets, plus corresponding fingers array */
export function toDots(frets: (number | string)[], fingers: string[]): Dot[] {
  const { tuning } = settings;

  return tuning
    .reduce((dots, ignoreMe, index) => {
      const value = frets[index];
      const fretNumber = typeof value === 'string' ? parseInt(value, 10) : value;
      if (fretNumber > 0) {
        const finger = (fingers.length - 1 >= index) ? parseInt(fingers[index], 10) : 0;
        dots.push(new Dot(index, fretNumber, finger));
      }
      return dots;
    }, [] as Dot[]);
}

function getAddIn(input: string): Dot {
  const pairs = input.split(RegExes.ADD_SPLIT);
  let key: string | null = null;
  return pairs
    .reduce((result, value) => {
      value = value.trim();
      if (!key && RegExes.ADD_SPLIT.test(value)) {
        key = value.toLowerCase();
      } else {
        if (key && value) {
          // @ts-ignore-next-line
          result[key] = parseInt(value, 10) + (key === 'string' ? -1 : 0);
        }
        key = null;
      }
      return result;
    }, {
      string: null,
      fret: null,
      finger: null,
    });
}

function getValues(input: string): (number|string)[] {
  let split = input
    .toLowerCase()
    .split(RegExes.SPACES_SPLIT);

  if (split[0].length === input.length && input.length === settings.getNumStrings()) {
    split = input.split('');
  }
  return split.map((value) => (value === MUTED_CHAR ? MUTED_CHAR : parseInt(value, 10)));
}

export function runLine(line: string): Chord | null {
  if (!RegExes.HAS_DEFINE_TAG.test(`${line}`)) {
    return null;
  }
  line = `${line || ''}`.replace(RegExes.TRIM, '');
  const pairs = line.split(RegExes.KEYWORDS_SPLIT);

  let key: string | null = null;

  const chordArrays = pairs.reduce((result, value) => {
    value = value.trim();

    if (!key && RegExes.KEYWORDS.test(value)) {
      key = value.replace(RegExes.KEYWORDS, '$1').toLowerCase();
    } else {
      if (key && value) {
        switch (key) {
          case 'add': {
            const addIn = getAddIn(value);
            if (addIn) {
              // @ts-ignore-next-line
              result.add.push(addIn);
            }
            break;
          }
          case 'define':
            result.name = value;
            break;
          default:
            // @ts-ignore-next-line
            result[key] = getValues(value);
            break;
        }
      }
      key = null;
    }

    return result;
  }, {
    name: '',
    frets: [],
    fingers: [],
    add: [],
  });

  if (!chordArrays.name) {
    log(`bad "define" instruction: chord name not found: ${line}`);
    return null;
  }

  return {
    name: chordArrays.name,
    dots: [
      ...toDots(chordArrays.frets, chordArrays.fingers),
      ...chordArrays.add.map(({ string, fret, finger }) => new Dot(string, fret, finger)),
    ],
    muted: chordArrays.frets.map((fret) => fret === MUTED_CHAR),
  };
}

export function runLines(lines: string[]): Chord[] {
  return lines
    .map((line) => runLine(line))
    .filter(Boolean) as Chord[];
}
