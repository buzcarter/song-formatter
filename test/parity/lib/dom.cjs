/**
 * Helpers shared by `generate-expected.cjs` (which runs the OLD UkeGeeks library) and
 * `parity.test.js` (which runs song-formatter). Both sides must build the page and read
 * the results in exactly the same way, otherwise a "difference" could come from the
 * harness rather than from the library.
 */

const fs = require('fs');
const path = require('path');

const SONGS_DIR = path.join(__dirname, '..', 'songs');
const EXPECTED_DIR = path.join(__dirname, '..', 'expected');

/**
 * The six ways each song is rendered. `tuning` is the value passed to
 * `scriptasaurus.setTuningOffset()`: 0 = soprano GCEA, 5 = baritone DGBE, -2 = ADF#B.
 */
const CONFIGS = Object.freeze([
  { id: 'soprano', tuning: 0, inline: false },
  { id: 'soprano-inline', tuning: 0, inline: true },
  { id: 'baritone', tuning: 5, inline: false },
  { id: 'baritone-inline', tuning: 5, inline: true },
  { id: 'adfb', tuning: -2, inline: false },
  { id: 'adfb-inline', tuning: -2, inline: true },
]);

/** The song page from the Songbook's `server/views.js`, minus the header. */
const SONG_PAGE = ''
  + '<div id="ukeSongContainer" class="ugsLayoutTwoColumn ugs-song-wrap">'
  + '<aside id="ukeChordsCanvas" class="ugs-diagrams-wrap ugs-grouped"></aside>'
  + '<article id="ukeSongText" class="ugs-source-wrap"><pre></pre></article>'
  + '</div>';

/**
 * The Songbook server's escaping rule (UkeGeeks `server/lib/html.js`): escape <, >, quotes
 * and any "&" that doesn't already start an entity, so "&amp;" and "&copy;" survive as-is.
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const BARE_AMP_OR_SPECIAL = /&(?!#\d+;|#x[0-9a-f]+;|[a-z][a-z0-9]*;)|[<>"']/gi;
const escapeHtml = (value) => String(value).replace(BARE_AMP_OR_SPECIAL, (c) => ESCAPES[c]);

const listSongs = () => fs.readdirSync(SONGS_DIR)
  .filter((name) => name.endsWith('.cpm.txt'))
  .sort();

const readSong = (name) => fs.readFileSync(path.join(SONGS_DIR, name), 'utf8');

/** Puts a fresh song page in `document`, with the song text in the `<pre>` the way the server sends it. */
function mountSong(document, rawText) {
  document.body.innerHTML = SONG_PAGE;
  document.querySelector('#ukeSongText pre').innerHTML = escapeHtml(rawText);
}

const round = (n) => Math.round(Number(n) * 1000) / 1000;

const sortByJson = (list) => list
  .map((item) => JSON.stringify(item))
  .sort()
  .map((json) => JSON.parse(json));

/**
 * Puts a drawing (from either a canvas recording or an SVG) into one canonical shape:
 * numbers rounded, and each list sorted, because drawing order doesn't change the picture.
 */
function normalizeDrawing({ width, height, dots, texts, lines, rects }) {
  return {
    width: round(width),
    height: round(height),
    dots: sortByJson(dots.map(({ x, y, r, color }) => ({ x: round(x), y: round(y), r: round(r), color }))),
    texts: sortByJson(texts.map(({ text, x, y, font, color, align }) => ({ text, x: round(x), y: round(y), font, color, align }))),
    lines: sortByJson(lines.map(({ x1, y1, x2, y2, color, width: w }) => ({ x1: round(x1), y1: round(y1), x2: round(x2), y2: round(y2), color, width: round(w) }))),
    rects: sortByJson(rects.map(({ x, y, w, h, color, width: lw }) => ({ x: round(x), y: round(y), w: round(w), h: round(h), color, width: round(lw) }))),
  };
}

const toDefinition = (chord) => (chord ? {
  name: chord.name,
  dots: (chord.dots || []).map((d) => [d.string, d.fret, d.finger]),
  muted: (chord.muted || []).map(Boolean),
} : null);

/**
 * Reads everything the parity tests compare from the page after `run()`.
 * @param imageSelector 'canvas' for the old library, 'svg' for song-formatter
 * @param readImage turns one of those elements into a drawing for `normalizeDrawing`
 */
function collect({ document, song, alerts, imageSelector, readImage }) {
  const wrap = document.getElementById('ukeSongContainer');
  const diagrams = document.getElementById('ukeChordsCanvas');
  const text = document.getElementById('ukeSongText');
  const read = (el) => normalizeDrawing(readImage(el));

  const inlineImages = {};
  const inlineChords = [...text.querySelectorAll('code')].map((code) => {
    const name = code.getAttribute('data-chordName');
    const images = [...code.querySelectorAll(imageSelector)];
    if (images.length && !inlineImages[name]) {
      inlineImages[name] = read(images[0]);
    }
    return [name, images.length];
  });

  const body = text.cloneNode(true);
  // song-formatter wraps each SVG in a <span>; the old library appends the bare <canvas>
  body.querySelectorAll('.ugs-diagrams--chord-img').forEach((el) => el.remove());
  body.querySelectorAll(imageSelector).forEach((el) => el.remove());
  // overlapFixer sets padding from the layout, which jsdom doesn't compute
  body.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));

  const ignored = diagrams.querySelector('.ugsIgnoredChords');

  // The song's title, artist etc. are HTML (the Songbook puts them in with innerHTML), so
  // compare them the way a browser reads them: `&quot;` and `"` are the same text.
  const asHtml = (value) => {
    const el = document.createElement('div');
    el.innerHTML = value;
    return el.innerHTML;
  };

  return {
    song: song && {
      title: asHtml(song.title),
      st: asHtml(song.st),
      st2: asHtml(song.st2),
      album: asHtml(song.album),
      artist: asHtml(song.artist),
      key: asHtml(song.key),
      hasChords: song.hasChords,
      ugsMeta: (song.ugsMeta || []).map(asHtml),
      chords: song.chords,
      defs: (song.defs || song.chordDefs || []).map(toDefinition),
    },
    alerts: [...alerts],
    referenceDiagrams: [...diagrams.querySelectorAll(imageSelector)].map(read),
    ignoredChords: ignored ? ignored.textContent : null,
    inlineChords,
    inlineImages,
    tabs: [...text.querySelectorAll('pre.ugsTabs')].map((pre) => [...pre.querySelectorAll(imageSelector)].map(read)),
    bodyHtml: body.innerHTML,
    wrapClasses: wrap.className.split(/\s+/).filter(Boolean).sort(),
  };
}

module.exports = {
  CONFIGS,
  EXPECTED_DIR,
  SONGS_DIR,
  collect,
  escapeHtml,
  listSongs,
  mountSong,
  normalizeDrawing,
  readSong,
  toDefinition,
};
