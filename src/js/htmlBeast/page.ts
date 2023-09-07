import { settings } from '../configs';
import { Song, parseCPM } from '../cpmImporter';

import { getErrors, init, show, showInline } from './referenceDiagrams';
import HTMLHandles from './classes/HTMLHandles';
import { Fix } from './overlapFixer';
import { songToHTML } from './song';
import { PageStyles as Styles } from './Styles';

let errList: string[] = [];

/**
 * read Music, find chords, generate HTML version of song
 */
export function processSong(handles: HTMLHandles | null): Song | null {
  const { text, wrap } = handles || {};
  if (!handles || !handles.diagrams || !text || !wrap) {
    return null;
  }

  const song = parseCPM(text.innerHTML);
  text.innerHTML = songToHTML(song);

  init(handles);
  show(song.chordNames);
  // Show chord diagrams inline with lyrics
  if (settings.inlineDiagrams) {
    wrap.classList.add(Styles.INLINE_DIAGRAMS);
    showInline(song.chordNames);
  }

  // error reporting:
  errList = errList.concat(getErrors());

  if (wrap) {
    wrap.classList.toggle(Styles.NO_CHORDS, !song.hasChords);
  }

  if (settings.opts.autoFixOverlaps) {
    Fix(text);
  }

  // done!
  return song;
}

export const getUnknownChordErrors = () => errList;
