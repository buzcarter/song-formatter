/**
 * @jest-environment jsdom
 *
 * `ukeGeeks.scriptasaurus.run(markup)`, the way the Songbook's editor calls it: the song's
 * raw ChordPro text, typed by the user, rendered into the page.
 */
window.alert = () => {};

const ugs = require('../src/js/index').default;

const PAGE = ''
  + '<div id="ukeSongContainer" class="ugs-song-wrap">'
  + '<aside id="ukeChordsCanvas" class="ugs-diagrams-wrap"></aside>'
  + '<article id="ukeSongText" class="ugs-source-wrap"><pre></pre></article>'
  + '</div>';

const songText = () => document.getElementById('ukeSongText');

beforeAll(() => {
  ugs.scriptasaurus.init();
});

beforeEach(() => {
  document.body.innerHTML = PAGE;
  ugs.settings.inlineDiagrams = false;
});

describe('scriptasaurus.run(markup)', () => {
  it('should render the markup instead of the text on the page', () => {
    songText().querySelector('pre').textContent = 'what was on the page';
    const song = ugs.scriptasaurus.run('{title: New}\n[C]Hello [G7]there');
    expect(song.title).toBe('New');
    expect(song.chords).toEqual(['C', 'G7']);
    expect(songText().textContent).toContain('Hello');
    expect(songText().textContent).not.toContain('what was on the page');
  });

  it('should give the same result every time it re-renders the same song', () => {
    const markup = '{t: Again}\n[Am]One\n{colb}\n[F]Two';
    ugs.scriptasaurus.run(markup);
    const first = songText().innerHTML;
    ugs.scriptasaurus.run(markup);
    ugs.scriptasaurus.run(markup);
    expect(songText().innerHTML).toBe(first);
    expect(songText().querySelectorAll('.ugsColumn')).toHaveLength(2);
  });

  it('should treat the markup as text, not HTML', () => {
    ugs.scriptasaurus.run('[C]Hi <img src=x onerror="alert(1)"> <script>alert(2)</script>');
    expect(songText().querySelector('img, script')).toBeNull();
    expect(songText().textContent).toContain('<img src=x onerror="alert(1)">');
  });

  it('should not let a quote in a chord name add attributes', () => {
    ugs.settings.inlineDiagrams = true;
    ugs.scriptasaurus.run('[A" onmouseover="alert(1)]boom [C]ok');
    const codes = [...songText().querySelectorAll('code')];
    expect(codes.map((code) => code.getAttribute('data-chordName'))).toEqual(['A" onmouseover="alert(1)', 'C']);
    codes.forEach((code) => expect(code.getAttributeNames().filter((name) => name.startsWith('on'))).toEqual([]));
  });

  it('should list the chords that are shown, like the old library', () => {
    const song = ugs.scriptasaurus.run([
      '{title: Not a chord [Am]}',
      '# a comment line [Bm]',
      // escaped, so this is shown as text rather than being an HTML comment
      '<!-- not an HTML comment [Cm] -->',
      '{c: Intro [D7]}',
      '[E7]Lyrics and [F]more',
      '{soc}',
      '[G]Chorus',
      '{eoc}',
    ].join('\n'));
    // what the old UkeGeeks library returns for the same markup
    expect(song.chords).toEqual(['Cm', 'D7', 'E7', 'F', 'G']);
  });

  it('should leave entities in the song alone', () => {
    const song = ugs.scriptasaurus.run('{artist: Lyrics &amp; Music &copy; 1933}\nRock & roll');
    expect(song.artist).toBe('Lyrics &amp; Music &copy; 1933');
    expect(songText().textContent).toContain('Rock & roll');
  });
});

describe('toolsLite', () => {
  it('should have the helpers the Songbook calls', () => {
    expect(ugs.toolsLite.trim('  x  ')).toBe('x');
    expect(ugs.toolsLite.escapeHtml('<&amp;>')).toBe('&lt;&amp;&gt;');
  });
});

describe('definitions.instrument', () => {
  it('should have every tuning the Songbook offers', () => {
    expect(ugs.definitions.instrument).toMatchObject({ sopranoUke: 0, baritoneUke: 5, alternateUke: -2 });
  });
});
