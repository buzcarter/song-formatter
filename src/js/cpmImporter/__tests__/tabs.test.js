import { settings } from '../../configs';
import TestData from './data/tabs.data';
const { __test__ } = require('../tabs');

describe('tabs', () => {
  describe('getFretNumbers', () => {
    const { getFretNumbers } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { tuning, frets, tabStrings } = TestData[name];
        it(`should parse values for ${name} correctly`, () => {
          settings.tuning = tuning;
          const result = getFretNumbers(tabStrings);
          expect(result).toEqual(frets);
        });
      });
  });

  describe('getGuideLine', () => {
    const { getGuideLine } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { tuning, guide, symbols, minLength } = TestData[name];
        it(`should generate Guide ${name} correctly (${tuning})`, () => {
          settings.tuning = tuning;
          const result = getGuideLine(symbols, minLength);
          expect(result).toEqual(guide);
        });
      });
  });

  describe('getMinLineLength', () => {
    const { getMinLineLength } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { tuning, minLength, tabStrings } = TestData[name];
        it(`should calculate shortest required length ${name} correctly`, () => {
          settings.tuning = tuning;
          const result = getMinLineLength(tabStrings);
          expect(result).toEqual(minLength);
        });
      });
  });

  describe('getPackedLines', () => {
    const { getPackedLines } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { tuning, frets, symbols, guide, minLength, tabs } = TestData[name];
        settings.tuning = tuning;
        const result = getPackedLines(frets, symbols, guide, minLength);
        result.forEach((expectedLine, lineNbr) => {
          it(`should complete tabs for ${name} (${lineNbr}) correctly`, () => {
            expect(expectedLine).toEqual(tabs[lineNbr]);
          });
        });
      });
  });

  describe('getSymbols', () => {
    const { getSymbols } = __test__;
    Object.keys(TestData)
      .forEach((name) => {
        const { tuning, symbols, tabStrings } = TestData[name];
        it(`should tokenize ${name} correctly`, () => {
          settings.tuning = tuning;
          const result = getSymbols(tabStrings);
          expect(result).toEqual(symbols);
        });
      });
  });
});
