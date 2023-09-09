import { runBlock } from '../metaParser';

describe('metaParser', () => {
  describe('runBlock', () => {
    it('should parse complete instrument defintion (Happy Path)', () => {
      const input = `
{instrument: Soprano Ukulele}
{tuning: G C E A}

{define: B7sus4 frets 2 4 2 2 fingers 1 3 1 1 add: string 2 fret 2 finger 1}

{define: C-F frets 2 0 1 3}

`;
      const result = runBlock(input);
      const expectedResult = {
        key: 'soprano-ukulele-g-c-e-a',
        name: 'Soprano Ukulele',
        tuning: ['G', 'C', 'E', 'A'],
        chords: [{
          dots: [
            { finger: 1, fret: 2, string: 0 },
            { finger: 3, fret: 4, string: 1 },
            { finger: 1, fret: 2, string: 2 },
            { finger: 1, fret: 2, string: 3 },
            { finger: 1, fret: 2, string: 1 },
          ],
          muted: [false, false, false, false],
          name: 'B7sus4',
        }, {
          dots: [
            { finger: 0, fret: 2, string: 0 },
            { finger: 0, fret: 1, string: 2 },
            { finger: 0, fret: 3, string: 3 },
          ],
          muted: [false, false, false, false],
          name: 'C-F',
        },
        ],
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
