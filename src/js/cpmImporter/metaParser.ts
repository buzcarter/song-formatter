/**
 * Converts text to JSON objects. Accepts either large text blocks or single lines of
 * text written in CPM syntax (looks for instrument, tuning, and define statements).
 */

import { settings } from '../configs';
import { pack } from '../tools';
import Instrument from '../tunings/classes/Instrument';
import { runLines } from './chordParser';

/** All regular expressions used in this class. Note, Changed parsing from "\n" to "{" which means "define: ..." cannot depend on that opening curly-brace! */
const RegExes = Object.freeze({
  /* eslint-disable key-spacing */
  INSTRUMENT:     /{\s*instrument\s*:\s*(.*?)\s*}/i,
  TUNING:         /{\s*tuning\s*:\s*([^}]+?)\s*}/i,
  /* eslint-enable key-spacing */
});

function getInstrument(text: string): string | null {
  const matches = text.match(RegExes.INSTRUMENT);
  return matches ? pack(matches[1]) : null;
}

function getTuning(text: string): string[] | null {
  const matches = text.match(RegExes.TUNING);
  if (!matches) {
    return null;
  }
  return matches[1].split(/\s+/);
}

function getKey(name: string, tuning: string[]): string {
  let result = name.replace(' ', '-');
  tuning.forEach((t) => {
    result += `-${t}`;
  });
  return result.toLowerCase();
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

  const name = getInstrument(text) || '';
  const tuning = getTuning(text) || [];

  // TODO: want to pass this dependency, not set -- unexpected sideeffect!!
  settings.tuning = tuning;

  const chords = runLines(lines);
  return new Instrument(
    getKey(name, tuning),
    name,
    tuning,
    chords,
  );
}

export const __test__ = {
  getTuning,
};
