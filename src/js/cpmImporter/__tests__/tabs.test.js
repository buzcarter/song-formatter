import TestData from './data/tabs.data';
const { __test__ } = require('../tabs');

describe('chordBrush', () => {
  describe('getFretNumbers', () => {
    const { getFretNumbers } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { frets, tabStrings } = TestData[name];
        it(`should parse values for ${name} correctly`, () => {
          const result = getFretNumbers(tabStrings);
          expect(result).toEqual(frets);
        });
      });
  });

  describe('getGuideLine', () => {
    const { getGuideLine } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { guide, symbols, minLength } = TestData[name];
        it(`should summarize ${name} correctly`, () => {
          const result = getGuideLine(symbols, minLength);
          expect(result).toEqual(guide);
        });
      });
  });

  describe('getMinLineLength', () => {
    const { getMinLineLength } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { minLength, tabStrings } = TestData[name];
        it(`should calculate shortest required length ${name} correctly`, () => {
          const result = getMinLineLength(tabStrings);
          expect(result).toEqual(minLength);
        });
      });
  });

  describe('getPackedLines', () => {
    const { getPackedLines } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { frets, symbols, guide, minLength, tabs } = TestData[name];
        it(`should complete tabs for ${name} correctly`, () => {
          const result = getPackedLines(frets, symbols, guide, minLength);
          expect(result).toEqual(tabs);
        });
      });
  });

  describe('getSymbols', () => {
    const { getSymbols } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { symbols, tabStrings } = TestData[name];
        it(`should tokenize ${name} correctly`, () => {
          const result = getSymbols(tabStrings);
          expect(result).toEqual(symbols);
        });
      });
  });
});
