/**
 * @jest-environment node
 *
 * renderSong() and the rest of the module entry must work with no DOM at all, as on a
 * server. This file runs in plain Node: `window` and `document` don't exist here.
 */
const { listSongs, readSong } = require('../parity/lib/dom.cjs');
const {
  definitions, generateTabSvg, renderSong, InstrumentTunings, parseCPM, shift,
} = require('../../src/js/index');

const svgCount = (html) => (html.match(/<svg/g) || []).length;

describe('module entry, without a DOM', () => {
  it('should really have no DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  describe.each(listSongs())('%s', (name) => {
    it('should render', () => {
      const { song, html, metaHtml, diagramsHtml, unknownChords } = renderSong(readSong(name));
      expect(html).toContain('<pre');
      expect(metaHtml).toContain(song.title ? 'ugsTitle' : '');
      const drawable = song.chordNames.filter((chord) => !unknownChords.includes(chord) && !/^(n.?\/?c.?|tacet)$/i.test(chord));
      expect(svgCount(diagramsHtml)).toBe(drawable.length);
    });
  });

  it('should draw inline diagrams', () => {
    const { html, wrapClasses } = renderSong('[Am]Hello [C]there', { inlineDiagrams: true });
    expect(svgCount(html)).toBe(2);
    expect(wrapClasses).toContain('ugsInlineDiagrams');
  });

  it('should escape the text unless told it is HTML', () => {
    expect(renderSong('<b>[C]bold</b>').html).toContain('&lt;b&gt;');
    expect(renderSong('<b>[C]bold</b>', { isHtml: true }).html).toContain('<b>');
  });

  it('should use the current tuning', () => {
    const soprano = renderSong('[C]x').diagramsHtml;
    definitions.useInstrument(InstrumentTunings.baritoneUke);
    const baritone = renderSong('[C]x').diagramsHtml;
    definitions.useInstrument(InstrumentTunings.sopranoUke);
    expect(baritone).not.toBe(soprano);
    expect(renderSong('[C]x').diagramsHtml).toBe(soprano);
  });

  it('should export the building blocks', () => {
    expect(parseCPM('{t: Hi}').title).toBe('Hi');
    expect(shift('Em', -5)).toBe('Bm');
    expect(generateTabSvg({ hasLabels: false, tabs: [['-', '3'], ['-', '-'], ['-', '-'], ['-', '-']] })).toContain('<svg');
  });
});
