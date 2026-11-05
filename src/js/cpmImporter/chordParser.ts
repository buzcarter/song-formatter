import Dot from './classes/Dot';
import Chord from './classes/Chord';
import { log } from './errorWriter';

import { settings } from '../configs';

const RegExes = Object.freeze({
  /* eslint-disable key-spacing */
  ADD_SPLIT:         /\b(string|fret|finger)\b/,
  KEYWORDS_SPLIT:    /(\bdefine\s*:\s*|\bfrets\b|\bfingers\b|\badd\s*:\s*\b)/,
  SPACES_SPLIT:      /\s+/,

  // No `g` flag: a /g regex remembers where its last test() stopped (`lastIndex`) and starts
  // the next test() there, even on a different string. It only worked because the
  // replace() that followed each successful test() happened to reset it.
  KEYWORDS:          /.*(define|frets|fingers|add).*/,

  TRIM:              /^\s*{\s*|\s*}\s*$/g,

  HAS_DEFINE_TAG:    /^\s*{\s*define\s*:.*}\s*$/,
  /* eslint-enable key-spacing */
});

const MUTED_CHAR = 'x';

/** One value from a `frets` or `fingers` list: a number, or "x" for a muted string */
type FretValue = number | typeof MUTED_CHAR;

/** What a `{define: ...}` line holds, before it becomes a Chord */
interface ChordDefinition {
  name: string,
  frets: FretValue[],
  fingers: FretValue[],
  add: Dot[],
}

/** The keywords in a `{define}` line that are followed by a list of values */
type ListKeyword = 'frets' | 'fingers';

/** The keywords in an `add:` clause, e.g. `add: string 1 fret 1 finger 1` */
type AddInKeyword = 'string' | 'fret' | 'finger';

/**
 * One Dot per string that has a fret above 0 (0 is an open string, "x" a muted one).
 * @param frets one value per string
 * @param fingers one value per string; may be shorter, or empty, meaning "no finger number"
 * @param numStrings how many strings the instrument has
 */
export function toDots(frets: FretValue[], fingers: FretValue[], numStrings: number = settings.getNumStrings()): Dot[] {
  const dots: Dot[] = [];
  for (let index = 0; index < numStrings; index++) {
    const fret = frets[index];
    if (typeof fret === 'number' && fret > 0) {
      const finger = fingers[index];
      dots.push(new Dot(index, fret, typeof finger === 'number' ? finger : 0));
    }
  }
  return dots;
}

/**
 * Reads `string 1 fret 1 finger 1` into a Dot. Strings are written 1-based but stored
 * 0-based. A missing value stays `null`, as before.
 */
function getAddIn(input: string): Dot {
  const values: Record<AddInKeyword, number | null> = {
    string: null,
    fret: null,
    finger: null,
  };
  let key: AddInKeyword | null = null;
  input.split(RegExes.ADD_SPLIT).forEach((part) => {
    const value = part.trim();
    if (!key && RegExes.ADD_SPLIT.test(value)) {
      key = value.toLowerCase() as AddInKeyword; // the regex only matches the three keywords
      return;
    }
    if (key && value) {
      values[key] = parseInt(value, 10) + (key === 'string' ? -1 : 0);
    }
    key = null;
  });
  return new Dot(values.string, values.fret, values.finger);
}

/**
 * Reads a list of frets or fingers: "2 1 0 0", or without spaces, "2100", when the
 * instrument's strings each take one character.
 */
function getValues(input: string, numStrings: number): FretValue[] {
  let split = input
    .toLowerCase()
    .split(RegExes.SPACES_SPLIT);

  if (split[0].length === input.length && input.length === numStrings) {
    split = input.split('');
  }
  return split.map((value) => (value === MUTED_CHAR ? MUTED_CHAR : parseInt(value, 10)));
}

/**
 * Reads a `{define: ...}` line, e.g. `{define: Bb frets 3 2 1 1 fingers 3 2 1 1}`.
 * @param numStrings how many strings the instrument has; default: the current tuning's
 * @returns the chord, or `null` if the line isn't a define or has no chord name
 */
export function runLine(line: string, numStrings: number = settings.getNumStrings()): Chord | null {
  if (!RegExes.HAS_DEFINE_TAG.test(`${line}`)) {
    return null;
  }
  line = `${line || ''}`.replace(RegExes.TRIM, '');

  const definition: ChordDefinition = {
    name: '',
    frets: [],
    fingers: [],
    add: [],
  };
  // The split keeps the keywords, so the parts alternate: keyword, its value, keyword...
  let key: string | null = null;
  line.split(RegExes.KEYWORDS_SPLIT).forEach((part) => {
    const value = part.trim();
    if (!key && RegExes.KEYWORDS.test(value)) {
      key = value.replace(RegExes.KEYWORDS, '$1').toLowerCase();
      return;
    }
    if (key && value) {
      switch (key) {
        case 'add':
          definition.add.push(getAddIn(value));
          break;
        case 'define':
          definition.name = value;
          break;
        default:
          definition[key as ListKeyword] = getValues(value, numStrings); // KEYWORDS only matches these
          break;
      }
    }
    key = null;
  });

  if (!definition.name) {
    log(`bad "define" instruction: chord name not found: ${line}`);
    return null;
  }

  return {
    name: definition.name,
    dots: [
      ...toDots(definition.frets, definition.fingers, numStrings),
      ...definition.add,
    ],
    muted: definition.frets.map((fret) => fret === MUTED_CHAR),
  };
}

/** Reads every `{define}` line; other lines are skipped */
export function runLines(lines: string[], numStrings?: number): Chord[] {
  return lines
    .map((line) => runLine(line, numStrings))
    .filter((chord): chord is Chord => chord !== null);
}
