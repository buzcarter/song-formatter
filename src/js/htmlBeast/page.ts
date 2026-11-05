/**
 * The browser side of rendering: puts renderSong()'s HTML into the page's elements.
 */
import { settings } from '../configs';
import { Song } from '../cpmImporter';

import HTMLHandles from './classes/HTMLHandles';
import { Fix } from './overlapFixer';
import { renderSong } from './renderSong';
import { PageStyles } from './Styles';

/** Chords the last song used that have no diagram; see getUnknownChordErrors() */
let errList: string[] = [];

/**
 * read Music, find chords, generate HTML version of song
 * @param html the song as HTML text (already escaped); by default it's read from the page
 */
export function processSong(handles: HTMLHandles | null, html?: string): Song | null {
  const { diagrams, meta, text, wrap } = handles || {};
  if (!diagrams || !text || !wrap) {
    return null;
  }

  const rendered = renderSong(typeof html === 'string' ? html : text.innerHTML, { isHtml: true });

  text.innerHTML = rendered.html;
  if (meta) {
    meta.innerHTML = rendered.metaHtml;
  }
  diagrams.innerHTML = rendered.diagramsHtml;
  // Like the old library this only ever adds the inline class, and sets or clears "no chords"
  rendered.wrapClasses.forEach((className) => wrap.classList.add(className));
  wrap.classList.toggle(PageStyles.NO_CHORDS, !rendered.song.hasChords);

  // only this song's unknown chords. (They used to be appended to the previous songs'
  // list, so the alert repeated old chords after every re-render.)
  errList = rendered.unknownChords;

  if (settings.opts.autoFixOverlaps) {
    Fix(text);
  }

  return rendered.song;
}

export const getUnknownChordErrors = () => errList;
