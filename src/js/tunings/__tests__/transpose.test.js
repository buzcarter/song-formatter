import * as transpose from '../transpose';

describe('transpose', () => {
  describe('getTone', () => {
    const { getTone } = transpose;

    it('should handle missing data', () => {
      const input = null;
      const expectedResult = null;
      const result = getTone(input);
      expect(result).toEqual(expectedResult);
    });

    it('should correctly parse values', () => {
      const tests = [{
        value: 'A',
        expectedResult: {
          prefix: 'A',
          suffix: '',
          tone: 0,
        },
      }, {
        value: 'C#dim7',
        expectedResult: {
          prefix: 'C#',
          suffix: 'dim7',
          tone: 4,
        },
      }];

      tests.forEach(({ value, expectedResult }) => {
        const result = getTone(value);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('shift', () => {
    const { shift } = transpose;

    it('should handle missing data', () => {
      const input = null;
      const expectedResult = null;
      const result = shift(input, 8);
      expect(result).toEqual(expectedResult);
    });

    it('should correctly parse values', () => {
      const tests = [{
        value: 'A',
        steps: 3,
        expectedResult: 'C',
      }, {
        value: 'C#dim7',
        steps: 7,
        expectedResult: 'Abdim7',
      }];

      tests.forEach(({ value, steps, expectedResult }) => {
        const result = shift(value, steps);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
