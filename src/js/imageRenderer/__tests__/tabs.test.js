import { settings } from '../../configs';
import tabTests from './data/tab.generateTabSvg';

import { generateTabSvg } from '../tabSVG';

describe('tab', () => {
  describe('generateTabSvg', () => {
    tabTests.forEach(({ tabs, tuning, hasLabels, expectedResult, name, skip }) => {
      if (skip) {
        return;
      }
      it(`should render tablature "${name}"`, () => {
        settings.tuning = tuning;
        const svg = generateTabSvg({ tabs, hasLabels });

        expect(svg).toBe(expectedResult);
      });
    });
  });
});
