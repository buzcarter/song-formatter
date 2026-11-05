/**
 * @jest-environment jsdom
 *
 * renderSong() (the DOM-free function behind the module entry) must give the same page as
 * `scriptasaurus.run()`, which the parity tests check against the old library.
 */
const { CONFIGS, listSongs, mountSong, readSong } = require('./lib/dom.cjs');

window.alert = () => {};

const ugs = require('../../src/js/ukeGeeks').default;
const { renderSong } = require('../../src/js/index');

/** innerHTML of an element after the browser has parsed `html` into it */
const parsed = (html) => Object.assign(document.createElement('div'), { innerHTML: html }).innerHTML;

beforeAll(() => {
  ugs.scriptasaurus.init();
  ugs.settings.opts.autoFixOverlaps = false;
});

describe.each(CONFIGS.map((config) => [config.id, config]))('%s', (id, { tuning, inline }) => {
  beforeAll(() => {
    ugs.settings.inlineDiagrams = inline;
    ugs.scriptasaurus.setTuningOffset(tuning);
  });

  test.each(listSongs())('%s', (name) => {
    const text = readSong(name);
    const rendered = renderSong(text, { inlineDiagrams: inline });

    mountSong(document, text);
    const song = ugs.scriptasaurus.run();

    expect(parsed(rendered.html)).toBe(document.getElementById('ukeSongText').innerHTML);
    expect(parsed(rendered.diagramsHtml)).toBe(document.getElementById('ukeChordsCanvas').innerHTML);
    expect(rendered.song.chordNames).toEqual(song.chordNames);
  });
});
