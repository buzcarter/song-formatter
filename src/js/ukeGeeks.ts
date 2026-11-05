/**
 * The `ukeGeeks` object: the old UkeGeeks library's API (scriptasaurus, settings,
 * definitions, transpose...), which the Songbook and older pages use. In the browser bundle
 * it's `window.ukeGeeks` (see browser.ts).
 */

import { Chord, runLine } from './cpmImporter';
import { definitions, shift, shiftChords } from './tunings';
import { Fix, plot } from './htmlBeast';
import { settings, InstrumentTunings } from './configs';
import { FretBox } from './imageRenderer';
import scriptasaurus from './scriptasaurus';
import { StringDict, escapeHtml, pack, trim } from './tools';

/**
 * The old library's `new ukeGeeks.chordBrush()`, which draws one chord diagram into an
 * element; the Songbook's chord builder uses it.
 * (It used to extend Chord, which it never needed, and pass `...args` straight to plot(),
 * which took two @ts-ignores because TypeScript couldn't check untyped arguments.)
 */
/* eslint-disable class-methods-use-this -- methods, not functions, to keep the old `new chordBrush().plot()` API */
class ChordBrush {
  /** The old API had one; it does nothing */
  init(): void {
    // nothing to set up
  }

  /**
   * @param fontSettings default: `settings.fonts`
   * @param colorSettings default: `settings.colors`
   */
  plot(chordBox: HTMLElement, chord: Chord, fretBox: FretBox, fontSettings?: StringDict, colorSettings?: StringDict): void {
    plot(chordBox, chord, fretBox, fontSettings, colorSettings);
  }
}
/* eslint-enable class-methods-use-this */

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
