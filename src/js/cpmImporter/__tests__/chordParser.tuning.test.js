import { __test__ } from '../chordParser';

describe('cpmParser', () => {
  describe('getTuning', () => {
    const { getTuning } = __test__;
    const Tests = [{
      name: 'Blank',
      input: '',
      expectedResult: null,
    }, {
      name: 'Soprano Uke',
      input: '{tuning: G C E A}',
      expectedResult: ['G', 'C', 'E', 'A'],
    }, {
      name: 'Guitar',
      input: '{tuning: E A D G B E}',
      expectedResult: ['E', 'A', 'D', 'G', 'B', 'E'],
    }, {
      name: 'valid with odd spacing',
      input: '    {    tuning    :     M    🧪 Eeek      A-P-R00    }   ',
      expectedResult: ['M', '🧪', 'Eeek', 'A-P-R00'],
    }];

    Tests.forEach(({ name, input, expectedResult }) => {
      it(`should parse ${name}`, () => {
        const results = getTuning(input);
        if (expectedResult === null) {
          expect(results).toBe(expectedResult);
        } else {
          expect(results).toEqual(expect.objectContaining(expectedResult));
        }
      });
    });
  });
});
