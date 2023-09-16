import {
  getHandlesFromClass,
  getHandlesFromId,
  getUnknownChordErrors,
  processSong,
} from './htmlBeast';
import { definitions } from './tunings';
import { JsonData, integer, logger } from './tools';
import { settings } from './configs';
import { Song } from './cpmImporter';
import defaultInstrument from './.built/sopranoUkuleleGCEAChordDefinitions.js';

export function init(options?: JsonData): void {
  const { addInstrument, setInstrument } = definitions;

  const instrumentIndex = addInstrument(<string>options?.definitions || defaultInstrument);
  setInstrument(instrumentIndex, 0);
}

/**
 * Runs all Scriptasaurus methods using the element Ids defined in the settings class.
 */
export function run(): Song | null {
  logger.log('run (Classic Mode)');
  const song = processSong(getHandlesFromId());
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
  const songWraps = document.querySelectorAll(settings.wrapClasses.wrap);
  songWraps.forEach((wrap) => {
    const song = processSong(getHandlesFromClass(wrap as HTMLElement));
    if (!song) {
      return;
    }
    songs.push(song);
  });
  return songs;
}

/**
 * @todo: still nececessary?
 * @param {number} offset default 0. Number of semitones to shift the tuning.
 */
export const setTuningOffset = (offset: integer): void => definitions.useInstrument(offset);

function showUnknownChordErrors(errs: string | string[]): void {
  if (!errs.length) {
    return;
  }
  const errStr = typeof errs === 'string'
    ? errs
    : errs.join(', ');
  // eslint-disable-next-line no-alert
  alert(`Forgive me, but I don't know the following chords: ${errStr}`);
}

export default {
  init,
  run,
  runByClasses,
  setTuningOffset,
};
