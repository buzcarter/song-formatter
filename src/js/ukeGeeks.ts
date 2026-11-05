/**
 * The `ukeGeeks` object: the old UkeGeeks library's API (scriptasaurus, settings,
 * definitions, transpose...), which the Songbook and older pages use. In the browser bundle
 * it's `window.ukeGeeks` (see browser.ts).
 */

import { Chord, runLine } from './cpmImporter';
import { definitions, shift, shiftChords } from './tunings';
import { Fix, plot } from './htmlBeast';
import { settings, InstrumentTunings } from './configs';
import scriptasaurus from './scriptasaurus';
import { escapeHtml, pack, trim } from './tools';

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
  chordBrush: ChordBrush, // legacy
  ChordBrush,
  chordImport: {
    runLine,
  },
  definitions: {
    ...definitions,
    instrument: InstrumentTunings,
  },
  overlapFixer: {
    Fix,
  },
  settings,
  scriptasaurus, // legacy
  /** The old library's helpers that the Songbook's editor still calls */
  toolsLite: {
    escapeHtml,
    pack,
    trim,
    hasClass(ele: HTMLElement, className: string) {
      return ele.classList.contains(className);
    },
    addClass(ele: HTMLDivElement, className: string) {
      ele.classList.add(className);
    },
    removeClass(ele: HTMLDivElement, className: string) {
      ele.classList.remove(className);
    },
    setClass(ele: HTMLDivElement, className: string, toggle: boolean) {
      ele.classList.toggle(className, toggle);
    },
  },
  transpose: {
    shift,
    shiftChords,
  },
};

export default publicInterface;
