/**
 * Draws large chord diagram grid (aka "reference" diagrams)
 */
import HTMLHandles from './classes/HTMLHandles';
import { RefDiagramsStyles as Styles } from './Styles';

import { get } from '../tunings';
import { plot } from '../imageRenderer';
import { settings } from '../configs';

const RegExes = {
  /** Ignore "tacet" or "no chord" chords */
  TACET: /^(n.?\/?c.?|tacet)$/i,
};

/**
 * keep an array of missing chords
 */
let errors: string[] = [];

let handles: HTMLHandles;

/**
 * If ignoreCommonChords option is true then this will contain list of
 * matched chords: ones defined in the ignore list that were also found in the song
 */
let ignoreMatchList: string[] = [];

/**
 * Again this is a constructor replacement
 */
export function init(htmlHandles: HTMLHandles): void {
  handles = htmlHandles;
}

/**
 * Checks whether speicified chord (name) is on the ignore list. return `true` if "chord" is on ignore list.
 */
const ignoreChord = (chordName: string): boolean => settings.commonChords.includes(chordName);

/**
 * Plots the passed in chords inside passed DOM element.
 */
export function show(chordNames: string[]): void {
  handles.diagrams.innerHTML = '';
  errors = [];
  ignoreMatchList = [];

  if (settings.opts.sortAlphabetical) {
    chordNames.sort();
  }

  chordNames.forEach((name) => {
    if (RegExes.TACET.test(name)) {
      return;
    }

    if (settings.opts.ignoreCommonChords && ignoreChord(name)) {
      if ((typeof Array.prototype.indexOf === 'function') && (ignoreMatchList.indexOf(name) === -1)) {
        ignoreMatchList.push(name);
      }
      return;
    }

    const chord = get(name);
    if (!chord) {
      errors.push(name);
      return;
    }

    plot(handles.diagrams, chord, settings.fretBox, settings.fonts, settings.colors);
  });

  if (ignoreMatchList.length > 0) {
    const para = Object.assign(document.createElement('p'), {
      className: Styles.IGNORED_CHORDS,
      innerHTML: `Also uses: ${ignoreMatchList.sort().join(', ')}`,
    });
    handles.diagrams.appendChild(para);
  }
}

/**
 * Plots chords "inline" with the lyrics. Searches for `<code data-chordName="Am7"></code>;`.
 * When found adds canvas element and draws chord named in data-chordName attribute
 */
export function showInline(chordNames: string[]): void {
  const elements = handles.text.querySelectorAll('code');
  if (elements.length < 1) {
    return;
  }

  chordNames.forEach((chordName) => {
    const chord = get(chordName);
    if (!chord) {
      /* TODO: error reporting if not found */
      // _errors.push(chords[i]);
      return;
    }

    elements.forEach((ele) => {
      if (ele.getAttribute('data-chordName') === chord.name) {
        plot(ele, chord, settings.inlineFretBox, settings.inlineFretBox.fonts, settings.colors);
      }
    });
  });
}

export const getErrors = (): string[] => errors;

/**
 * List of chords excluded from the master chord diagrams
 */
export const getIgnoredChords = (): string[] => ignoreMatchList;
