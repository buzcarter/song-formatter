import { Chord, runLine } from './cpmImporter';
import { definitions, shift, shiftChords } from './tunings';
import { Fix, plot } from './htmlBeast';
import { settings } from './configs';
import scriptasaurus from './scriptasaurus';

class ChordBrush extends Chord {
  // @ts-ignore-next-line
  // eslint-disable-next-line class-methods-use-this
  plot(...args): void {
    // @ts-ignore-next-line
    plot(...args);
  }
}

/**
 * Finds page HTML elements & creates ukeGeek objects;
 * Reads song text, parses, draws choard diagrams.
 */
const publicInterface = {
  ...scriptasaurus,
  ChordBrush,
  chordImport: {
    runLine,
  },
  definitions: {
    ...definitions,
  },
  overlapFixer: {
    Fix,
  },
  settings,
  transpose: {
    shift,
    shiftChords,
  },
};

// @ts-ignore-next-line
window.ukeGeeks = Object.assign(window.ukeGeeks || {}, publicInterface);

export default publicInterface;
