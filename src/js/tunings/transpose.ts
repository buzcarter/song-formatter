/**
 * Can shift a single chord or list of chords up/down by a series of steps. Hangles
 * finding equivalent chord names (i.e. A# is same as Bb)
 */
import { getChords } from './definitions';

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
  // TODO: negative steps are allowed!!!
  if (tone < 0) {
    tone += 12;
  }

  // TODO: this is nuts? reduce????
  const result = Object.keys(NoteToToneMap)
    .filter((key) => tone === NoteToToneMap[key])
    .reduce((acc, key) => key + toneInfo.suffix);

  return result || null;
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

  const { prefix, suffix } = matches.groups;
  return {
    tone: NoteToToneMap[prefix],
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
 * returns copy of `chordNames`, each chord shifted by `semitoneSteps` steps (up or down)
 */
export const shiftChords = (chordNames: string[], semitoneSteps: number): string[] => chordNames
  .map((c) => shift(c, semitoneSteps))
  .filter(Boolean) as string[];
