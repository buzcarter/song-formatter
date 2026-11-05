import * as cpmParser from '../cpmParser';

describe('cpmParser', () => {
  describe('parse', () => {
    const { parseCPM: parse } = cpmParser;
    it('should (Happy Path)', () => {
      const input = `
{title: Basic Info Test}
{album: Album Title (1974)}
{artist: Ray Bradbury}
{subtitle: Monsters Who Once Were Men}
{st: This has 2 Subtitles}
`;
      const results = parse(input);
      const expectedResult = {
        album: 'Album Title (1974)',
        artist: 'Ray Bradbury',
        st: 'Monsters Who Once Were Men',
        st2: 'This has 2 Subtitles',
        title: 'Basic Info Test',
      };
      expect(results).toEqual(expect.objectContaining(expectedResult));
    });

    it('should list only chords that are shown', () => {
      const input = [
        '{title: Not a chord [Am]}',
        '# a comment line [Bm]',
        '<!-- an HTML comment [Cm] -->',
        '{c: Intro [D7]}',
        '[E7]Lyrics and [F]more',
        '{soc}',
        '[G]Chorus',
        '{eoc}',
      ].join('\n');
      expect(parse(input).chordNames).toEqual(['D7', 'E7', 'F', 'G']);
    });

    it('should not carry anything over from the previous song', () => {
      const first = parse('{key: G}\n[Am]One\n{column_break}\n[C]two\n{colb}\nthree');
      expect(first).toMatchObject({ columnCount: 3, hasChords: true, key: 'G' });

      const second = parse('[D7]Just one column');
      expect(second).toMatchObject({ columnCount: 1, hasChords: true, key: 'D7' });

      const third = parse('No chords at all');
      expect(third).toMatchObject({ columnCount: 1, hasChords: false, key: '' });
    });
  });

  describe('stripHtml', () => {
    const { __test__: { stripHtml } } = cpmParser;

    it('should (Happy Path)', () => {
      const input = `
<h1>Sample</h1>

<pre>
My Preformatted Stuff

Here
</pre>

and then <!-- ignored all this --> i finish with

<pre>

one more block
</pre>
<!-- and a comment -->
`;
      const result = stripHtml(input);
      const expectedResult = `
<h1>Sample</h1>


My Preformatted Stuff

Here


and then  i finish with



one more block


`;
      expect(result).toBe(expectedResult);
    });
  });
});
