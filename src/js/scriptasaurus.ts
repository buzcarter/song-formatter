import {
  getHandlesFromClass,
  getHandlesFromId,
  getUnknownChordErrors,
  processSong,
} from './htmlBeast';
import { definitions } from './tunings';
import { JsonData, escapeHtml, integer, logger } from './tools';
import { settings, InstrumentTunings, sopranoUkuleleGcea } from './configs';
import { Song } from './cpmImporter';

export function init(options?: JsonData): void {
  const { addInstrument, setInstrument } = definitions;

  const instrumentIndex = addInstrument(<string>options?.definitions || sopranoUkuleleGcea);
  setInstrument(instrumentIndex, InstrumentTunings.none);
}

/**
 * Runs all Scriptasaurus methods using the element Ids defined in the settings class.
 * @param markup the song's ChordPro text. If given it's rendered instead of the text already on
 * the page; this is how the Songbook's editor re-renders as you type. It's plain text: it gets
 * HTML-escaped first, so "<" shows as "<" and can't add tags.
 */
export function run(markup?: string): Song | null {
  logger.log('run (Classic Mode)');
  const song = processSong(getHandlesFromId(), typeof markup === 'string' ? escapeHtml(markup) : undefined);
  if (!song) {
    return null;
  }
  showUnknownChordErrors(getUnknownChordErrors());
  return song;
}

/**
 * Same as "run" except runs using class names, this allows you to have multiple songs on a single page.
 */
export function runByClasses(): Song[] {
  const songs: Song[] = [];
  // the <HTMLElement> says what kind of elements we expect, instead of casting each one later
  const songWraps = document.querySelectorAll<HTMLElement>(settings.wrapClasses.wrap);
  songWraps.forEach((wrap) => {
    const song = processSong(getHandlesFromClass(wrap));
    if (song) {
      songs.push(song);
    }
  });
  return songs;
}

/**
 * @todo: still nececessary?
 * @param {number} offset default 0. Number of semitones to shift the tuning. See ukeGeeks.definitions.instrument.
 */
export const setTuningOffset = (offset: integer): void => definitions.useInstrument(offset);

function showUnknownChordErrors(errs: string[]): void {
  if (!errs.length) {
    return;
  }
  // eslint-disable-next-line no-alert
  alert(`Forgive me, but I don't know the following chords: ${errs.join(', ')}`);
}

export default {
  init,
  run,
  runByClasses,
  setTuningOffset,
};
