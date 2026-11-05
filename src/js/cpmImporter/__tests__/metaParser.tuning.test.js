import { __test__, runBlock } from '../metaParser';

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
          expect(results).toEqual(expectedResult);
        }
      });
    });
  });

  describe('runBlock', () => {
    it('should read the same chords whether or not the block has line breaks', () => {
      const lines = ['{instrument: Tiny Uke}', '{tuning: G C E A}', '{define: A frets 2 1 0 0}', '{define: Am frets 2 0 0 0}'];
      const multiLine = runBlock(lines.join('\n'));
      const oneLine = runBlock(lines.join(''));
      expect(multiLine.chords.map(({ name }) => name)).toEqual(['A', 'Am']);
      expect(oneLine).toEqual(multiLine);
    });
  });
});
