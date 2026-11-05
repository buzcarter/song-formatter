/**
 * Can shift a single chord or list of chords up/down by a series of steps. Hangles
 * finding equivalent chord names (i.e. A# is same as Bb)
 */
import { getChords } from './chordDefinitions';

import { NumberDict } from '../tools';

export interface RetuneMap {
  original: string,
  transposed: string,
}

interface ToneThing{
  tone: number,
  prefix: string,
  suffix: string,
}

const RegExes = {
  CHORD_NAME: /^(?<prefix>[A-G][#b]?)(?<suffix>.*)/,
};

/* eslint-disable key-spacing */
const NoteToToneMap: NumberDict = Object.freeze({
  A:      0,
  'A#':   1,
  Bb:     1,
  B:      2,
  C:      3,
  'C#':   4,
  Db:     4,
  D:      5,
  'D#':   6,
  Eb:     6,
  E:      7,
  F:      8,
  'F#':   9,
  Gb:     9,
  G:     10,
  'G#':  11,
  Ab:    11,
});
/* eslint-enable key-spacing */

/**
   * Pass in a chord name returns new chord name for the original chord shifted by "steps" semitones.
  * @param name chord name, should be in chord dictionary
  * @param steps number of semitones to transpose
  */
export function shift(name: string, steps: number = 0): string | null {
  const toneInfo = getTone(name);
  if (toneInfo === null) {
    return null;
  }
  let tone = (toneInfo.tone + steps) % 12;
  // `%` keeps the sign in JavaScript (-5 % 12 is -5), so wrap negative steps back into 0-11
  if (tone < 0) {
    tone += 12;
  }

  // Several names can share a tone (A# and Bb are both 1). Like the old library, use the
  // first one in NoteToToneMap, which is the sharp. (This used to be a `reduce` with no
  // starting value: it returned the LAST name, a flat, and when only one name matched,
  // such as "B", reduce never called its callback, so the suffix was lost: Em -5 -> "B".)
  const note = Object.keys(NoteToToneMap).find((key) => NoteToToneMap[key] === tone);

  return note ? note + toneInfo.suffix : null;
}

/**
 * Returns object with name (A - G with flat/sharp), integer value (0 - 11), and its "suffix" (minor, 7th, etc)
 */
export function getTone(name: string): ToneThing | null {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const matches = name.match(RegExes.CHORD_NAME);
  if (!matches?.groups) {
    return null;
  }

  const { prefix = '', suffix = '' } = matches.groups;
  const tone = NoteToToneMap[prefix];
  // e.g. "Cb" or "E#": a valid prefix for the regex, but not in NoteToToneMap
  if (tone === undefined) {
    return null;
  }
  return {
    tone,
    prefix,
    suffix,
  };
}

/**
 * Returns a mapping -- an array of JSON with "original" chord name and "transposed" chord names.
 */
export function retune(offset: number | undefined): RetuneMap[] {
  offset = offset || 0;
  const hasOffset = offset === 0;

  return getChords()
    .map((chord) => ({
      original: chord.name,
      transposed: hasOffset ? chord.name : shift(chord.name, offset) || '',
    }));
}

/**
 * returns copy of `chordNames`, each chord shifted by `semitoneSteps` steps (up or down).
 * A name that can't be transposed (e.g. "N.C.") becomes `null`, so the result always lines
 * up with `chordNames`, as in the old library. (It used to drop them, shifting the rest.)
 */
export const shiftChords = (chordNames: string[], semitoneSteps: number): (string | null)[] => chordNames
  .map((c) => shift(c, semitoneSteps));
