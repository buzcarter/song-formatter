/**
 * Converts text to JSON objects. Accetps either large text blocks or single lines of
 * text written in CPM syntax (looks for instrument, tuning, and define statements).
 */

import Dot from './classes/Dot';
import Chord from './classes/Chord';
import { log } from './errorWriter';

import { settings } from '../configs';
import { pack } from '../tools';
import Instrument from '../tunings/classes/Instrument';

/** Internal storage of partially converted "define" statements. */
class ChordParts {
  constructor(definition: string, addIns: string[]) {
    this.define = definition;
    this.adds = addIns || null;
  }

  define = '';

  adds: string[] = [];
}

/** All regular expressions used in this class. Note, Changed parsing from "\n" to "{" which means "define: ..." cannot depend on that opening curly-brace! */
const RegExes = Object.freeze({
  /* eslint-disable key-spacing */
  // first pass filters
  DEFINE:         /\s*{?define\s*:(.*?)(}|add:)/i,
  ADD:            /(add:.*?)(}|add:)/i,
  // chord building filters
  NAME:           /(\S+)\s+/,
  FRETS:          /\s+frets\s+([\dx]{4}|(([\dx]{1,2}\s){3})[\dx]{1,2})/i,
  FINGERS:        /\s+fingers\s+((\d\s+){3}\d|\d{4})/i,
  MUTED:          /\s+mute\s+(\d\s){0,3}\d?/i,
  // TODO: ignores "base-fret 1"
  // filter "add-in" chord fingers
  ADD_IN:         /add:\s*string\s*(\S+)\s+fret\s+(\d+)\sfinger\s(\d)/i,
  // extra commands
  INSTRUCTION:    /{\s*instrument\s*:\s*(.*?)\s*}/i,
  TUNING:         /{\s*tuning\s*:\s*([^}]+?)\s*}/i,
  // single digit numbers
  // num: /(\d)/g,
  NBR_OR_X:       /(\d{1,2}|x)/gi,
  ANY:            /(.)/g,
  /* eslint-enable key-spacing */
});

function getChordParts(line: string): ChordParts | null {
  line = pack(line);
  if (!line.length || line[0] === '#') {
    return null;
  }
  const matches = line.match(RegExes.DEFINE);
  return matches
    ? new ChordParts(matches[1], getAddIns(line))
    : null;
}

function getChordPartsAry(lines: string[]): ChordParts[] {
  return lines.reduce((acc: ChordParts[], line) => {
    const parts = getChordParts(line);
    if (parts) {
      acc.push(parts);
    }
    return acc;
  }, []);
}

function getAddIns(text: string): string[] {
  const results = [];
  let matches = text.match(RegExes.ADD);
  while (matches) {
    results.push(matches[1]);
    text = text.replace(matches[1], '');
    matches = text.match(RegExes.ADD);
  }
  return results;
}

function getInstrument(text: string): string | null {
  const matches = text.match(RegExes.INSTRUCTION);
  return matches ? pack(matches[1]) : null;
}

function getTuning(text: string): string[] | null {
  const matches = text.match(RegExes.TUNING);
  if (!matches) {
    return null;
  }
  return matches[1].split(/\s+/);
}

function getName(text: string): string | null {
  const matches = text.match(RegExes.NAME);
  return !matches ? null : matches[1];
}

function getKey(name: string, tuning: string[]): string {
  let result = name.replace(' ', '-');
  tuning.forEach((t) => {
    result += `-${t}`;
  });
  return result.toLowerCase();
}

/**
 * TODO: Change will affect "packed" chord fingers -- spaces required. No longer accepts "frets 1231", it must be "frets 1 2 3 1"
 * Replaces _getFrets. Sets frets and muted arrays.
 */
function fretOMatic(text: string, frets: number[], muted: boolean[]) {
  const fretMatches = text.match(RegExes.FRETS);
  if (!fretMatches) {
    return;
  }
  const matches = (fretMatches[1].length === 4) ? fretMatches[1].match(RegExes.ANY) : fretMatches[1].match(RegExes.NBR_OR_X);
  for (let i = 0; matches && (i < matches?.length); i++) {
    const isX = matches[i] === 'x' || matches[i] === 'X';
    frets[i] = isX ? 0 : parseInt(matches[i], 10);
    muted[i] = isX;
  }
}

function getFingers(text: string): string[] {
  const matches = text.match(RegExes.FINGERS);
  if (!matches) {
    return [];
  }
  let x = matches[1];
  if (x.length === 4) {
    x = x.replace(RegExes.ANY, '$1 ');
  }
  return x.split(' ');
}

/** Pass in integer arrays, frets is list of frets, plus corresponding fingers array */
function toDots(frets: (number | string)[], fingers: string[]): Dot[] {
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

/**
 * If a valid "add" instruction is present pushes a new dot object into dots array.
 * @param adds array of "add instruction" to be parsed (i.e. "add: string G fret 1 finger 1")
 */
function addInDots(dots: Dot[], adds: string[]): void {
  if (!adds?.length) {
    return;
  }
  adds.forEach((value) => {
    const matches = value.match(RegExes.ADD_IN);
    if (matches && matches?.length > 2) {
      dots.push(new Dot(parseInt(matches[1], 10) - 1, parseInt(matches[2], 10), parseInt(matches[3], 10)));
    }
  });
}

function getChord(text: string, adds: string[]): Chord | null {
  const frets: number[] = [];
  const muted: boolean[] = [];
  fretOMatic(text, frets, muted);

  const name = getName(text);
  const fingers = getFingers(text);

  if (name === null || name === 'frets') {
    log(`bad "define" instruction: chord name not found: ${text}`);
    return null;
  }
  if (frets === null) {
    log(`bad "define" instruction: frets not found: ${text}`);
    return null;
  }
  const chrd = new Chord(name);
  const dots = toDots(frets, fingers);
  addInDots(dots, adds);
  chrd.dots = dots;
  chrd.muted = muted;
  return chrd;
}

function partsToChords(parts: ChordParts[]): Chord[] {
  return parts
    .reduce((result: Chord[], { define, adds }) => {
      const chord = getChord(define, adds);
      if (chord) {
        result.push(chord);
      }
      return result;
    }, []);
}

export function runLine(line: string): Chord | null {
  const parts = getChordParts(line);
  return !parts ? null : getChord(parts.define, parts.adds);
}

/**
 * @param text Multiline text block containing definition, instrument, and tuning statements.
 */
export function runBlock(text: string): Instrument {
  // TODO: newlines get lost in strings, do I always rely on "{"?
  let lines = text.split('\n');
  if (lines.length < 2) {
    lines = text.split('{');
  }

  const partsAry = getChordPartsAry(lines);
  const name = getInstrument(text) || '';
  const tuning = getTuning(text) || [];

  return new Instrument(
    getKey(name || '', tuning || []),
    name,
    tuning,
    partsToChords(partsAry),
  );
}

export const __test__ = {
  getTuning,
};
