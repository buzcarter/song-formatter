/**
 * Entry point for Node and bundlers (`import ... from '@ukegeeks/song-formatter'`).
 *
 * Everything here works without a DOM, except the `ukeGeeks` object's browser methods
 * (`scriptasaurus.run()` and friends), which need a page.
 *
 *   import { renderSong } from '@ukegeeks/song-formatter';
 *   const { html, metaHtml, diagramsHtml } = renderSong(chordProText);
 */

// Render a whole song to HTML strings
export { renderSong } from './htmlBeast/renderSong';
export type { RenderOptions, RenderedSong } from './htmlBeast/renderSong';
export { referenceDiagrams, addInlineDiagrams, chordDiagramHtml } from './htmlBeast/diagrams';
export type { ReferenceDiagrams } from './htmlBeast/diagrams';
export { songToHTML } from './htmlBeast/song';

// Parse ChordPro
export {
  BlockTypes, Chord, Dot, Song, parseCPM, runBlock, runLine,
} from './cpmImporter';
export type {
  BaseSongBlock, ExpandedTabs, SongBlock, SongBlockArray, TabBlock, TabStaff,
} from './cpmImporter';

// Draw SVG
export {
  ImageBuilder, generateChordSvg, generateTabSvg, toString as imageToSvg,
} from './imageRenderer';
export type { FretBox } from './imageRenderer';

// Chord dictionary, tunings, transposing
export { definitions, Instrument, shift, shiftChords } from './tunings';
export { InstrumentTunings, settings, sopranoUkuleleGcea } from './configs';

export { escapeHtml } from './tools';

// The old library's API, as found on `window.ukeGeeks` in the browser bundle
export { default as ukeGeeks } from './ukeGeeks';
