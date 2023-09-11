import { runLine } from '../chordParser';
// import { toDots } from '../chordParser';
import { settings } from '../../configs';

const Tunings = {
  UKE: ['G', 'C', 'E', 'A'],
  GUITAR: ['E', 'A', 'D', 'G', 'B', 'E'],
};

describe('chordParser', () => {
  describe('runLine', () => {
    const tests = [{
      name: 'full definition (Happy Path)',
      tuning: Tunings.UKE,
      input: '{define: A frets 2 1 0 0 fingers 3 3 0 0}',
      expectedResult: {
        dots: [
          { finger: 3, fret: 2, string: 0 },
          { finger: 3, fret: 1, string: 1 },
        ],
        muted: [false, false, false, false],
        name: 'A',
      },
    }, {
      name: 'common (no fingers) (Happy Path)',
      tuning: Tunings.UKE,
      input: '{define: Am7 frets 0 0 0 0}',
      expectedResult: {
        dots: [],
        muted: [false, false, false, false],
        name: 'Am7',
      },
    }, {
      name: 'missing name (Invalid define)',
      tuning: Tunings.UKE,
      input: '{define: frets 0 0 0 0}',
      expectedResult: null,
    }, {
      name: 'no space in "define"',
      tuning: Tunings.UKE,
      input: '{define:A frets 2 1 0 0}',
      expectedResult: {
        dots: [
          { finger: 0, fret: 2, string: 0 },
          { finger: 0, fret: 1, string: 1 },
        ],
        muted: [false, false, false, false],
        name: 'A',
      },
    }, {
      name: 'with Add-Ins',
      tuning: Tunings.UKE,
      input: '{define: G#m6 frets 1 3 1 2 fingers 4 6 8 12 add: string 2 fret 8 finger 2 add: string 4 fret 7 finger 1}',
      expectedResult: {
        dots: [
          { finger: 4, fret: 1, string: 0 },
          { finger: 6, fret: 3, string: 1 },
          { finger: 8, fret: 1, string: 2 },
          { finger: 12, fret: 2, string: 3 },
          { finger: 2, fret: 8, string: 1 },
          { finger: 1, fret: 7, string: 3 },
        ],
        muted: [false, false, false, false],
        name: 'G#m6',
      },
    }, {
      name: 'Muted Strings',
      tuning: Tunings.UKE,
      input: '{define: D5 frets 2 2 X X fingers 1 1 2 2}',
      expectedResult: {
        dots: [
          { finger: 1, fret: 2, string: 0 },
          { finger: 1, fret: 2, string: 1 },
        ],
        muted: [false, false, true, true],
        name: 'D5',
      },
    }, {
      name: 'Add-Ins ONLY',
      tuning: Tunings.UKE,
      input: '{define: G#m6 add: string 2 fret 1 finger 1 add: string 4 fret 1 finger 3}',
      expectedResult: {
        dots: [
          { finger: 1, fret: 1, string: 1 },
          { finger: 3, fret: 1, string: 3 },
        ],
        muted: [],
        name: 'G#m6',
      },
    }, {
      name: 'Name Only',
      tuning: Tunings.UKE,
      input: '{define: Sad}',
      expectedResult: {
        dots: [],
        muted: [],
        name: 'Sad',
      },
    }, {
      name: 'Wide Spacing',
      tuning: Tunings.UKE,
      input: '{  define   :  DoubleWide         frets            2    1 0      8    }',
      expectedResult: {
        dots: [
          { finger: 0, fret: 2, string: 0 },
          { finger: 0, fret: 1, string: 1 },
          { finger: 0, fret: 8, string: 3 },
        ],
        muted: [false, false, false, false],
        name: 'DoubleWide',
      },
    }, {
      name: '"A" Packed Frets & Fingers',
      tuning: Tunings.UKE,
      input: '{define: A frets 2101 fingers 2103}',
      expectedResult: {
        dots: [
          { finger: 2, fret: 2, string: 0 },
          { finger: 1, fret: 1, string: 1 },
          { finger: 3, fret: 1, string: 3 },
        ],
        muted: [false, false, false, false],
        name: 'A',
      },
    }, {
      name: '"Gm7b5" Packed Frets & Fingers',
      tuning: Tunings.UKE,
      input: '{define: Gm7b5 frets 0111 fingers 0211}',
      expectedResult: {
        dots: [
          { finger: 2, fret: 1, string: 1 },
          { finger: 1, fret: 1, string: 2 },
          { finger: 1, fret: 1, string: 3 },
        ],
        muted: [false, false, false, false],
        name: 'Gm7b5',
      },
    }, {
      name: 'Guitar with packed strings',
      tuning: Tunings.GUITAR,
      input: '{define: G frets 310000 fingers 210003}',
      expectedResult: {
        name: 'G',
        dots: [
          { finger: 2, fret: 3, string: 0 },
          { finger: 1, fret: 1, string: 1 },
        ],
        muted: [false, false, false, false, false, false],
      },
    }, {
      name: 'Guitar (Happy Path)',
      tuning: Tunings.GUITAR,
      input: '{define: G# frets 3 1 0 0 0 0 fingers 2 1 0 0 0 3}',
      expectedResult: {
        name: 'G#',
        dots: [
          { finger: 2, fret: 3, string: 0 },
          { finger: 1, fret: 1, string: 1 },
        ],
        muted: [false, false, false, false, false, false],
      },
    }, {
      name: 'Guitar Muted Strings',
      tuning: Tunings.GUITAR,
      input: '{define: Daug7dim2 frets X X 0 2 3 2 fingers 0 0 0 1 2 3}',
      expectedResult: {
        name: 'Daug7dim2',
        dots: [
          { finger: 1, fret: 2, string: 3 },
          { finger: 2, fret: 3, string: 4 },
          { finger: 3, fret: 2, string: 5 },
        ],
        muted: [true, true, false, false, false, false],
      },
    }];

    tests.forEach(({ input, tuning, expectedResult, name }) => {
      it(`should correctly parse ${name}`, () => {
        settings.tuning = tuning;

        const result = runLine(input);

        expect(result).toEqual(expectedResult);
      });
    });
  });
});
