/**
 * Defines chords and provides simple lookup (find) tools.
 */
import { retune, RetuneMap } from './transpose';
import { integer, StringDict } from '../tools';
import { Chord, runBlock } from '../cpmImporter';

/**
 * local substitions (replacements for identical chord shapes)
 */
export const chordNameAliases: StringDict = Object.freeze({
  'A#': 'Bb',
  Db: 'C#',
  'D#': 'Eb',
  Gb: 'F#',
  Ab: 'G#',
});

/**
 * Block of CPM text, expects to find these tags: `instrument`, `tuning`, and one or more `define` statements.
 */
const instruments: string[] = [];

/**
 * Array of "user" defined chords, in compactChord format. Use "Add" method.
 */
let userChords: Chord[] = [];
let chordCache: Chord[] = [];
let globalOffset = 0;
let retuneMap: RetuneMap[] = [];

/**
 * Define an instrument's chord dictionary, this makes this instrument avaiable for showing its chord diagrams.
 */
export const addInstrument = (definitions: string | string[]): number => instruments.push(Array.isArray(definitions) ? definitions.join('\n') : definitions) - 1;

/** Choose which instrument's chord dictionary is used used for chord diagrams. */
export function useInstrument(offset: integer | string) {
  setInstrument(0, offset);
}

export function setInstrument(instrumentIndex: integer, offset: integer | string = 0) {
  globalOffset = typeof offset === 'string' ? parseInt(offset, 10) : offset;
  if (globalOffset > 0) {
    retuneMap = retune(globalOffset);
  }
  const text = instruments[instrumentIndex];
  if (!text) {
    // TODO: log error!!!
    return;
  }

  const instrument = runBlock(text);
  setChords(instrument.chords);
}

/**
 * Returns expanded ChordObject for requested "chord"
 */
export function get(chordName: string): Chord | null {
  // try User Defined chords first
  const match = userChords.find((c) => c.name === chordName);
  if (match) {
    return match;
  }

  // next: built-in chords:
  if (globalOffset < 1) {
    return underscoreGet(chordName);
  }

  // user has retuned the chords, need to find chord name "as-is",
  // but get the fingering from the mapping
  const name = getAlias(chordName);

  return retuneMap
    .filter((t) => name === t.original)
    .map((t) => underscoreGet(t.transposed))
    .filter(Boolean)
    .reduce((acc, c) => Object.assign(
      new Chord(chordName),
      c && {
        dots: c.dots,
        muted: c.muted,
      }), null) || null;
}

/**
 * A chord name normalizer: We don't store any chord definitions for A#, Db, D#, Gb, or Ab. Instead
 * definitions of the more common notes are stored instead. So for the A# fingering we return the
 * Bb fingering and so on.
 *
 * Returns original chord name if there is no defined alias.
 */
function getAlias(chordName: string): string {
  const n = chordName.substr(0, 2);
  return !chordNameAliases[n] ? chordName : chordNameAliases[n] + chordName.substr(2);
}

/**
 * Pass in "standard" chord name, returns match from defined chords or null if not found
 */
function underscoreGet(chordName: string): Chord | null {
  const name = getAlias(chordName);
  const chord = chordCache.find((c) => name === c.name);
  if (!chord) {
    return null;
  }

  return Object.assign(
    new Chord(chordName), {
      dots: chord.dots,
      muted: chord.muted,
    },
  );
}

export function add(chords: Chord[]): integer {
  if (chords.length) {
    for (let i = 0; i < chords.length; i++) {
      userChords.push(chords[i]);
    }
  }
  return userChords.length;
}

export function replace(chords: Chord[]): integer {
  userChords = [];
  return add(chords);
}

export const getChords = (): Chord[] => chordCache;

// eslint-disable-next-line no-return-assign
export const setChords = (chords: Chord[]) => chordCache = chords;
