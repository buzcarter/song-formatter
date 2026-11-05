/**
 * Renders a ChordPro song to HTML strings, with no DOM: everything `scriptasaurus.run()` puts
 * on the page, ready to send from a server or write to a file.
 */
import { settings, sopranoUkuleleGcea } from '../configs';
import { BlockTypes, Song, parseCPM } from '../cpmImporter';
import { escapeHtml } from '../tools';
import { definitions } from '../tunings';
import { addInlineDiagrams, referenceDiagrams } from './diagrams';
import { songToHTML } from './song';
import { PageStyles } from './Styles';

export interface RenderOptions {
  /**
   * `true` if `text` is already HTML, as when it's read from a page's `innerHTML`. By default
   * it's plain ChordPro text and is HTML-escaped first, so it can't add tags of its own.
   */
  isHtml?: boolean,
  /** Draw mini-diagrams above the lyrics. Default: `settings.inlineDiagrams` */
  inlineDiagrams?: boolean,
}

export interface RenderedSong {
  /** What the parser found: title, key, chords, `{define}`s and the blocks */
  song: Song,
  /** The song itself: lyrics with chords, comments, tabs. For the "song text" element. */
  html: string,
  /** Title, subtitle, album, artist and ukegeeks-meta lines. For the "song meta" element. */
  metaHtml: string,
  /** The reference chord diagrams. For the "diagrams" element. */
  diagramsHtml: string,
  /** Classes the browser version adds to the element wrapping all of the above */
  wrapClasses: string[],
  /** Chords in the song that have no diagram */
  unknownChords: string[],
  /** Common chords left out of the diagrams because of `settings.opts.ignoreCommonChords` */
  ignoredChords: string[],
}

/** The blocks shown in `metaHtml` rather than in the song's body */
const META_BLOCK_TYPES = [
  BlockTypes.Title,
  BlockTypes.Subtitle,
  BlockTypes.Album,
  BlockTypes.Artist,
  BlockTypes.UkeGeeksMeta,
];

/**
 * Chord diagrams need a chord dictionary. The browser version loads one in
 * `scriptasaurus.init()`; anyone calling renderSong() directly gets the soprano one.
 */
function ensureDictionary(): void {
  if (!definitions.getChords().length) {
    definitions.setInstrument(definitions.addInstrument(sopranoUkuleleGcea));
  }
}

export function renderSong(text: string, options: RenderOptions = {}): RenderedSong {
  const { isHtml = false, inlineDiagrams = settings.inlineDiagrams } = options;
  ensureDictionary();

  const song = parseCPM(isHtml ? text : escapeHtml(text));
  const diagrams = referenceDiagrams(song.chordNames);

  let html = songToHTML(song, { exclude: META_BLOCK_TYPES, inlineDiagrams });
  if (inlineDiagrams) {
    html = addInlineDiagrams(html, song.chordNames);
  }

  return {
    song,
    html,
    metaHtml: songToHTML(song, { include: META_BLOCK_TYPES, blocksOnly: true }),
    diagramsHtml: diagrams.html,
    wrapClasses: [
      ...(inlineDiagrams ? [PageStyles.INLINE_DIAGRAMS] : []),
      ...(song.hasChords ? [] : [PageStyles.NO_CHORDS]),
    ],
    unknownChords: diagrams.unknownChords,
    ignoredChords: diagrams.ignoredChords,
  };
}
