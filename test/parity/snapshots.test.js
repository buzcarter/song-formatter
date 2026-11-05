/**
 * @jest-environment jsdom
 *
 * Snapshots of song-formatter's own HTML and SVG for the Songbook's songs, so any change
 * to the markup shows up in review. (parity.test.js checks what is drawn against the
 * old library; this checks the exact markup, which has no old equivalent.)
 *
 * Chord diagrams are snapshotted once per chord, at the bottom, and replaced with
 * `<svg/>` in the song HTML to keep this file a reviewable size.
 */
const { listSongs, mountSong, readSong } = require('./lib/dom.cjs');

window.alert = () => {};

const ugs = require('../../src/js/ukeGeeks').default;
const { get } = require('../../src/js/tunings');
const { generateChordSvg, toString } = require('../../src/js/imageRenderer');

const SVG = /<svg[\s\S]*?<\/svg>/g;
const withoutSvgs = (html) => html.replace(SVG, '<svg/>');

const songNames = listSongs();
const allChords = new Set();

function render(name, inline) {
  ugs.settings.inlineDiagrams = inline;
  mountSong(document, readSong(name));
  const song = ugs.scriptasaurus.run();
  (song?.chords || []).forEach((chord) => allChords.add(chord));
  return {
    diagrams: withoutSvgs(document.getElementById('ukeChordsCanvas').innerHTML),
    body: document.getElementById('ukeSongText').innerHTML,
  };
}

ugs.scriptasaurus.init(false);

describe.each(songNames)('%s', (name) => {
  test('soprano', () => {
    expect(render(name, false)).toMatchSnapshot();
  });

  test('soprano, inline diagrams', () => {
    const { diagrams, body } = render(name, true);
    expect({ diagrams, body: withoutSvgs(body) }).toMatchSnapshot();
  });
});

test('chord diagram SVGs', () => {
  const { settings } = ugs;
  const svgs = [...allChords].sort().map((name) => {
    const chord = get(name);
    if (!chord) {
      return [name, null];
    }
    return [name, {
      standard: toString(generateChordSvg(chord, settings.fretBox, settings.fonts, settings.colors)),
      inline: toString(generateChordSvg(chord, settings.inlineFretBox, settings.inlineFretBox.fonts, settings.colors)),
    }];
  });
  expect(Object.fromEntries(svgs)).toMatchSnapshot();
});
